import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Table, message } from "antd";
import Header from "src/components/Header";
import Sidebar from "src/components/Sidebar";
import { onShowSizeChange, itemRender } from "src/components/Pagination";
import {
  blogimg2,
  plusicon,
  refreshicon,
  searchnormal,
} from "src/components/imagepath";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = (
  process.env.REACT_APP_API_URL || "http://localhost:8000"
).replace(/\/$/, "");

const PATIENTS_API_URL = `${API_URL}/api/v1/patients`;

const PatientsList = () => {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load patients from MongoDB backend API with localStorage fallback & defaults
  const loadPatients = useCallback(async () => {
    setLoading(true);

    let apiPatients = [];
    try {
      const token = localStorage.getItem("token");
      const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.get(PATIENTS_API_URL, {
        headers: authHeaders,
        withCredentials: true,
      });

      const resData = response.data;
      const extracted = Array.isArray(resData)
        ? resData
        : resData?.data || resData?.patients || [];

      if (Array.isArray(extracted)) {
        apiPatients = extracted;
      }
    } catch (err) {
      console.warn("API patient fetch failed, utilizing local storage:", err.message);
    }

    // Read both 'patientsList' and 'patients' keys for complete compatibility
    let localPatients = [];
    try {
      const savedList = JSON.parse(localStorage.getItem("patientsList") || "[]");
      const saved = JSON.parse(localStorage.getItem("patients") || "[]");
      localPatients = Array.isArray(savedList) && savedList.length > 0 ? savedList : saved;
    } catch (e) {
      console.error("Error reading localStorage patients:", e);
    }

    // If both API and LocalStorage are empty, seed with initial default patient
    if (apiPatients.length === 0 && localPatients.length === 0) {
      localPatients = [
        {
          id: 1,
          name: "Shivam Kumar",
          department: "Orthopedics",
          designation: "IT",
          education: "B.Tech",
          mobile: "9693899960",
          email: "ayush@gmail.com",
          createdAt: new Date().toISOString(),
          status: "Active",
        },
      ];
      localStorage.setItem("patientsList", JSON.stringify(localPatients));
      localStorage.setItem("patients", JSON.stringify(localPatients));
    }

    // Merge API list and local list without duplicates
    const combinedList = [...apiPatients];
    localPatients.forEach((localItem) => {
      const exists = combinedList.some(
        (apiItem) =>
          (apiItem._id && String(apiItem._id) === String(localItem.id || localItem._id)) ||
          (apiItem.email && apiItem.email.toLowerCase() === localItem.email?.toLowerCase())
      );
      if (!exists) {
        combinedList.push(localItem);
      }
    });

    const formattedPatients = combinedList.map((patient, index) => ({
      ...patient,
      id: String(patient._id || patient.id || `patient-${index}`),
      Name:
        patient.name ||
        [patient.firstName, patient.lastName].filter(Boolean).join(" ") ||
        patient.userName ||
        "Unnamed Patient",
      Department: patient.department || "—",
      Specialization: patient.designation || patient.specialization || "—",
      Degree: patient.education || patient.degree || "—",
      Mobile: patient.mobile || patient.phone || "—",
      Email: patient.email || "—",
      JoiningDate: patient.joiningDate || (patient.createdAt
        ? new Date(patient.createdAt).toLocaleDateString("en-GB")
        : "24/10/2026"),
      status: patient.status || "Active",
      Img: patient.avatarUrl || blogimg2,
    }));

    setPatients(formattedPatients);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadPatients();

    const handlePatientUpdated = () => loadPatients();
    const handleStorage = (event) => {
      if (!event.key || event.key === "patients" || event.key === "patientsList") {
        loadPatients();
      }
    };

    window.addEventListener("patientUpdated", handlePatientUpdated);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("patientUpdated", handlePatientUpdated);
      window.removeEventListener("storage", handleStorage);
    };
  }, [loadPatients]);

  const filteredPatients = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    if (!query) return patients;

    return patients.filter((patient) =>
      [
        patient.Name,
        patient.Department,
        patient.Specialization,
        patient.Degree,
        patient.Mobile,
        patient.Email,
        patient.city,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }, [patients, searchText]);

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  const handleEdit = (patient) => {
    localStorage.setItem("selectedPatientId", patient.id);
    navigate(`/editpatients/${encodeURIComponent(patient.id)}`);
  };

  const handleDelete = async () => {
    if (!patientToDelete) return;

    try {
      const token = localStorage.getItem("token");
      const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

      // 1. Attempt Delete from Backend API
      try {
        await axios.delete(
          `${PATIENTS_API_URL}/${encodeURIComponent(patientToDelete.id)}`,
          {
            headers: authHeaders,
            withCredentials: true,
          }
        );
      } catch (err) {
        console.warn("Backend patient delete error:", err.message);
      }

      // 2. Remove from LocalStorage (Both keys)
      const removeFilter = (item) => String(item.id || item._id) !== String(patientToDelete.id);
      
      const savedList = JSON.parse(localStorage.getItem("patientsList") || "[]");
      const updatedList = savedList.filter(removeFilter);
      localStorage.setItem("patientsList", JSON.stringify(updatedList));

      const saved = JSON.parse(localStorage.getItem("patients") || "[]");
      const updated = saved.filter(removeFilter);
      localStorage.setItem("patients", JSON.stringify(updated));

      window.dispatchEvent(new Event("patientUpdated"));

      setPatients((previous) =>
        previous.filter(
          (patient) => String(patient.id) !== String(patientToDelete.id)
        )
      );

      setSelectedRowKeys((previous) =>
        previous.filter(
          (key) => String(key) !== String(patientToDelete.id)
        )
      );

      setPatientToDelete(null);
      message.success("Patient deleted successfully.");
    } catch (error) {
      console.error("Unable to delete patient:", error);
      message.error("Could not delete patient.");
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "Name",
      key: "Name",
      sorter: (a, b) => a.Name.localeCompare(b.Name),
      render: (_, record) => (
        <div className="profile-image">
          <img
            className="avatar-img rounded-circle me-2"
            src={record.Img}
            alt={record.Name}
            width={35}
            height={35}
          />
          <span>{record.Name}</span>
        </div>
      ),
    },
    {
      title: "Department",
      dataIndex: "Department",
      key: "Department",
      sorter: (a, b) => a.Department.localeCompare(b.Department),
    },
    {
      title: "Designation",
      dataIndex: "Specialization",
      key: "Specialization",
      sorter: (a, b) => a.Specialization.localeCompare(b.Specialization),
    },
    {
      title: "Education",
      dataIndex: "Degree",
      key: "Degree",
      sorter: (a, b) => a.Degree.localeCompare(b.Degree),
    },
    {
      title: "Mobile",
      dataIndex: "Mobile",
      key: "Mobile",
    },
    {
      title: "Email",
      dataIndex: "Email",
      key: "Email",
      sorter: (a, b) => a.Email.localeCompare(b.Email),
    },
    {
      title: "Joining Date",
      dataIndex: "JoiningDate",
      key: "JoiningDate",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, record) => (
        <span className="badge bg-success-light">{record.status || "Active"}</span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-sm btn-primary"
            onClick={() => handleEdit(record)}
          >
            Edit
          </button>

          <button
            type="button"
            className="btn btn-sm btn-danger"
            onClick={() => setPatientToDelete(record)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Header />

      <Sidebar
        id="menu-item2"
        id1="menu-items2"
        activeClassName="patient-list"
      />

      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/patientlist">Patients</Link>
                  </li>
                  <li className="breadcrumb-item active">
                    Patients List
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12">
              <div className="card card-table show-entire">
                <div className="card-body">
                  <div className="page-table-header mb-2">
                    <div className="row align-items-center">
                      <div className="col">
                        <div className="doctor-table-blk">
                          <h3>Patients List</h3>

                          <div className="doctor-search-blk">
                            <div className="top-nav-search table-search-blk">
                              <form
                                onSubmit={(event) => event.preventDefault()}
                              >
                                <input
                                  type="search"
                                  className="form-control"
                                  placeholder="Search name, email, mobile..."
                                  value={searchText}
                                  onChange={(event) =>
                                    setSearchText(event.target.value)
                                  }
                                />
                                <button type="submit" className="btn">
                                  <img src={searchnormal} alt="Search" />
                                </button>
                              </form>
                            </div>

                            <div className="add-group">
                              <Link
                                to="/addpatients"
                                className="btn btn-primary add-pluss ms-2"
                                title="Add Patient"
                              >
                                <img src={plusicon} alt="Add patient" />
                              </Link>

                              <button
                                type="button"
                                className="btn btn-primary doctor-refresh ms-2"
                                onClick={loadPatients}
                                title="Refresh patient list"
                              >
                                <img src={refreshicon} alt="Refresh" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="table-responsive doctor-list">
                    <Table
                      rowKey="id"
                      columns={columns}
                      dataSource={filteredPatients}
                      loading={loading}
                      rowSelection={rowSelection}
                      locale={{
                        emptyText: searchText
                          ? "No patients match your search."
                          : "No patients found. Click Add Patient to create one.",
                      }}
                      pagination={{
                        total: filteredPatients.length,
                        showTotal: (total, range) =>
                          `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                        showSizeChanger: true,
                        onShowSizeChange: onShowSizeChange,
                        itemRender: itemRender,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {patientToDelete && (
        <div
          className="modal d-block"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-patient-title"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body text-center p-4">
                <h4 id="delete-patient-title">Delete Patient?</h4>
                <p>
                  Are you sure you want to delete{" "}
                  <strong>{patientToDelete.Name}</strong>?
                </p>

                <button
                  type="button"
                  className="btn btn-white me-2"
                  onClick={() => setPatientToDelete(null)}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDelete}
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PatientsList;