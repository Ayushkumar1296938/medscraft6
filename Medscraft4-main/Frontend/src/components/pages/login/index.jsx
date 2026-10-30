import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "feather-icons-react/build/IconComponents";

// Backend URL
const API_BASE_URL = "http://localhost:8000";
const LOGIN_URL = `${API_BASE_URL}/api/v1/auth/login`;

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Read role from URL query parameters (e.g. ?role=doctor)
  const searchParams = new URLSearchParams(location.search);
  const portalRole = searchParams.get("role")?.toLowerCase() || "";

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(LOGIN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: normalizedEmail,
          password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || data.status === false) {
        throw new Error(
          data.message ||
            data.error ||
            `Login failed (${response.status}).`
        );
      }

      // Extract Token & User Info
      const token =
        data.token ||
        data.accessToken ||
        data.data?.token ||
        data.data?.accessToken;

      const user =
        data.data?.user ||
        data.data ||
        data.user ||
        null;

      if (!token) {
        throw new Error(
          "Login response did not contain an authentication token. Check the backend login response."
        );
      }

      // Clear old session/local storage
      localStorage.clear();
      sessionStorage.clear();

      const primaryStorage = rememberMe ? localStorage : sessionStorage;

      // Save token & session data
      primaryStorage.setItem("token", token);
      
      const userId =
        data.userId ||
        user?.userId ||
        user?._id ||
        user?.id;

      const backendRole = String(
        data.role || user?.role || ""
      ).trim().toLowerCase();

      // URL portalRole gets absolute priority over backend role
      const finalRole = portalRole || backendRole || "patient";

      // ALWAYS save token, user object & role in localStorage for Header/Sidebar sync
      localStorage.setItem("token", token);
      if (user) {
        user.role = finalRole;
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("userInfo", JSON.stringify(user));
        primaryStorage.setItem("userInfo", JSON.stringify(user));
      }

      if (userId) {
        localStorage.setItem("userId", String(userId));
        primaryStorage.setItem("userId", String(userId));
      }

      if (finalRole) {
        localStorage.setItem("role", finalRole);
        primaryStorage.setItem("role", finalRole);
      }

      if (typeof data.isPremiumUser !== "undefined") {
        localStorage.setItem("isPremiumUser", String(data.isPremiumUser));
      }

      setPassword("");

      // Role-Based Redirects based on finalRole
      if (finalRole === "admin") {
        navigate("/admin-dashboard", { replace: true });
      } else if (finalRole === "doctor") {
        navigate("/doctor-dashboard", { replace: true });
      } else {
        navigate("/patient-dashboard", { replace: true });
      }
    } catch (err) {
      if (err instanceof TypeError) {
        setError(
          "Cannot connect to the server. Check that the backend is running on port 8000 and CORS is configured correctly."
        );
      } else {
        setError(
          err.message || "Unable to sign in. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        fontFamily:
          'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        backgroundColor: "#f6f5f1",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        color: "#111111",
        margin: 0,
      }}
    >
      {/* 1. Dark Modern Header Navbar */}
      <header
        style={{
          backgroundColor: "#111111",
          color: "#ffffff",
          padding: "16px 48px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
            color: "#ffffff",
          }}
        >
          <div
            style={{
              width: "28px",
              height: "28px",
              border: "2.5px solid #ffffff",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: "14px",
            }}
          >
            M
          </div>
          <span
            style={{
              fontSize: "20px",
              fontWeight: "700",
              letterSpacing: "-0.5px",
            }}
          >
            medscraft
          </span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <span style={{ fontSize: "14px", color: "#9ca3af" }}>
            Support: 866-525-2539
          </span>
          <Link
            to="/"
            style={{
              backgroundColor: "#ffffff",
              color: "#111111",
              padding: "8px 18px",
              borderRadius: "20px",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "13px",
            }}
          >
            Back to Home
          </Link>
        </div>
      </header>

      {/* 2. Split Login Layout */}
      <main
        style={{
          flex: 1,
          maxWidth: "1280px",
          width: "100%",
          margin: "0 auto",
          padding: "50px 32px",
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          gap: "60px",
          alignItems: "center",
          boxSizing: "border-box",
        }}
      >
        {/* Left Interactive Visual & Info Panel */}
        <div>
          <div
            style={{
              display: "inline-block",
              backgroundColor: "#00d294",
              color: "#000000",
              padding: "5px 14px",
              borderRadius: "15px",
              fontWeight: "700",
              fontSize: "12px",
              marginBottom: "20px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {portalRole ? `Secure ${portalRole} Portal` : "Trusted Healthcare Platform"}
          </div>

          <h1
            style={{
              fontSize: "52px",
              fontWeight: "850",
              lineHeight: "1.1",
              letterSpacing: "-1.5px",
              marginBottom: "20px",
              color: "#111111",
            }}
          >
            We keep your <br /> practice healthy.
          </h1>

          <p
            style={{
              fontSize: "18px",
              color: "#4b5563",
              lineHeight: "1.6",
              marginBottom: "35px",
              maxWidth: "500px",
            }}
          >
            Last-minute schedule updates are handled seamlessly. Patients and providers 
            stay verified and fully synchronized in one place.
          </p>

          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "24px",
              borderRadius: "16px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.03)",
              maxWidth: "440px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "8px",
              }}
            >
              <span style={{ fontSize: "20px" }}>🔒</span>
              <strong style={{ fontSize: "15px", color: "#111" }}>Encrypted &amp; Protected</strong>
            </div>
            <p style={{ margin: 0, fontSize: "13px", color: "#6b7280", lineHeight: "1.4" }}>
              Your connection is secured with industry-standard protocols and role-based validation.
            </p>
          </div>
        </div>

        {/* Right Modern Form Card */}
        <div
          style={{
            backgroundColor: "#ffffff",
            padding: "40px",
            borderRadius: "24px",
            boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.08)",
            border: "1px solid #e5e7eb",
          }}
        >
          <div style={{ marginBottom: "28px" }}>
            <span style={{ fontSize: "24px" }}>👋</span>
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "800",
                margin: "8px 0 6px 0",
                letterSpacing: "-0.5px",
                color: "#111",
              }}
            >
              Sign in to your account
            </h2>
            <p style={{ margin: 0, fontSize: "14px", color: "#6b7280" }}>
              {portalRole
                ? `Signing in to ${portalRole.toUpperCase()} portal. Enter details below.`
                : "Welcome back! Please enter your details to continue."}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div
                role="alert"
                style={{
                  color: "#991b1b",
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  marginBottom: "20px",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                {error}
              </div>
            )}

            <div style={{ marginBottom: "20px" }}>
              <label
                htmlFor="email"
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: "600",
                  marginBottom: "6px",
                  color: "#374151",
                }}
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  border: "1.5px solid #d1d5db",
                  fontSize: "15px",
                  outline: "none",
                  boxSizing: "border-box",
                  backgroundColor: "#fff",
                }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "6px",
                }}
              >
                <label
                  htmlFor="password"
                  style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#374151",
                  }}
                >
                  Password
                </label>
                <Link
                  to="/forgotpassword"
                  style={{
                    fontSize: "13px",
                    color: "#00b882",
                    textDecoration: "none",
                    fontWeight: "700",
                  }}
                >
                  Forgot password?
                </Link>
              </div>

              <div style={{ position: "relative" }}>
                <input
                  id="password"
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "12px 45px 12px 16px",
                    borderRadius: "10px",
                    border: "1.5px solid #d1d5db",
                    fontSize: "15px",
                    outline: "none",
                    boxSizing: "border-box",
                    backgroundColor: "#fff",
                  }}
                />

                <button
                  type="button"
                  onClick={() => setPasswordVisible((visible) => !visible)}
                  aria-label={passwordVisible ? "Hide password" : "Show password"}
                  disabled={loading}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#6b7280",
                    padding: "4px",
                  }}
                >
                  {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  color: "#4b5563",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                />
                <span>Remember me</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                backgroundColor: "#00d294",
                color: "#000000",
                padding: "14px",
                borderRadius: "10px",
                border: "none",
                fontWeight: "700",
                fontSize: "16px",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(0, 210, 148, 0.25)",
                transition: "all 0.2s ease",
              }}
            >
              {loading ? "Signing in..." : "Sign in securely ➔"}
            </button>
          </form>

          <div
            style={{
              marginTop: "24px",
              textAlign: "center",
              borderTop: "1px solid #f3f4f6",
              paddingTop: "20px",
              fontSize: "14px",
              color: "#6b7280",
            }}
          >
            <span>Don&apos;t have an account? </span>
            <Link
              to="/signup"
              style={{
                color: "#111111",
                textDecoration: "underline",
                fontWeight: "700",
              }}
            >
              Create an account
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;