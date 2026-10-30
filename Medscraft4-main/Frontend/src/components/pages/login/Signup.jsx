import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";

import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  ArrowRight,
} from "feather-icons-react/build/IconComponents";

import {
  login02,
  medscraftLogo,
} from "src/components/imagepath";

const API_URL = "http://localhost:8000/api/v1/auth";

const Signup = () => {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    const name = fullName.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!name) {
      setError("Please enter your full name.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email: normalizedEmail,
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

      const successMessage =
        data.message ||
        "Account created successfully. Verify your email if required.";

      setMessage(successMessage);

      setTimeout(() => {
        navigate("/login", {
          state: {
            registeredEmail: normalizedEmail,
            message: successMessage,
          },
        });
      }, 2000);
    } catch (err) {
      console.error("Signup error:", err);

      setError(
        err.message ||
          "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="main-wrapper login-body"
      style={{
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      <div className="container-fluid px-0 h-100">
        <div className="row g-0 min-vh-100">
          {/* Left Hero Banner */}
          <div
            className="col-lg-6 d-none d-lg-flex flex-column justify-content-between p-5 text-white"
            style={{
              background:
                "linear-gradient(135deg, #0e5b75 0%, #083b4e 100%)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              className="d-flex align-items-center gap-2"
              style={{ zIndex: 2 }}
            >
              <div className="p-2 bg-white bg-opacity-10 rounded-3 d-flex align-items-center justify-content-center">
                <img
                  src={medscraftLogo}
                  width={32}
                  height={32}
                  alt="Medscraft Logo"
                />
              </div>

              <div>
                <h5 className="mb-0 fw-bold text-white">
                  Medscraft
                </h5>
                <small className="text-white-50">
                  Healthcare Platform
                </small>
              </div>
            </div>

            <div
              className="my-auto py-5"
              style={{ zIndex: 2, maxWidth: "520px" }}
            >
              <span className="badge rounded-pill bg-white bg-opacity-10 text-white border border-white border-opacity-25 px-3 py-2 mb-4">
                <span
                  className="rounded-circle bg-success d-inline-block me-2"
                  style={{ width: 8, height: 8 }}
                />
                Trusted Healthcare Platform
              </span>

              <h1
                className="display-4 fw-bold mb-3"
                style={{
                  lineHeight: 1.15,
                  letterSpacing: "-1px",
                }}
              >
                Better care.
                <br />
                Better health.
              </h1>

              <p className="text-white-50 fs-6 mb-4">
                A smarter and simpler way to manage your healthcare
                experience — all in one secure place.
              </p>

              <div className="d-flex flex-column gap-3 mt-4">
                <Feature
                  letter="G"
                  title="Secure & Private"
                  description="Your health information is protected."
                />

                <Feature
                  letter="f"
                  title="Easy Access"
                  description="Access your healthcare anytime."
                />

                <Feature
                  letter="t"
                  title="Connected Care"
                  description="Everything you need in one place."
                />
              </div>
            </div>

            <div
              style={{
                position: "absolute",
                right: "-50px",
                bottom: "-50px",
                opacity: 0.15,
                pointerEvents: "none",
              }}
            >
              <img
                src={login02}
                alt=""
                style={{ width: "500px" }}
              />
            </div>
          </div>

          {/* Right Signup Form */}
          <div className="col-lg-6 d-flex align-items-center justify-content-center p-4 p-md-5 bg-white">
            <div style={{ maxWidth: "440px", width: "100%" }}>
              <div className="text-center mb-4">
                <img
                  src={medscraftLogo}
                  width={48}
                  height={48}
                  alt="Medscraft Logo"
                  className="mb-3"
                />

                <div
                  className="text-uppercase fw-bold text-success mb-1"
                  style={{
                    fontSize: "0.75rem",
                    letterSpacing: "1px",
                  }}
                >
                  Getting Started
                </div>

                <h2
                  className="fw-bold text-dark mb-2"
                  style={{ letterSpacing: "-0.5px" }}
                >
                  Create your account
                </h2>

                <p className="text-muted small">
                  Welcome! Please fill in your details to sign up.
                </p>
              </div>

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
                {/* Full Name */}
                <div className="form-group mb-3">
                  <label
                    htmlFor="signup-name"
                    className="form-label text-muted small fw-medium mb-1"
                  >
                    Full Name
                  </label>

                  <div className="input-group">
                    <span className="input-group-text bg-light border-0 text-muted">
                      <User size={18} />
                    </span>

                    <input
                      id="signup-name"
                      name="name"
                      className="form-control bg-light border-0 py-2 fs-6"
                      type="text"
                      placeholder="Enter full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      autoComplete="name"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="form-group mb-3">
                  <label
                    htmlFor="signup-email"
                    className="form-label text-muted small fw-medium mb-1"
                  >
                    Email address
                  </label>

                  <div className="input-group">
                    <span className="input-group-text bg-light border-0 text-muted">
                      <Mail size={18} />
                    </span>

                    <input
                      id="signup-email"
                      name="email"
                      className="form-control bg-light border-0 py-2 fs-6"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="form-group mb-3">
                  <label
                    htmlFor="signup-password"
                    className="form-label text-muted small fw-medium mb-1"
                  >
                    Password
                  </label>

                  <div className="input-group">
                    <span className="input-group-text bg-light border-0 text-muted">
                      <Lock size={18} />
                    </span>

                    <input
                      id="signup-password"
                      name="password"
                      type={passwordVisible ? "text" : "password"}
                      className="form-control bg-light border-0 py-2 fs-6"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                      minLength={6}
                      required
                    />

                    <button
                      type="button"
                      className="btn bg-light border-0 text-muted"
                      aria-label={
                        passwordVisible ? "Hide password" : "Show password"
                      }
                      onClick={() =>
                        setPasswordVisible((visible) => !visible)
                      }
                    >
                      {passwordVisible ? (
                        <Eye size={18} />
                      ) : (
                        <EyeOff size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="form-group mb-3">
                  <label
                    htmlFor="signup-confirm-password"
                    className="form-label text-muted small fw-medium mb-1"
                  >
                    Confirm Password
                  </label>

                  <div className="input-group">
                    <span className="input-group-text bg-light border-0 text-muted">
                      <Lock size={18} />
                    </span>

                    <input
                      id="signup-confirm-password"
                      name="confirmPassword"
                      type={
                        confirmPasswordVisible ? "text" : "password"
                      }
                      className="form-control bg-light border-0 py-2 fs-6"
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(e.target.value)
                      }
                      autoComplete="new-password"
                      minLength={6}
                      required
                    />

                    <button
                      type="button"
                      className="btn bg-light border-0 text-muted"
                      aria-label={
                        confirmPasswordVisible
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                      onClick={() =>
                        setConfirmPasswordVisible(
                          (visible) => !visible
                        )
                      }
                    >
                      {confirmPasswordVisible ? (
                        <Eye size={18} />
                      ) : (
                        <EyeOff size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Terms */}
                <div className="form-check mb-4">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="termsCheck"
                    required
                  />

                  <label
                    className="form-check-label text-muted small"
                    htmlFor="termsCheck"
                  >
                    I agree to the{" "}
                    <Link
                      to="#"
                      onClick={(e) => e.preventDefault()}
                      className="text-decoration-none text-info"
                    >
                      terms of service
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="#"
                      onClick={(e) => e.preventDefault()}
                      className="text-decoration-none text-info"
                    >
                      privacy policy
                    </Link>
                  </label>
                </div>

                {/* Submit */}
                <div className="form-group mb-4">
                  <button
                    className="btn btn-info w-100 py-2 text-white fw-semibold d-flex align-items-center justify-content-center gap-2 rounded-3"
                    style={{
                      backgroundColor: "#0096a6",
                      borderColor: "#0096a6",
                    }}
                    type="submit"
                    disabled={loading}
                  >
                    <span>
                      {loading ? "Creating account..." : "Sign up securely"}
                    </span>

                    {!loading && <ArrowRight size={18} />}
                  </button>
                </div>
              </form>

              {/* Social sign-in placeholders */}
              <div className="text-center my-4 position-relative">
                <hr className="text-black-50 my-0" />

                <span
                  className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-uppercase text-muted"
                  style={{
                    fontSize: "0.65rem",
                    letterSpacing: "1px",
                  }}
                >
                  or continue with
                </span>
              </div>

              <div className="d-flex gap-2 mb-4">
                <button
                  type="button"
                  className="btn btn-light w-50 py-2 d-flex align-items-center justify-content-center gap-2 border-0 fw-medium text-dark small"
                  onClick={() =>
                    setError("Google sign-in is not configured yet.")
                  }
                >
                  <span className="fw-bold text-primary">G</span>
                  Google
                </button>

                <button
                  type="button"
                  className="btn btn-light w-50 py-2 d-flex align-items-center justify-content-center gap-2 border-0 fw-medium text-dark small"
                  onClick={() =>
                    setError("Microsoft sign-in is not configured yet.")
                  }
                >
                  <span className="fw-bold text-info">M</span>
                  Microsoft
                </button>
              </div>

              <p className="text-center text-muted small mb-0">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-info text-decoration-none fw-semibold"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable feature card
const Feature = ({ letter, title, description }) => (
  <div className="p-3 rounded-4 bg-white bg-opacity-10 d-flex align-items-center gap-3 border border-white border-opacity-10">
    <div
      className="bg-white rounded-3 p-2 d-flex align-items-center justify-content-center"
      style={{ width: 40, height: 40, flexShrink: 0 }}
    >
      <span className="fw-bold text-primary">{letter}</span>
    </div>

    <div>
      <h6 className="mb-0 fw-semibold text-white">{title}</h6>
      <small className="text-white-50">{description}</small>
    </div>
  </div>
);

Feature.propTypes = {
  letter: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default Signup;
