import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Table, Input, message } from "antd";
import axios from "axios";
import Header from "src/components/Header";
import Sidebar from "src/components/Sidebar";
import {
  imagesend,
  plusicon,
  refreshicon,
  searchnormal,
  blogimg2,
} from "src/components/imagepath";
import { onShowSizeChange, itemRender } from "src/components/Pagination";
import { Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";

const STORAGE_KEY = "appointments";

const API_URL = (
  process.env.REACT_APP_API_URL || "http://localhost:8000"
).replace(/\/$/, "");

// Primary and fallback endpoints
const PRIMARY_APPOINTMENTS_URL = `${API_URL}/api/v1/bookings`;
const FALLBACK_APPOINTMENTS_URL = `${API_URL}/api/appointments`;

const AppoinmentList = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [datasource, setDatasource] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Helper to load appointments saved locally in browser storage
  const getLocalAppointments = () => {
    try {
      const localData = localStorage.getItem(STORAGE_KEY);
      const parsed = localData ? JSON.parse(localData) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error("Error reading localStorage appointments:", e);
      return [];
    }
  };

  // Fetch appointments from Express/MongoDB API + Merge with local storage fallback
  const loadAppointments = useCallback(async () => {
    setLoading(true);

    let apiAppointments = [];
    try {
      const token = localStorage.getItem("token");
      const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

      let response;
      try {
        response = await axios.get(PRIMARY_APPOINTMENTS_URL, {
          headers: authHeaders,
          withCredentials: true,
        });
      } catch (err) {
        if (err.response?.status === 404) {
          response = await axios.get(FALLBACK_APPOINTMENTS_URL, {
            headers: authHeaders,
            withCredentials: true,
          });
        } else {
          throw err;
        }
      }

      const resData = response.data;
      const extracted = Array.isArray(resData)
        ? resData
        : resData?.data || resData?.appointments || resData?.bookings || [];

      if (Array.isArray(extracted)) {
        apiAppointments = extracted;
      }
    } catch (error) {
      console.warn(
        "API fetch failed or returned empty; utilizing local storage records:",
        error.message
      );
    }

    const localList = getLocalAppointments();

    // Combine API list and localStorage list without duplicates
    const combinedList = [...apiAppointments];
    localList.forEach((localItem) => {
      const exists = combinedList.some(
        (apiItem) =>
          (apiItem._id && String(apiItem._id) === String(localItem.id)) ||
          (apiItem.id && String(apiItem.id) === String(localItem.id)) ||
          (apiItem.patientName === localItem.name && apiItem.date === localItem.date)
      );
      if (!exists) {
        combinedList.push(localItem);
      }
    });

    const formattedAppointments = combinedList.map((item, index) => {
      const patient =
        item.patient && typeof item.patient === "object"
          ? item.patient
          : item.user && typeof item.user === "object"
          ? item.user
          : {};

      const doctor =
        item.doctor && typeof item.doctor === "object"
          ? item.doctor
          : {};

      const dateValue = item.date || item.appointmentDate || item.createdAt || "";
      const parsedDate = dateValue ? new Date(dateValue) : null;

      const formattedDate =
        parsedDate && !Number.isNaN(parsedDate.getTime())
          ? parsedDate.toLocaleDateString("en-GB")
          : dateValue || "N/A";

      const formattedTime =
        item.time ||
        item.startTime ||
        (parsedDate && !Number.isNaN(parsedDate.getTime())
          ? parsedDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "N/A");

      return {
        id: String(item._id || item.id || `appointment-${index}`),
        Img: item.Img || item.image || patient.photo || doctor.photo || blogimg2,
        Name:
          item.name ||
          item.patientName ||
          patient.name ||
          patient.username ||
          `${item.firstName || ""} ${item.lastName || ""}`.trim() ||
          "N/A",
        ConsultingDoctor:
          item.consultingDoctor ||
          item.doctorName ||
          doctor.name ||
          doctor.username ||
          "N/A",
        Treatment:
          item.treatment ||
          item.reason ||
          item.ticketPrice ||
          "General Consultation",
        Mobile: item.mobile || patient.phone || patient.mobile || "N/A",
        Email: item.email || patient.email || "N/A",
        Date: formattedDate,
        Time: formattedTime,
      };
    });

    setDatasource(formattedAppointments);
    setSelectedRowKeys([]);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadAppointments();

    // Listen for events dispatched when a new appointment is submitted
    const handleUpdatedEvent = () => loadAppointments();
    window.addEventListener("appointmentUpdated", handleUpdatedEvent);

    return () => {
      window.removeEventListener("appointmentUpdated", handleUpdatedEvent);
    };
  }, [loadAppointments]);

  // Filter appointments for search
  const filteredAppointments = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    if (!query) return datasource;

    return datasource.filter((appointment) =>
      [
        appointment.Name,
        appointment.ConsultingDoctor,
        appointment.Treatment,
        appointment.Mobile,
        appointment.Email,
        appointment.Date,
        appointment.Time,
      ].some((value) =>
        String(value || "").toLowerCase().includes(query)
      )
    );
  }, [datasource, searchText]);

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  // Delete appointment
  const handleDelete = async () => {
    if (!deleteId || deleting) return;

    setDeleting(true);

    try {
      // 1. Delete from backend API if applicable
      const token = localStorage.getItem("token");
      const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

      try {
        await axios.delete(
          `${PRIMARY_APPOINTMENTS_URL}/${encodeURIComponent(deleteId)}`,
          {
            headers: authHeaders,
            withCredentials: true,
          }
        );
      } catch (err) {
        console.warn("Backend delete endpoint error:", err.message);
      }

      // 2. Delete from local storage
      const localList = getLocalAppointments();
      const updatedLocal = localList.filter(
        (item) => String(item.id) !== String(deleteId)
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLocal));

      message.success("Appointment deleted successfully.");
      setDeleteId(null);
      setSelectedRowKeys((previous) =>
        previous.filter((id) => String(id) !== String(deleteId))
      );

      await loadAppointments();
    } catch (error) {
      console.error("Unable to delete appointment:", error);
      message.error("Unable to delete appointment.");
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "Name",
      key: "Name",
      sorter: (a, b) => a.Name.localeCompare(b.Name),
      render: (_, record) => (
        <h2 className="profile-image">
          <Link to="#" className="avatar avatar-sm me-2">
            <img
              className="avatar-img rounded-circle"
              src={record.Img}
              alt="Patient"
            />
          </Link>
          <Link to="#">{record.Name}</Link>
        </h2>
      ),
    },
    {
      title: "Consulting Doctor",
      dataIndex: "ConsultingDoctor",
      key: "ConsultingDoctor",
      sorter: (a, b) =>
        a.ConsultingDoctor.localeCompare(b.ConsultingDoctor),
    },
    {
      title: "Treatment",
      dataIndex: "Treatment",
      key: "Treatment",
      sorter: (a, b) => a.Treatment.localeCompare(b.Treatment),
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
      render: (email) => <Link to="#">{email}</Link>,
    },
    {
      title: "Date",
      dataIndex: "Date",
      key: "Date",
      sorter: (a, b) => a.Date.localeCompare(b.Date),
    },
    {
      title: "Time",
      dataIndex: "Time",
      key: "Time",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="text-end">
          <div className="dropdown dropdown-action">
            <button
              type="button"
              className="action-icon dropdown-toggle btn"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              aria-label={`Actions for ${record.Name}`}
            >
              <i className="fas fa-ellipsis-v" />
            </button>

            <div className="dropdown-menu dropdown-menu-end">
              <button
                type="button"
                className="dropdown-item"
                onClick={() =>
                  message.info("Appointment editing is not implemented yet.")
                }
              >
                <i className="far fa-edit me-2" />
                Edit
              </button>

              <button
                type="button"
                className="dropdown-item"
                data-bs-toggle="modal"
                data-bs-target="#delete_appointment"
                onClick={() => setDeleteId(record.id)}
              >
                <i className="fa fa-trash-alt me-2" />
                Delete
              </button>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <Header />

      <Sidebar
        id="menu-item4"
        id1="menu-items4"
        activeClassName="appoinment-list"
      />

      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/appointmentlist">Appointment</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <FeatherIcon icon="chevron-right" />
                  </li>
                  <li className="breadcrumb-item active">
                    Appointment List
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
                          <h3>Appointment List</h3>

                          <div className="doctor-search-blk">
                            <div className="top-nav-search table-search-blk">
                              <Input
                                allowClear
                                value={searchText}
                                onChange={(e) =>
                                  setSearchText(e.target.value)
                                }
                                placeholder="Search appointments..."
                                prefix={
                                  <img
                                    src={searchnormal}
                                    alt=""
                                    style={{ width: 18 }}
                                  />
                                }
                              />
                            </div>

                            <div className="add-group">
                              <Link
                                to="/addappoinments"
                                className="btn btn-primary add-pluss ms-2"
                                title="Add appointment"
                              >
                                <img src={plusicon} alt="Add" />
                              </Link>

                              <button
                                type="button"
                                className="btn btn-primary doctor-refresh ms-2"
                                onClick={loadAppointments}
                                disabled={loading}
                                title="Refresh appointments"
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
                      dataSource={filteredAppointments}
                      loading={loading}
                      rowSelection={rowSelection}
                      locale={{
                        emptyText: loading
                          ? "Loading appointments..."
                          : "No appointments found.",
                      }}
                      pagination={{
                        total: filteredAppointments.length,
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

      <div
        id="delete_appointment"
        className="modal fade delete-modal"
        role="dialog"
        aria-labelledby="deleteAppointmentTitle"
        aria-modal="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body text-center">
              <img
                src={imagesend}
                alt="Warning"
                width={50}
                height={46}
              />

              <h3 id="deleteAppointmentTitle">
                Are you sure you want to delete this appointment?
              </h3>

              <div className="m-t-20">
                <button
                  type="button"
                  className="btn btn-white me-2"
                  data-bs-dismiss="modal"
                  onClick={() => setDeleteId(null)}
                  disabled={deleting}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="btn btn-danger"
                  data-bs-dismiss="modal"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AppoinmentList;