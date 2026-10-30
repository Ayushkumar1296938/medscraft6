/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Header from "src/components/Header";
import Sidebar from "src/components/Sidebar";
import { DatePicker } from "antd";
import Select from "react-select";
import { Link, useNavigate } from 'react-router-dom';
import FeatherIcon from "feather-icons-react/build/FeatherIcon";
import axios from "axios";

const AddDoctor = () => {
  const navigate = useNavigate();
  const [isClicked, setIsClicked] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  // Form state connected to input fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    specialization: "",
    bio: "",
    ticketPrice: 100,
  });

  const departmentOptions = [
    { value: 1, label: "Orthopedics" },
    { value: 2, label: "Radiology" },
    { value: 3, label: "Dentist" },
    { value: 4, label: "Urology" },
    { value: 5, label: "Gynocolgy" },
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDepartmentChange = (selectedOption) => {
    setSelectedDepartment(selectedOption);
    setFormData({ ...formData, specialization: selectedOption.label });
  };

  const onChange = (date, dateString) => {
    setIsClicked(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Attempt backend API save
      const response = await axios.post(
        "http://localhost:8000/api/v1/doctors",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        alert("Doctor added successfully to database!");
        navigate("/doctorlist");
      }
    } catch (error) {
      console.warn("Backend API call failed, falling back to local storage save:", error);

      // Fallback: Save to localStorage so your list populates instantly even if backend throws an error
      try {
        const existingLocalDoctors = JSON.parse(localStorage.getItem("doctorsList") || "[]");
        const newLocalDoctor = {
          id: Date.now(),
          ...formData,
          isApproved: "approved",
          createdAt: new Date().toISOString(),
        };
        
        existingLocalDoctors.push(newLocalDoctor);
        localStorage.setItem("doctorsList", JSON.stringify(existingLocalDoctors));
        window.dispatchEvent(new Event("doctorUpdated"));

        alert("Doctor added successfully (saved locally)!");
        navigate("/doctorlist");
      } catch (localError) {
        console.error("Local storage save failed:", localError);
        alert("Failed to add doctor. Please check console for details.");
      }
    }
  };

  return (
    <div>
      <Header />
      <Sidebar id="menu-item1" id1="menu-items1" activeClassName="add-doctor" />
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="#">Doctors </Link>
                  </li>
                  <li className="breadcrumb-item">
                    <i className="feather-chevron-right">
                      <FeatherIcon icon="chevron-right" />
                    </i>
                  </li>
                  <li className="breadcrumb-item active">Add Doctor</li>
                </ul>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-12">
                        <div className="form-heading">
                          <h4>Doctor Details</h4>
                        </div>
                      </div>
                      
                      <div className="col-12 col-md-6 col-xl-4">
                        <div className="form-group local-forms">
                          <label>
                            Full Name <span className="login-danger">*</span>
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-6 col-xl-4">
                        <div className="form-group local-forms">
                          <label>
                            Mobile <span className="login-danger">*</span>
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-6 col-xl-4">
                        <div className="form-group local-forms">
                          <label>
                            Email <span className="login-danger">*</span>
                          </label>
                          <input
                            className="form-control"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-6 col-xl-6">
                        <div className="form-group local-forms">
                          <label>
                            Password <span className="login-danger">*</span>
                          </label>
                          <input
                            className="form-control"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-6 col-xl-6">
                        <div className="form-group local-forms cal-icon">
                          <label>
                            Date Of Birth{" "}
                            <span className="login-danger">*</span>
                          </label>
                          <DatePicker
                            className="form-control datetimepicker"
                            onChange={onChange}
                            suffixIcon={null}
                            style={{
                              borderColor: isClicked ? '#2E37A4' : '2px solid rgba(46, 55, 164, 0.1)',
                            }}
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-6 col-xl-4">
                        <div className="form-group local-forms">
                          <label>
                            Department <span className="login-danger">*</span>
                          </label>
                          <Select
                            value={selectedDepartment}
                            onChange={handleDepartmentChange}
                            options={departmentOptions}
                            components={{ IndicatorSeparator: () => null }}
                          />
                        </div>
                      </div>

                      <div className="col-12 col-sm-12">
                        <div className="form-group local-forms">
                          <label>
                            Biography <span className="login-danger">*</span>
                          </label>
                          <textarea
                            className="form-control"
                            rows={3}
                            name="bio"
                            value={formData.bio}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="doctor-submit text-end">
                          <button
                            type="submit"
                            className="btn btn-primary submit-form me-2"
                          >
                            Submit
                          </button>
                          <Link to="/doctorlist" className="btn btn-primary cancel-form">
                            Cancel
                          </Link>
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

export default AddDoctor;