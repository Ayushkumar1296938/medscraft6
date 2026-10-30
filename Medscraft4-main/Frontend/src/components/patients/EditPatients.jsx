import React, { useEffect, useState } from "react";
import Header from "src/components/Header";
import Sidebar from "src/components/Sidebar";
import { Link, useNavigate, useParams } from "react-router-dom";
import { DatePicker } from "antd";
import FeatherIcon from "feather-icons-react";
import Select from "react-select";
import dayjs from "dayjs";

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
    borderColor: state.isFocused
      ? "#2e37a4"
      : "rgba(46, 55, 164, 0.1)",
    boxShadow: state.isFocused ? "0 0 0 1px #2e37a4" : "none",
    borderRadius: "10px",
    fontSize: "14px",
    minHeight: "45px",
  }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
};

const emptyPatient = {
  firstName: "",
  lastName: "",
  userName: "",
  mobile: "",
  email: "",
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
};

const EditPatients = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState(emptyPatient);
  const [loading, setLoading] = useState(true);
  const [patientFound, setPatientFound] = useState(false);

  useEffect(() => {
    try {
      const patients = JSON.parse(
        localStorage.getItem("patients") || "[]"
      );

      if (!Array.isArray(patients)) {
        throw new Error("Patient data must be an array.");
      }

      // Prefer the ID from the URL, e.g. /editpatient/patient-123.
      // Fall back to a selected ID saved by the Patient List page.
      const selectedId =
        id || localStorage.getItem("selectedPatientId");

      const patient = selectedId
        ? patients.find((item) => String(item.id) === String(selectedId))
        : null;

      if (patient) {
        setFormData({
          ...emptyPatient,
          ...patient,
          firstName:
            patient.firstName ||
            patient.name?.trim().split(/\s+/)[0] ||
            "",
          lastName:
            patient.lastName ||
            patient.name?.trim().split(/\s+/).slice(1).join(" ") ||
            "",
          dob: patient.dob || "",
          department: patient.department || "",
          status: patient.status || "Active",
        });
        setPatientFound(true);
      } else {
        setPatientFound(false);
      }
    } catch (error) {
      console.error("Unable to load patient:", error);
      alert("Could not load patient data.");
    } finally {
      setLoading(false);
    }
  }, [id]);

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
      [field]: selected?.value || "",
    }));
  };

  const handleDateChange = (date, dateString) => {
    setFormData((previous) => ({
      ...previous,
      dob: dateString || "",
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!patientFound) {
      alert("Patient not found. Please open Edit from the Patient List.");
      return;
    }

    const requiredFields = [
      ["firstName", "First name"],
      ["lastName", "Last name"],
      ["userName", "Username"],
      ["mobile", "Mobile"],
      ["email", "Email"],
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

    const email = formData.email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      const patients = JSON.parse(
        localStorage.getItem("patients") || "[]"
      );

      const selectedId =
        id || localStorage.getItem("selectedPatientId");

      const index = patients.findIndex(
        (item) => String(item.id) === String(selectedId)
      );

      if (index === -1) {
        alert("Patient record was not found. No changes were saved.");
        return;
      }

      const duplicateEmail = patients.some(
        (item, itemIndex) =>
          itemIndex !== index &&
          item.email?.toLowerCase() === email
      );

      if (duplicateEmail) {
        alert("Another patient already uses this email.");
        return;
      }

      const updatedPatient = {
        ...patients[index],
        ...formData,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        userName: formData.userName.trim(),
        mobile: formData.mobile.trim(),
        email,
        address: formData.address.trim(),
        postalCode: formData.postalCode.trim(),
        education: formData.education.trim(),
        designation: formData.designation.trim(),
        biography: formData.biography.trim(),
        updatedAt: new Date().toISOString(),
      };

      patients[index] = updatedPatient;

      localStorage.setItem("patients", JSON.stringify(patients));
      window.dispatchEvent(new Event("patientUpdated"));

      alert("Patient updated successfully!");
      navigate("/patientlist");
    } catch (error) {
      console.error("Unable to update patient:", error);
      alert("Could not update the patient. Check the browser console.");
    }
  };

  const renderInput = (
    label,
    name,
    { type = "text", required = false } = {}
  ) => (
    <div className="col-12 col-md-6 col-xl-4" key={name}>
      <div className="form-group local-forms">
        <label>
          {label} {required && <span className="login-danger">*</span>}
        </label>
        <input
          className="form-control"
          type={type}
          name={name}
          value={formData[name] || ""}
          onChange={handleChange}
          required={required}
        />
      </div>
    </div>
  );

  const renderSelect = (label, name, options) => (
    <div className="col-12 col-md-6 col-xl-3" key={name}>
      <div className="form-group local-forms">
        <label>
          {label} <span className="login-danger">*</span>
        </label>
        <Select
          options={options}
          value={
            options.find((option) => option.value === formData[name]) || null
          }
          onChange={(selected) => handleSelect(name, selected)}
          styles={selectStyles}
          menuPortalTarget={document.body}
          components={{ IndicatorSeparator: () => null }}
          placeholder={`Select ${label}`}
        />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div>
        <Header />
        <Sidebar
          id="menu-item2"
          id1="menu-items2"
          activeClassName="edit-patient"
        />
        <div className="page-wrapper">
          <div className="content">Loading patient...</div>
        </div>
      </div>
    );
  }

  if (!patientFound) {
    return (
      <div>
        <Header />
        <Sidebar
          id="menu-item2"
          id1="menu-items2"
          activeClassName="edit-patient"
        />
        <div className="page-wrapper">
          <div className="content">
            <h4>Patient not found</h4>
            <p>Open the Patient List and select Edit for an existing patient.</p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate("/patientlist")}
            >
              Back to Patient List
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <Sidebar
        id="menu-item2"
        id1="menu-items2"
        activeClassName="edit-patient"
      />

      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/patientlist">Patients</Link>
              </li>
              <li className="breadcrumb-item">
                <FeatherIcon icon="chevron-right" />
              </li>
              <li className="breadcrumb-item active">Edit Patient</li>
            </ul>
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

                      {renderInput("First Name", "firstName", { required: true })}
                      {renderInput("Last Name", "lastName", { required: true })}
                      {renderInput("Username", "userName", { required: true })}
                      {renderInput("Mobile", "mobile", { required: true })}
                      {renderInput("Email", "email", {
                        type: "email",
                        required: true,
                      })}

                      <div className="col-12 col-md-6 col-xl-6">
                        <div className="form-group local-forms cal-icon">
                          <label>
                            Date of Birth <span className="login-danger">*</span>
                          </label>
                          <DatePicker
                            className="form-control datetimepicker"
                            value={
                              formData.dob && dayjs(formData.dob).isValid()
                                ? dayjs(formData.dob)
                                : null
                            }
                            onChange={handleDateChange}
                            format="YYYY-MM-DD"
                            disabledDate={(date) =>
                              date && date.valueOf() > Date.now()
                            }
                            suffixIcon={null}
                            placeholder="Select date of birth"
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-6 col-xl-6">
                        <div className="form-group select-gender">
                          <label className="gen-label">Gender *</label>
                          {["Male", "Female", "Other"].map((gender) => (
                            <label className="form-check-inline" key={gender}>
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
                          ))}
                        </div>
                      </div>

                      {renderInput("Education", "education")}
                      {renderInput("Designation", "designation")}

                      {renderSelect(
                        "Department",
                        "department",
                        departmentOptions
                      )}

                      <div className="col-12">
                        <div className="form-group local-forms">
                          <label>
                            Address <span className="login-danger">*</span>
                          </label>
                          <textarea
                            className="form-control"
                            name="address"
                            rows={3}
                            value={formData.address}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      {renderSelect("City", "city", cityOptions)}
                      {renderSelect("Country", "country", countryOptions)}
                      {renderSelect("State/Province", "state", stateOptions)}
                      {renderInput("Postal Code", "postalCode", {
                        required: true,
                      })}

                      <div className="col-12">
                        <div className="form-group local-forms">
                          <label>Biography</label>
                          <textarea
                            className="form-control"
                            name="biography"
                            rows={3}
                            value={formData.biography}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-6 col-xl-6">
                        <div className="form-group select-gender">
                          <label className="gen-label">Status</label>
                          {["Active", "Inactive"].map((status) => (
                            <label className="form-check-inline" key={status}>
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
                          ))}
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="doctor-submit text-end">
                          <button
                            type="submit"
                            className="btn btn-primary submit-form me-2"
                          >
                            Save Changes
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

export default EditPatients;
