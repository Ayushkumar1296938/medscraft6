import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./index.css";

/* ------------------------------------------------------------------
   ROUTES USED BY THIS PAGE
   These match the paths in approuter.jsx.
------------------------------------------------------------------- */
export const ROUTES = {
  home: "/",
  about: "/about",
  features: "/#features",
  roles: "/#roles",
  contact: "/contact",
  login: "/login",
  register: "/register",
  doctorLogin: "/login?role=doctor",
  patientLogin: "/login?role=patient",
  adminLogin: "/login?role=admin",
  patientRegister: "/register",
  doctorDashboard: "/doctor-dashboard",
  patientDashboard: "/patient-dashboard",
  adminDashboard: "/admin-dashboard",
  privacy: "/privacy-policy",
  terms: "/terms",
};

const ROLES = {
  doctor: {
    label: "Doctor",
    title: "See the next patient with the full picture",
    text: "Open a patient's history, write prescriptions and review reports from one screen.",
    login: ROUTES.doctorLogin,
    cta: "Doctor login",
    points: ["Today's appointment queue", "Digital prescriptions", "Lab and imaging reports", "Follow-up reminders"],
    rows: [
      ["09:30", "Anita Sharma", "Follow-up"],
      ["10:15", "Rohit Verma", "New visit"],
      ["11:00", "Meena Kumari", "Lab review"],
    ],
    stats: [["18", "Patients today"], ["4", "Reports to review"]],
  },
  patient: {
    label: "Patient",
    title: "Book, track and keep every record in one place",
    text: "Book appointments, download prescriptions and view reports without calling the clinic.",
    login: ROUTES.patientLogin,
    cta: "Patient login",
    points: ["Online appointment booking", "Prescriptions and reports", "Visit and billing history", "Medicine reminders"],
    rows: [
      ["Tue 12", "Dr. Kapoor", "Cardiology"],
      ["Fri 15", "Dr. Singh", "Blood test"],
      ["Mon 18", "Dr. Rao", "Follow-up"],
    ],
    stats: [["3", "Upcoming visits"], ["2", "New reports"]],
  },
  admin: {
    label: "Admin",
    title: "Run the hospital from one control panel",
    text: "Manage staff, access rights, billing and daily operations with a clear audit trail.",
    login: ROUTES.adminLogin,
    cta: "Admin login",
    points: ["Manage doctors and staff", "Role and permission control", "Billing and revenue reports", "Audit log of every action"],
    rows: [
      ["Dr. Kapoor", "Cardiology", "Active"],
      ["Dr. Singh", "Pathology", "Active"],
      ["Reception 2", "Front desk", "Invite sent"],
    ],
    stats: [["42", "Active users"], ["₹ 3.2L", "Billed this week"]],
  },
};

const FEATURES = [
  { t: "Electronic medical records", d: "Keep histories, vitals, diagnoses and prescriptions together and searchable." },
  { t: "Appointments and queues", d: "Online booking, walk-in tokens and doctor schedules that stay in sync." },
  { t: "Billing and insurance", d: "Create bills, take payments and track pending claims without spreadsheets." },
  { t: "Lab and diagnostics", d: "Order tests, receive results and share reports with the patient automatically." },
  { t: "Pharmacy and inventory", d: "Track stock, expiry dates and dispensing against each prescription." },
  { t: "Reports and analytics", d: "See footfall, revenue and doctor workload in clear daily summaries." },
];

const STEPS = [
  { t: "Sign in with your role", d: "Doctors, patients and admins each get their own login." },
  { t: "See only what you need", d: "Every screen and record is limited to your permissions." },
  { t: "Get work done", d: "Complete visits, bookings or approvals in a few clicks." },
];

const STATS = [
  ["500+", "Clinics and hospitals"],
  ["10,000+", "Doctors on the platform"],
  ["2M+", "Patient records managed"],
  ["99.9%", "Uptime"],
];

const NAV = [
  ["Features", ROUTES.features],
  ["Roles", ROUTES.roles],
  ["About", ROUTES.about],
  ["Contact", ROUTES.contact],
];

export default function Home() {
  const [role, setRole] = useState("doctor");
  const [menu, setMenu] = useState(false);
  const r = ROLES[role];

  return (
    <div className="hr">
      <a href="#main" className="hr-skip">Skip to content</a>

      {/* ---------- Header ---------- */}
      <header className="hr-header">
        <div className="hr-wrap hr-header__in">
          <Link to={ROUTES.home} className="hr-logo" aria-label="Home">
            <span className="hr-logo__mark" aria-hidden="true">+</span>
            HealthCare<span className="hr-logo__sub">Hub</span>
          </Link>

          <nav className={`hr-nav ${menu ? "is-open" : ""}`} aria-label="Main">
            {NAV.map(([label, to]) => (
              <Link key={label} to={to} onClick={() => setMenu(false)}>{label}</Link>
            ))}
            <Link to={ROUTES.login} className="hr-btn hr-btn--ghost hr-nav__m" onClick={() => setMenu(false)}>Log in</Link>
          </nav>

          <div className="hr-header__cta">
            <Link to={ROUTES.login} className="hr-link">Log in</Link>
            <Link to={ROUTES.patientRegister} className="hr-btn hr-btn--solid">Book an appointment</Link>
            <button
              className="hr-burger"
              aria-label="Toggle menu"
              aria-expanded={menu}
              onClick={() => setMenu(!menu)}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>

      <main id="main">
        {/* ---------- Hero ---------- */}
        <section className="hr-hero">
          <div className="hr-wrap hr-hero__in">
            <div className="hr-hero__copy">
              <p className="hr-badge">Hospital and clinic management software</p>
              <h1>One platform for doctors, patients and hospital admins</h1>
              <p className="hr-lead">
                Manage appointments, records, prescriptions and billing securely. Each person signs in
                to a workspace built for their role.
              </p>
              <div className="hr-actions">
                <Link to={ROUTES.patientRegister} className="hr-btn hr-btn--solid hr-btn--lg">Create patient account</Link>
                <Link to={ROUTES.login} className="hr-btn hr-btn--outline hr-btn--lg">Log in to your workspace</Link>
              </div>
              <ul className="hr-trust">
                <li>Role-based access</li>
                <li>Encrypted records</li>
                <li>Full audit trail</li>
              </ul>
            </div>

            {/* Role preview: the signature element */}
            <div className="hr-preview" aria-live="polite">
              <div className="hr-tabs" role="tablist" aria-label="Choose a role">
                {Object.entries(ROLES).map(([key, v]) => (
                  <button
                    key={key}
                    role="tab"
                    aria-selected={role === key}
                    className={role === key ? "is-active" : ""}
                    onClick={() => setRole(key)}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
              <div className="hr-panel" role="tabpanel" key={role}>
                <div className="hr-panel__stats">
                  {r.stats.map(([n, l]) => (
                    <div key={l}><strong>{n}</strong><span>{l}</span></div>
                  ))}
                </div>
                <ul className="hr-panel__rows">
                  {r.rows.map((row) => (
                    <li key={row[0]}>
                      <b>{row[0]}</b><span>{row[1]}</span><em>{row[2]}</em>
                    </li>
                  ))}
                </ul>
                <Link to={r.login} className="hr-btn hr-btn--solid hr-panel__cta">{r.cta}</Link>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Stats ---------- */}
        <section className="hr-stats" aria-label="Platform numbers">
          <div className="hr-wrap hr-stats__in">
            {STATS.map(([n, l]) => (
              <div key={l}><strong>{n}</strong><span>{l}</span></div>
            ))}
          </div>
        </section>

        {/* ---------- Roles ---------- */}
        <section className="hr-section" id="roles">
          <div className="hr-wrap">
            <div className="hr-head">
              <h2>A workspace for every role</h2>
              <p>Access is limited by role, so people see only the records and tools they are allowed to use.</p>
            </div>
            <div className="hr-roles">
              {Object.entries(ROLES).map(([key, v]) => (
                <article key={key} className={`hr-role hr-role--${key}`}>
                  <h3>{v.label}</h3>
                  <p className="hr-role__title">{v.title}</p>
                  <p>{v.text}</p>
                  <ul>{v.points.map((p) => <li key={p}>{p}</li>)}</ul>
                  <Link to={v.login} className="hr-btn hr-btn--outline">{v.cta}</Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Features ---------- */}
        <section className="hr-section hr-section--tint" id="features">
          <div className="hr-wrap">
            <div className="hr-head">
              <h2>Everything your hospital runs on</h2>
              <p>Modules that work together, so information is entered once and available where it is needed.</p>
            </div>
            <div className="hr-features">
              {FEATURES.map((f) => (
                <div key={f.t} className="hr-feature">
                  <span className="hr-feature__dot" aria-hidden="true" />
                  <h3>{f.t}</h3>
                  <p>{f.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Steps ---------- */}
        <section className="hr-section">
          <div className="hr-wrap">
            <div className="hr-head">
              <h2>How access works</h2>
            </div>
            <ol className="hr-steps">
              {STEPS.map((s) => (
                <li key={s.t}><h3>{s.t}</h3><p>{s.d}</p></li>
              ))}
            </ol>
          </div>
        </section>

        {/* ---------- CTA ---------- */}
        <section className="hr-cta">
          <div className="hr-wrap hr-cta__in">
            <div>
              <h2>Ready to bring your clinic online?</h2>
              <p>Talk to our team or create an account to get started.</p>
            </div>
            <div className="hr-actions">
              <Link to={ROUTES.contact} className="hr-btn hr-btn--light hr-btn--lg">Contact us</Link>
              <Link to={ROUTES.patientRegister} className="hr-btn hr-btn--ghostlight hr-btn--lg">Create account</Link>
            </div>
          </div>
        </section>
      </main>

      {/* ---------- Footer ---------- */}
      <footer className="hr-footer">
        <div className="hr-wrap hr-footer__in">
          <div>
            <Link to={ROUTES.home} className="hr-logo hr-logo--light">
              <span className="hr-logo__mark" aria-hidden="true">+</span>HealthCare<span className="hr-logo__sub">Hub</span>
            </Link>
            <p className="hr-footer__about">Secure, role-based software for hospitals, clinics and the people they care for.</p>
          </div>
          <div>
            <h4>Sign in</h4>
            <Link to={ROUTES.doctorLogin}>Doctor</Link>
            <Link to={ROUTES.patientLogin}>Patient</Link>
            <Link to={ROUTES.adminLogin}>Admin</Link>
          </div>
          <div>
            <h4>Company</h4>
            <Link to={ROUTES.about}>About</Link>
            <Link to={ROUTES.features}>Features</Link>
            <Link to={ROUTES.contact}>Contact</Link>
          </div>
          <div>
            <h4>Legal</h4>
            <Link to={ROUTES.privacy}>Privacy policy</Link>
            <Link to={ROUTES.terms}>Terms of use</Link>
          </div>
        </div>
        <div className="hr-wrap hr-footer__bar">© {new Date().getFullYear()} HealthCareHub. All rights reserved.</div>
      </footer>
    </div>
  );
}