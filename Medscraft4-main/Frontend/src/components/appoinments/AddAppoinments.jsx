/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Header from "src/components/Header";
import Sidebar from "src/components/Sidebar";
import { DatePicker } from "antd";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";
import Select from "react-select";
import { TextField } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const STORAGE_KEY = "appointments";

const API_URL = (
  process.env.REACT_APP_API_URL || "http://localhost:8000"
).replace(/\/$/, "");

const BOOKING_API_URL = `${API_URL}/api/v1/bookings`;
const FALLBACK_API_URL = `${API_URL}/api/appointments`;

const AddAppoinments = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [treatment, setTreatment] = useState("");
  const [notes, setNotes] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const doctor = [
    { value: 2, label: "Dr.Bernardo James" },
    { value: 3, label: "Dr.Andrea Lalema" },
    { value: 4, label: "Dr.William Stephin" },
  ];

  const handleDateChange = (date, dateString) => {
    setAppointmentDate(dateString || "");
  };

  const loadFile = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      setAvatar(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!gender) {
      alert("Please select gender.");
      return;
    }

    if (!appointmentDate || !startTime || !endTime) {
      alert("Please select appointment date, start time and end time.");
      return;
    }

    if (endTime <= startTime) {
      alert("End time must be later than start time.");
      return;
    }

    setIsSubmitting(true);

    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    const doctorName = selectedOption?.label || "N/A";

    const payload = {
      id: `appointment-${Date.now()}`,
      name: fullName,
      patientName: fullName,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      gender,
      mobile: mobile.trim(),
      email: email.trim(),
      address: address.trim(),
      date: appointmentDate,
      time: `${startTime} - ${endTime}`,
      startTime,
      endTime,
      consultingDoctor: doctorName,
      doctorName,
      treatment: treatment.trim() || "General Consultation",
      notes: notes.trim(),
      createdAt: new Date().toISOString(),
    };

    // 1. Always save to LocalStorage first for instant UI availability
    try {
      const existingData = localStorage.getItem(STORAGE_KEY);
      const parsedData = existingData ? JSON.parse(existingData) : [];
      const updatedAppointments = [
        payload,
        ...(Array.isArray(parsedData) ? parsedData : []),
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAppointments));

      window.dispatchEvent(new Event("appointmentUpdated"));
    } catch (storageErr) {
      console.error("LocalStorage save error:", storageErr);
    }

    // 2. Attempt sync to backend API in background
    try {
      const token = localStorage.getItem("token");
      const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

      try {
        await axios.post(BOOKING_API_URL, payload, {
          headers: authHeaders,
          withCredentials: true,
        });
      } catch (apiErr) {
        if (apiErr.response?.status === 404) {
          await axios.post(FALLBACK_API_URL, payload, {
            headers: authHeaders,
            withCredentials: true,
          });
        } else {
          console.warn("Backend save skipped:", apiErr.message);
        }
      }
    } catch (error) {
      console.warn("Could not push appointment to backend server:", error.message);
    } finally {
      setIsSubmitting(false);
    }

    alert("Appointment added successfully!");
    navigate("/appointmentlist", { replace: true });
  };

  return (
    <div>
      <Header />

      <Sidebar
        id="menu-item4"
        id1="menu-items4"
        activeClassName="add-appoinment"
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
                    Add Appointment
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-12">
                        <div className="form-heading">
                          <h4>Patient Details</h4>
                        </div>
                      </div>

                      <div className="col-12 col-md-6 col-xl-4">
                        <div className="form-group local-forms">
                          <label>First Name *</label>
                          <input
                            className="form-control"
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-6 col-xl-4">
                        <div className="form-group local-forms">
                          <label>Last Name *</label>
                          <input
                            className="form-control"
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-6 col-xl-4">
                        <div className="form-group select-gender">
                          <label className="gen-label">Gender *</label>
                          {["Male", "Female"].map((value) => (
                            <label className="form-check-inline" key={value}>
                              <input
                                className="form-check-input me-1"
                                type="radio"
                                name="gender"
                                value={value}
                                checked={gender === value}
                                onChange={(e) => setGender(e.target.value)}
                                required
                              />
                              {value}
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="col-12 col-md-6 col-xl-6">
                        <div className="form-group local-forms">
                          <label>Mobile *</label>
                          <input
                            className="form-control"
                            type="tel"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-6 col-xl-6">
                        <div className="form-group local-forms">
                          <label>Email *</label>
                          <input
                            className="form-control"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="form-group local-forms">
                          <label>Address *</label>
                          <textarea
                            className="form-control"
                            rows={3}
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="form-heading">
                          <h4>Appointment Details</h4>
                        </div>
                      </div>

                      <div className="col-12 col-md-6 col-xl-4">
                        <div className="form-group local-forms cal-icon">
                          <label>Date of Appointment *</label>
                          <DatePicker
                            className="form-control datetimepicker"
                            format="YYYY-MM-DD"
                            onChange={handleDateChange}
                            disabledDate={(date) =>
                              date &&
                              date.format("YYYY-MM-DD") <
                                new Date().toLocaleDateString("en-CA")
                            }
                            required
                          />
                          <input
                            type="text"
                            value={appointmentDate}
                            required
                            tabIndex={-1}
                            aria-hidden="true"
                            style={{
                              position: "absolute",
                              width: 1,
                              height: 1,
                              opacity: 0,
                              pointerEvents: "none",
                            }}
                            onChange={() => {}}
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-6 col-xl-4">
                        <div className="form-group local-forms">
                          <label>From *</label>
                          <TextField
                            fullWidth
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            required
                            inputProps={{ step: 300 }}
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-6 col-xl-4">
                        <div className="form-group local-forms">
                          <label>To *</label>
                          <TextField
                            fullWidth
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            required
                            inputProps={{ step: 300 }}
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-6 col-xl-6">
                        <div className="form-group local-forms">
                          <label>Consulting Doctor</label>
                          <Select
                            value={selectedOption}
                            onChange={setSelectedOption}
                            options={doctor}
                            placeholder="Select doctor..."
                            menuPortalTarget={document.body}
                            styles={{
                              menuPortal: (base) => ({
                                ...base,
                                zIndex: 9999,
                              }),
                            }}
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-6 col-xl-6">
                        <div className="form-group local-forms">
                          <label>Treatment</label>
                          <input
                            className="form-control"
                            type="text"
                            value={treatment}
                            onChange={(e) => setTreatment(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="form-group local-forms">
                          <label>Notes *</label>
                          <textarea
                            className="form-control"
                            rows={3}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-6 col-xl-6">
                        <div className="form-group local-top-form">
                          <label className="local-top">Avatar</label>
                          <div className="settings-btn upload-files-avator">
                            <input
                              type="file"
                              accept="image/*"
                              name="image"
                              id="file"
                              onChange={loadFile}
                              className="hide-input"
                            />
                            <label htmlFor="file" className="upload">
                              {avatar ? avatar.name : "Choose File"}
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="doctor-submit text-end">
                          <button
                            type="submit"
                            className="btn btn-primary submit-form me-2"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? "Saving..." : "Submit"}
                          </button>

                          <button
                            type="button"
                            className="btn btn-primary cancel-form"
                            onClick={() => navigate("/appointmentlist")}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAppoinments;