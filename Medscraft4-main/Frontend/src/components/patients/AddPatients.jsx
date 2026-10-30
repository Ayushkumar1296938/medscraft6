import React, { useState } from "react";
import Header from "src/components/Header";
import Sidebar from "src/components/Sidebar";
import { DatePicker } from "antd";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";
import Select from "react-select";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const AddPatients = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
    dob: "",
    gender: "",
    education: "",
    designation: "",
    department: "",
    address: "",
    city: "",
    country: "",
    state: "",
    postalCode: "",
    biography: "",
    status: "Active",
  });

  const [avatar, setAvatar] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const departmentOptions = [
    { value: "Orthopedics", label: "Orthopedics" },
    { value: "Radiology", label: "Radiology" },
    { value: "Dentist", label: "Dentist" },
  ];

  const cityOptions = [
    { value: "Patna", label: "Patna" },
    { value: "Ghaziabad", label: "Ghaziabad" },
    { value: "Delhi", label: "Delhi" },
    { value: "Other", label: "Other" },
  ];

  const countryOptions = [
    { value: "India", label: "India" },
    { value: "USA", label: "USA" },
    { value: "UK", label: "UK" },
    { value: "Italy", label: "Italy" },
  ];

  const stateOptions = [
    { value: "Bihar", label: "Bihar" },
    { value: "Uttar Pradesh", label: "Uttar Pradesh" },
    { value: "Delhi", label: "Delhi" },
    { value: "Other", label: "Other" },
  ];

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: state.isFocused ? "#2e37a4" : "rgba(46, 55, 164, 0.1)",
      boxShadow: state.isFocused ? "0 0 0 1px #2e37a4" : "none",
      "&:hover": { borderColor: "#2e37a4" },
      borderRadius: "10px",
      fontSize: "14px",
      minHeight: "45px",
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSelect = (field, selected) => {
    setFormData((previous) => ({
      ...previous,
      [field]: selected ? selected.value : "",
    }));
  };

  const handleDateChange = (date, dateString) => {
    setFormData((previous) => ({
      ...previous,
      dob: dateString || "",
    }));
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please choose an image file.");
      event.target.value = "";
      return;
    }

    setAvatar(file.name);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) return;

    const requiredFields = [
      ["firstName", "First name"],
      ["lastName", "Last name"],
      ["userName", "Username"],
      ["mobile", "Mobile"],
      ["email", "Email"],
      ["password", "Password"],
      ["confirmPassword", "Confirm password"],
      ["dob", "Date of birth"],
      ["gender", "Gender"],
      ["department", "Department"],
      ["address", "Address"],
      ["city", "City"],
      ["country", "Country"],
      ["state", "State/Province"],
      ["postalCode", "Postal code"],
    ];

    for (const [field, label] of requiredFields) {
      if (!String(formData[field] || "").trim()) {
        alert(`${label} is required.`);
        return;
      }
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Password and Confirm Password do not match.");
      return;
    }

    const email = formData.email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    const mobile = formData.mobile.trim();

    if (!/^[0-9+()\-\s]{7,20}$/.test(mobile)) {
      alert("Please enter a valid mobile number.");
      return;
    }

    setIsSubmitting(true);

    const patientPayload = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
      username: formData.userName.trim(),
      mobile,
      email,
      password: formData.password,
      dob: formData.dob,
      gender: formData.gender,
      education: formData.education.trim(),
      designation: formData.designation.trim(),
      department: formData.department,
      address: formData.address.trim(),
      city: formData.city,
      country: formData.country,
      state: formData.state,
      postalCode: formData.postalCode.trim(),
      biography: formData.biography.trim(),
      status: formData.status,
      avatarName: avatar,
    };

    try {
      const token = localStorage.getItem("token");
      const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

      // Directly hit port 8000 with a full absolute URL to bypass port 3000 proxy issues
      await axios.post("http://localhost:8000/api/v1/patients", patientPayload, {
        headers: authHeaders,
        withCredentials: true,
      });

      window.dispatchEvent(new Event("patientUpdated"));

      alert("Patient added successfully to MongoDB!");
      navigate("/patientlist");
    } catch (error) {
      console.error("Full error object:", error);
      
      const actualError = 
        error.response?.data?.error || 
        error.response?.data?.message || 
        error.message || 
        "Unknown network or server error";
        
      alert(`Backend Error: ${actualError}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "form-control";

  return (
    <div>
      <Header />
      <Sidebar
        id="menu-item2"
        id1="menu-items2"
        activeClassName="add-patient"
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
                  <li className="breadcrumb-item">
                    <FeatherIcon icon="chevron-right" />
                  </li>
                  <li className="breadcrumb-item active">Add Patient</li>
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
                            className={inputClass}
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-6 col-xl-4">
                        <div className="form-group local-forms">
                          <label>Last Name *</label>
                          <input
                            className={inputClass}
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-6 col-xl-4">
                        <div className="form-group local-forms">
                          <label>Username *</label>
                          <input
                            className={inputClass}
                            name="userName"
                            value={formData.userName}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-6 col-xl-6">
                        <div className="form-group local-forms">
                          <label>Mobile *</label>
                          <input
                            className={inputClass}
                            name="mobile"
                            type="tel"
                            value={formData.mobile}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-6 col-xl-6">
                        <div className="form-group local-forms">
                          <label>Email *</label>
                          <input
                            className={inputClass}
                            name="email"
                            type="email"
                            autoComplete="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-6 col-xl-6">
                        <div className="form-group local-forms">
                          <label>Password *</label>
                          <input
                            className={inputClass}
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-6 col-xl-6">
                        <div className="form-group local-forms">
                          <label>Confirm Password *</label>
                          <input
                            className={inputClass}
                            name="confirmPassword"
                            type="password"
                            autoComplete="new-password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-6 col-xl-6">
                        <div className="form-group local-forms cal-icon">
                          <label>Date of Birth *</label>
                          <DatePicker
                            className="form-control datetimepicker"
                            onChange={handleDateChange}
                            format="YYYY-MM-DD"
                            suffixIcon={null}
                            placeholder="Select date of birth"
                            disabledDate={(date) =>
                              date && date.valueOf() > Date.now()
                            }
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-6 col-xl-6">
                        <div className="form-group select-gender">
                          <label className="gen-label">Gender *</label>
                          {["Male", "Female", "Other"].map((gender) => (
                            <div className="form-check-inline" key={gender}>
                              <label className="form-check-label">
                                <input
                                  type="radio"
                                  name="gender"
                                  className="form-check-input"
                                  value={gender}
                                  checked={formData.gender === gender}
                                  onChange={handleChange}
                                  required
                                />{" "}
                                {gender}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="col-12 col-md-6 col-xl-4">
                        <div className="form-group local-forms">
                          <label>Education</label>
                          <input
                            className={inputClass}
                            name="education"
                            value={formData.education}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-6 col-xl-4">
                        <div className="form-group local-forms">
                          <label>Designation</label>
                          <input
                            className={inputClass}
                            name="designation"
                            value={formData.designation}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-6 col-xl-4">
                        <div className="form-group local-forms">
                          <label>Department *</label>
                          <Select
                            options={departmentOptions}
                            value={
                              departmentOptions.find(
                                (item) => item.value === formData.department
                              ) || null
                            }
                            onChange={(selected) =>
                              handleSelect("department", selected)
                            }
                            styles={selectStyles}
                            menuPortalTarget={document.body}
                            placeholder="Select Department"
                          />
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="form-group local-forms">
                          <label>Address *</label>
                          <textarea
                            className={inputClass}
                            name="address"
                            rows={3}
                            value={formData.address}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-6 col-xl-3">
                        <div className="form-group local-forms">
                          <label>City *</label>
                          <Select
                            options={cityOptions}
                            value={
                              cityOptions.find(
                                (item) => item.value === formData.city
                              ) || null
                            }
                            onChange={(selected) =>
                              handleSelect("city", selected)
                            }
                            styles={selectStyles}
                            menuPortalTarget={document.body}
                            placeholder="Select City"
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-6 col-xl-3">
                        <div className="form-group local-forms">
                          <label>Country *</label>
                          <Select
                            options={countryOptions}
                            value={
                              countryOptions.find(
                                (item) => item.value === formData.country
                              ) || null
                            }
                            onChange={(selected) =>
                              handleSelect("country", selected)
                            }
                            styles={selectStyles}
                            menuPortalTarget={document.body}
                            placeholder="Select Country"
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-6 col-xl-3">
                        <div className="form-group local-forms">
                          <label>State/Province *</label>
                          <Select
                            options={stateOptions}
                            value={
                              stateOptions.find(
                                (item) => item.value === formData.state
                              ) || null
                            }
                            onChange={(selected) =>
                              handleSelect("state", selected)
                            }
                            styles={selectStyles}
                            menuPortalTarget={document.body}
                            placeholder="Select State"
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-6 col-xl-3">
                        <div className="form-group local-forms">
                          <label>Postal Code *</label>
                          <input
                            className={inputClass}
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="form-group local-forms">
                          <label>Biography</label>
                          <textarea
                            className={inputClass}
                            name="biography"
                            rows={3}
                            value={formData.biography}
                            onChange={handleChange}
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
                              id="patient-avatar"
                              onChange={handleAvatarChange}
                              className="hide-input"
                            />
                            <label
                              htmlFor="patient-avatar"
                              className="upload"
                            >
                              Choose File
                            </label>
                            {avatar && <p>{avatar}</p>}
                          </div>
                        </div>
                      </div>

                      <div className="col-12 col-md-6 col-xl-6">
                        <div className="form-group select-gender">
                          <label className="gen-label">Status</label>
                          {["Active", "Inactive"].map((status) => (
                            <div className="form-check-inline" key={status}>
                              <label className="form-check-label">
                                <input
                                  type="radio"
                                  name="status"
                                  className="form-check-input"
                                  value={status}
                                  checked={formData.status === status}
                                  onChange={handleChange}
                                />{" "}
                                {status}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="doctor-submit text-end">
                          <button
                            type="submit"
                            className="btn btn-primary submit-form me-2"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? "Saving..." : "Add Patient"}
                          </button>

                          <button
                            type="button"
                            className="btn btn-primary cancel-form"
                            onClick={() => navigate("/patientlist")}
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

export default AddPatients;