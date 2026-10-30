import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Table, message } from "antd";
import Header from "src/components/Header";
import Sidebar from "src/components/Sidebar";
import {
  blogimg2,
  plusicon,
  refreshicon,
  searchnormal,
} from "src/components/imagepath";
import { Link } from "react-router-dom";
import axios from "axios";

const API_URL = (
  process.env.REACT_APP_API_URL || "http://localhost:8000"
).replace(/\/$/, "");

const DOCTORS_API_URL = `${API_URL}/api/v1/doctors`;

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [doctorToDelete, setDoctorToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load doctors from backend API with localStorage fallback
  const loadDoctors = useCallback(async () => {
    setLoading(true);

    let apiDoctors = [];
    try {
      const response = await axios.get(DOCTORS_API_URL, {
        withCredentials: true,
      });

      const resData = response.data;
      const extracted = Array.isArray(resData)
        ? resData
        : resData?.data || [];

      if (Array.isArray(extracted)) {
        apiDoctors = extracted;
      }
    } catch (err) {
      console.warn("API doctor fetch failed, utilizing local storage:", err.message);
    }

    // Read local storage fallback records
    let localDoctors = [];
    try {
      const savedList = JSON.parse(localStorage.getItem("doctorsList") || "[]");
      const saved = JSON.parse(localStorage.getItem("doctors") || "[]");
      localDoctors = Array.isArray(savedList) && savedList.length > 0 ? savedList : saved;
    } catch (e) {
      console.error("Error reading localStorage doctors:", e);
    }

    // Default mock sample if everything is empty
    if (apiDoctors.length === 0 && localDoctors.length === 0) {
      localDoctors = [
        {
          id: 1,
          name: "Ayush Kumar",
          department: "Radiology",
          specialization: "Radiology",
          mobile: "9693899960",
          email: "ayush@gmail.com",
          createdAt: new Date().toISOString(),
          status: "Active",
        },
      ];
      localStorage.setItem("doctorsList", JSON.stringify(localDoctors));
    }

    // Merge API list and local list without duplicates
    const combinedList = [...apiDoctors];
    localDoctors.forEach((localItem) => {
      const exists = combinedList.some(
        (apiItem) =>
          (apiItem._id && String(apiItem._id) === String(localItem.id || localItem._id)) ||
          (apiItem.email && apiItem.email.toLowerCase() === localItem.email?.toLowerCase())
      );
      if (!exists) {
        combinedList.push(localItem);
      }
    });

    const formattedDoctors = combinedList.map((doc, index) => ({
      ...doc,
      id: String(doc._id || doc.id || `doc-${index}`),
      Name: doc.name || "Unnamed Doctor",
      Department: doc.department || doc.specialization || "General",
      Specialization: doc.specialization || "—",
      Degree: doc.degree || "MBBS",
      Mobile: doc.mobile || doc.phone || "—",
      Email: doc.email || "—",
      JoiningDate: doc.createdAt
        ? new Date(doc.createdAt).toLocaleDateString("en-GB")
        : "24/10/2026",
      status: doc.isApproved === "approved" ? "Active" : doc.status || "Active",
      Img: doc.avatarUrl || blogimg2,
    }));

    setDoctors(formattedDoctors);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadDoctors();

    const handleDoctorUpdated = () => loadDoctors();
    window.addEventListener("doctorUpdated", handleDoctorUpdated);

    return () => {
      window.removeEventListener("doctorUpdated", handleDoctorUpdated);
    };
  }, [loadDoctors]);

  const filteredDoctors = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    if (!query) return doctors;

    return doctors.filter((doc) =>
      [
        doc.Name,
        doc.Department,
        doc.Specialization,
        doc.Mobile,
        doc.Email,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }, [doctors, searchText]);

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  const handleDelete = async () => {
    if (!doctorToDelete) return;

    try {
      try {
        await axios.delete(`${DOCTORS_API_URL}/${encodeURIComponent(doctorToDelete.id)}`, {
          withCredentials: true,
        });
      } catch (err) {
        console.warn("Backend doctor delete error:", err.message);
      }

      const removeFilter = (item) => String(item.id || item._id) !== String(doctorToDelete.id);
      
      const savedList = JSON.parse(localStorage.getItem("doctorsList") || "[]");
      localStorage.setItem("doctorsList", JSON.stringify(savedList.filter(removeFilter)));

      const saved = JSON.parse(localStorage.getItem("doctors") || "[]");
      localStorage.setItem("doctors", JSON.stringify(saved.filter(removeFilter)));

      window.dispatchEvent(new Event("doctorUpdated"));

      setDoctors((previous) =>
        previous.filter((doc) => String(doc.id) !== String(doctorToDelete.id))
      );

      setDoctorToDelete(null);
      message.success("Doctor deleted successfully.");
    } catch (error) {
      console.error("Unable to delete doctor:", error);
      message.error("Could not delete doctor.");
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
      title: "Specialization",
      dataIndex: "Specialization",
      key: "Specialization",
    },
    {
      title: "Degree",
      dataIndex: "Degree",
      key: "Degree",
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
      render: (status) => (
        <span className="badge bg-success-light">{status}</span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-sm btn-danger"
            onClick={() => setDoctorToDelete(record)}
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
        id="menu-item1"
        id1="menu-items1"
        activeClassName="doctor-list"
      />

      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="#">Doctors</Link>
                  </li>
                  <li className="breadcrumb-item active">
                    Doctors List
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
                          <h3>Doctors List</h3>

                          <div className="doctor-search-blk">
                            <div className="top-nav-search table-search-blk">
                              <form onSubmit={(e) => e.preventDefault()}>
                                <input
                                  type="search"
                                  className="form-control"
                                  placeholder="Search name, email, mobile..."
                                  value={searchText}
                                  onChange={(e) => setSearchText(e.target.value)}
                                />
                                <button type="submit" className="btn">
                                  <img src={searchnormal} alt="Search" />
                                </button>
                              </form>
                            </div>

                            <div className="add-group">
                              <Link
                                to="/add-doctor"
                                className="btn btn-primary add-pluss ms-2"
                                title="Add Doctor"
                              >
                                <img src={plusicon} alt="Add doctor" />
                              </Link>

                              <button
                                type="button"
                                className="btn btn-primary doctor-refresh ms-2"
                                onClick={loadDoctors}
                                title="Refresh doctor list"
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
                      dataSource={filteredDoctors}
                      loading={loading}
                      rowSelection={rowSelection}
                      locale={{
                        emptyText: searchText
                          ? "No doctors match your search."
                          : "No doctors found.",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {doctorToDelete && (
        <div
          className="modal d-block"
          role="dialog"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body text-center p-4">
                <h4>Delete Doctor?</h4>
                <p>
                  Are you sure you want to delete{" "}
                  <strong>{doctorToDelete.Name}</strong>?
                </p>

                <button
                  type="button"
                  className="btn btn-white me-2"
                  onClick={() => setDoctorToDelete(null)}
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

export default DoctorList;