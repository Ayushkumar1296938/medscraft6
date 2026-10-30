import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  login02,
  loginicon01,
  loginicon02,
  loginicon03,
  loginlogo,
} from "src/components/imagepath";

// Backend registration URL
const API_URL = "http://localhost:8000/api/v1/auth";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    if (!name) {
      setError("Please enter your full name.");
      return;
    }

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      console.log("Sending registration request:", `${API_URL}/register`);

      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role: "patient",
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            `Registration failed (HTTP ${response.status}).`
        );
      }

      setMessage(
        data.message ||
          "Registration successful. Please verify your email if required."
      );

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        navigate("/login", {
          state: {
            registeredEmail: email,
            message:
              data.message ||
              "Registration successful. Please log in with your credentials.",
          },
        });
      }, 1800);
    } catch (err) {
      console.error("Registration error:", err);

      setError(
        err.message ||
          "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-wrapper login-body">
      <div className="container-fluid px-0">
        <div className="row">
          {/* Left image section */}
          <div className="col-lg-6 login-wrap">
            <div className="login-sec">
              <div className="log-img">
                <img
                  className="img-fluid"
                  src={login02}
                  alt="Healthcare"
                />
              </div>
            </div>
          </div>

          {/* Registration section */}
          <div className="col-lg-6 login-wrap-bg">
            <div className="login-wrapper">
              <div className="loginbox">
                <div className="login-right">
                  <div className="login-right-wrap">
                    <div className="account-logo">
                      <Link to="/">
                        <img src={loginlogo} alt="Medscraft" />
                      </Link>
                    </div>

                    <h2>Getting Started</h2>
                    <p>Create your account to get started.</p>

                    {error && (
                      <div className="alert alert-danger" role="alert">
                        {error}
                      </div>
                    )}

                    {message && (
                      <div className="alert alert-success" role="alert">
                        {message}
                      </div>
                    )}

                    <form onSubmit={handleSubmit}>
                      <div className="form-group">
                        <label htmlFor="register-name">
                          Full Name{" "}
                          <span className="login-danger">*</span>
                        </label>

                        <input
                          id="register-name"
                          className="form-control"
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Enter your full name"
                          autoComplete="name"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="register-email">
                          Email{" "}
                          <span className="login-danger">*</span>
                        </label>

                        <input
                          id="register-email"
                          className="form-control"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Enter your email"
                          autoComplete="email"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="register-password">
                          Password{" "}
                          <span className="login-danger">*</span>
                        </label>

                        <input
                          id="register-password"
                          className="form-control"
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Create a password"
                          autoComplete="new-password"
                          minLength={6}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="register-confirm-password">
                          Confirm Password{" "}
                          <span className="login-danger">*</span>
                        </label>

                        <input
                          id="register-confirm-password"
                          className="form-control"
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="Confirm your password"
                          autoComplete="new-password"
                          minLength={6}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="custom_check">
                          <input type="checkbox" required />
                          <span className="checkmark" /> I agree to the
                          terms of service and privacy policy.
                        </label>
                      </div>

                      <div className="form-group login-btn">
                        <button
                          className="btn btn-primary btn-block"
                          type="submit"
                          disabled={loading}
                        >
                          {loading
                            ? "Creating Account..."
                            : "Sign Up"}
                        </button>
                      </div>
                    </form>

                    <div className="next-sign">
                      <p className="account-subtitle">
                        Already have an account?{" "}
                        <Link to="/login">Login</Link>
                      </p>

                      <div className="social-login">
                        <Link
                          to="#"
                          aria-label="Social login option 1"
                        >
                          <img src={loginicon01} alt="" />
                        </Link>

                        <Link
                          to="#"
                          aria-label="Social login option 2"
                        >
                          <img src={loginicon02} alt="" />
                        </Link>

                        <Link
                          to="#"
                          aria-label="Social login option 3"
                        >
                          <img src={loginicon03} alt="" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;