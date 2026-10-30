import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";

// Landing Page
import MedArcHome from "./components/pages/home";
import Login from "./components/pages/login";

// Blog
import Addblog from "src/components/pages/Blog/Addblog";
import Editblog from "src/components/pages/Blog/Editblog";
import BlogView from "src/components/pages/Blog/BlogView";
import Blogdetails from "src/components/pages/Blog/Blogdetails";

// Settings
import Localization from "src/components/settings/Localization";
import Paymentsetting from "src/components/settings/Paymentsetting";
import Settingsemail from "src/components/settings/Settingsemail";
import Settingssocialmedia from "src/components/settings/Settingssocialmedia";
import Settingssociallinks from "src/components/settings/Settingssociallinks";
import Settingsseo from "src/components/settings/Settingsseo";
import SettingsThem from "src/components/settings/SettingsThem";
import SettingsChangePassword from "src/components/settings/SettingsChangePassword";
import SettingsOthers from "src/components/settings/SettingsOthers";

// Assets
import Assests from "src/components/assests/Assests";
import AddAsset from "src/components/assests/AddAsset";
import Edit_Assets from "src/components/assests/Edit_Assets";

// Doctor
import DoctorList from "src/components/doctor/DoctorList";
import AddDoctor from "src/components/doctor/AddDoctor";
import EditDoctor from "src/components/doctor/EditDoctor";
import DoctorProfile from "src/components/doctor/DoctorProfile";

// Clinic
import ClinicList from "src/components/clinic/ClinicList";
import AddClinic from "src/components/clinic/AddClinic";
import EditClinic from "src/components/clinic/EditClinic";
import ClinicProfile from "src/components/clinic/ClinicProfile";

// Patients
import PatientsList from "src/components/patients/PatientsList";
import AddPatients from "src/components/patients/AddPatients";
import EditPatients from "src/components/patients/EditPatients";
import PatientsProfile from "src/components/patients/PatientsProfile";
import Patient_Settings from "src/components/patients/Patient_Settings";

// Appointments
import AppoinmentList from "src/components/appoinments/AppoinmentList";
import AddAppoinments from "src/components/appoinments/AddAppoinments";
import EditAppoinments from "src/components/appoinments/EditAppoinments";

// Doctor Schedule
import ScheduleList from "src/components/doctorschedule/ScheduleList";
import AddSchedule from "src/components/doctorschedule/AddSchedule";
import EditSchedule from "src/components/doctorschedule/EditSchedule";

// Departments
import DepartmentList from "src/components/department/DepartmentList";
import AddDepartment from "src/components/department/AddDepartment";
import EditDepartment from "src/components/department/EditDepartment";

// Staff
import StaffList from "src/components/staff/StafList";
import AddStaff from "src/components/staff/Add-Staff";
import StaffProfile from "src/components/staff/StaffProfile";
import EditStaff from "src/components/staff/EditStaff";
import AddLeave from "src/components/staff/AddLeave";
import Attendence from "src/components/staff/Attendence";
import Leave from "src/components/staff/Leave";
import EditLeave from "src/components/staff/EditLeave";
import Holiday from "src/components/staff/Holiday";
import Staff_Settings from "src/components/staff/Staff-Settings";

// Accounts
import ProvidentFund from "src/components/accounts/ProvidentFund";
import Invoice from "src/components/accounts/Invoice";
import Create_Invoice from "src/components/accounts/Create_Invoice";
import Payments from "src/components/accounts/Payments";
import Add_Payment from "src/components/accounts/Add_Payment";
import Expenses from "src/components/accounts/Expenses";
import Add_Expense from "src/components/accounts/Add_Expense";
import Taxes from "src/components/accounts/Taxes";
import Add_Tax from "src/components/accounts/Add_Tax";
import Add_ProviderFund from "src/components/accounts/Add_ProviderFund";
import Edit_Provident from "src/components/accounts/Edit_Provident";
import Edit_Taxes from "src/components/accounts/Edit_Taxes";
import Edit_Payment from "src/components/accounts/Edit_Payment";

// Payroll
import EmployeeSalary from "src/components/Payroll/EmployeeSalary/EmployeeSalary";
import AddEmployeeSalary from "src/components/Payroll/EmployeeSalary/AddEmployeeSalary";
import EditEmployeeSalery from "src/components/Payroll/EmployeeSalary/EditEmployeeSalery";
import Payslip from "src/components/Payroll/Payslip";

// Email
import Inbox from "src/components/email/Inbox";
import ComposeMail from "src/components/email/ComposeMail";
import MailView from "src/components/email/MailView";

// Activity
import UserActivity from "src/components/activity/UserActivity";

// Expense Reports
import ExpensesReport from "src/components/ExpenseReport/Expenses/ExpensesReport";
import AddExpenses from "src/components/ExpenseReport/Expenses/AddExpenses";
import Invoice_Report from "src/components/ExpenseReport/Invoice-report/Invoice_Report";
import Edit_Expenses from "src/components/ExpenseReport/Expenses/Edit_Expenses";

// Invoice
import OverDue from "src/components/Invoice/Invoice-List/Overdue-Invoice/OverDue";
import InvoiceList from "src/components/Invoice/Invoice-List/InvoiceList";
import Paid_Invoice from "src/components/Invoice/Invoice-List/Paid-Invoice/Paid_Invoice";
import Draft_Invoice from "src/components/Invoice/Invoice-List/Draft_Invoice/Draft_Invoice";
import Recurring_Invoice from "src/components/Invoice/Invoice-List/Recurring_Invoice/Recurring_Invoice";
import Cancelled_Invoice from "src/components/Invoice/Invoice-List/Cancelled_Invoice/Cancelled_Invoice";
import Invoice_Grid from "src/components/Invoice/Invoices_Grid/Invoice_Grid";
import Add_Invoices from "src/components/Invoice/Add_Invoices/Add_Invoices";
import Edit_Invoices from "src/components/Invoice/Edit_Invoices/Edit_Invoices";
import Invoice_Details from "src/components/Invoice/Invoice_Details/Invoice_Details";
import Invoice_GeneralSettings from "src/components/Invoice/Invoice_Settings/General_Settings/Invoice_GeneralSettings";
import Tax_Settings from "src/components/Invoice/Invoice_Settings/Tax_Settings/Tax_Settings";
import Bank_Settings from "src/components/Invoice/Invoice_Settings/Bank_Settings/Bank_Settings";

// Chat & Call
import Chat from "src/components/Chat/Chat";
import IncomingCall from "src/components/Chat/IncomingCall";
import VoiceCall from "src/components/Call/VoiceCall";
import VideoCall from "src/components/Call/VideoCall";

// Forms
import BasicInput from "src/components/Forms/BasicInput";
import InputGroups from "src/components/Forms/InputGroups";
import HorizontalForm from "src/components/Forms/HorizontalForm";
import VerticalForm from "src/components/Forms/VerticalForm";

// Tables
import BasicTable from "src/components/Tables/BasicTable";
import DataTable from "src/components/Tables/DataTable";

// UI Elements
import UiKit from "src/components/Ui_Elements/UiKit";
import Typography from "src/components/Ui_Elements/Typography";
import Tab from "src/components/Ui_Elements/Tab";

// Authentication pages
import ForgotPassword from "src/components/pages/login/ForgotPassword";
import Signup from "src/components/pages/login/Signup";
import Register from "src/components/pages/login/Register";
import LockScreen from "src/components/pages/login/LockScreen";
import ChangePassword from "src/components/pages/login/ChangePassword";
import Error from "src/components/pages/login/Error";
import ServerError from "src/components/pages/login/ServerError";
import Profile from "src/components/pages/login/Profile";
import EditProfile from "src/components/pages/login/EditProfile";
import BlankPage from "src/components/pages/login/BlankPage";

// Dashboards
import Doctor_Dashboard from "src/components/Dashboard/Doctor_Dashboard/Doctor_Dashboard";
import Clinic_Dashboard from "src/components/Dashboard/Clinic_Dashboard/Clinic_Dashboard";
import Admin_Dashboard from "src/components/Dashboard/Admin_Dashboard/Admin_Dashboard";
import Patient_Dashboard from "src/components/Dashboard/Patient_Dashboard/Patient_Dashboard";
import Doctor_Settings from "src/components/Dashboard/Doctor_Dashboard/Doctor_Settings";

// Other pages
import Calender from "src/components/calender/Calender";
import Setting from "src/components/settings/Setting";
import GalleryImage from "src/components/pages/Gallery/Gallery";

/* ------------------------------------------------------------------
   Helpers
------------------------------------------------------------------- */

// Scrolls to #features / #roles for links like "/#features",
// and back to the top on normal page changes.
const ScrollToHash = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
};

// Temporary pages for header/footer links. Replace with real components later.
const InfoPage = ({ title, children }) => (
  <div style={{ maxWidth: 720, margin: "0 auto", padding: "80px 20px" }}>
    <h1 style={{ marginBottom: 16 }}>{title}</h1>
    <p style={{ marginBottom: 24 }}>{children}</p>
    <Link to="/">Back to home</Link>
  </div>
);

InfoPage.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
};

const Approuter = () => {
  return (
    <>
      <BrowserRouter basename="/">
        <ScrollToHash />
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<MedArcHome />} />
          <Route path="/home" element={<MedArcHome />} />

          {/* Homepage links (placeholders) */}
          <Route path="/about" element={<InfoPage title="About us">We build secure, role-based software for hospitals and clinics.</InfoPage>} />
          <Route path="/contact" element={<InfoPage title="Contact us">Contact details will be added here.</InfoPage>} />
          <Route path="/privacy-policy" element={<InfoPage title="Privacy policy">Privacy policy content will be added here.</InfoPage>} />
          <Route path="/terms" element={<InfoPage title="Terms of use">Terms of use content will be added here.</InfoPage>} />

          {/* Authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/register" element={<Register />} />
          <Route path="/lockscreen" element={<LockScreen />} />
          <Route path="/changepassword" element={<ChangePassword />} />

          {/* Profile & Utility */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/error" element={<Error />} />
          <Route path="/server-error" element={<ServerError />} />
          <Route path="/blankpage" element={<BlankPage />} />
          <Route path="/gallery" element={<GalleryImage />} />

          {/* Blog */}
          <Route path="/blog" element={<Blogdetails />} />
          <Route path="/addblog" element={<Addblog />} />
          <Route path="/editblog" element={<Editblog />} />
          <Route path="/blogview" element={<BlogView />} />

          {/* Settings */}
          <Route path="/settings" element={<Setting />} />
          <Route path="/localization" element={<Localization />} />
          <Route path="/paymentsetting" element={<Paymentsetting />} />
          <Route path="/settingsemail" element={<Settingsemail />} />
          <Route path="/settingssocialmedia" element={<Settingssocialmedia />} />
          <Route path="/settingssociallink" element={<Settingssociallinks />} />
          <Route path="/settingsseo" element={<Settingsseo />} />
          <Route path="/settingsthem" element={<SettingsThem />} />
          <Route path="/settingschangepassword" element={<SettingsChangePassword />} />
          <Route path="/settingsothers" element={<SettingsOthers />} />

          {/* Assets */}
          <Route path="/assests" element={<Assests />} />
          <Route path="/addasset" element={<AddAsset />} />
          <Route path="/edit-assets" element={<Edit_Assets />} />

          {/* Doctor */}
          <Route path="/doctorlist" element={<DoctorList />} />
          <Route path="/doctor-list" element={<DoctorList />} />
          <Route path="/doctorslist" element={<DoctorList />} />
          <Route path="/add-doctor" element={<AddDoctor />} />
          <Route path="/adddoctor" element={<AddDoctor />} />
          <Route path="/add-doctors" element={<AddDoctor />} />
          <Route path="/adddoctors" element={<AddDoctor />} />
          <Route path="/editdoctor" element={<EditDoctor />} />
          <Route path="/edit-doctor" element={<EditDoctor />} />
          <Route path="/doctorprofile" element={<DoctorProfile />} />
          <Route path="/doctor-profile" element={<DoctorProfile />} />
          <Route path="/doctor-setting" element={<Doctor_Settings />} />

          {/* Clinic */}
          <Route path="/cliniclist" element={<ClinicList />} />
          <Route path="/add-clinic" element={<AddClinic />} />
          <Route path="/editclinic" element={<EditClinic />} />
          <Route path="/clinicprofile" element={<ClinicProfile />} />

          {/* Patients */}
          <Route path="/patientslist" element={<PatientsList />} />
          <Route path="/patientlist" element={<PatientsList />} />
          <Route path="/addpatients" element={<AddPatients />} />
          <Route path="/addpatient" element={<AddPatients />} />
          <Route path="/editpatients" element={<EditPatients />} />
          <Route path="/editpatient" element={<EditPatients />} />
          <Route path="/patientsprofile" element={<PatientsProfile />} />
          <Route path="/patientprofile" element={<PatientsProfile />} />
          <Route path="/patient-settings" element={<Patient_Settings />} />

          {/* Appointments */}
          <Route path="/appointmentlist" element={<AppoinmentList />} />
          <Route path="/appoinmentlist" element={<AppoinmentList />} />
          <Route path="/addappoinments" element={<AddAppoinments />} />
          <Route path="/editappoinments" element={<EditAppoinments />} />

          {/* Doctor Schedule */}
          <Route path="/schedulelist" element={<ScheduleList />} />
          <Route path="/addschedule" element={<AddSchedule />} />
          <Route path="/editschedule" element={<EditSchedule />} />

          {/* Departments */}
          <Route path="/departmentlist" element={<DepartmentList />} />
          <Route path="/add-department" element={<AddDepartment />} />
          <Route path="/editdepartment" element={<EditDepartment />} />

          {/* Staff */}
          <Route path="/stafflist" element={<StaffList />} />
          <Route path="/addstaff" element={<AddStaff />} />
          <Route path="/editstaff" element={<EditStaff />} />
          <Route path="/staffprofile" element={<StaffProfile />} />
          <Route path="/leave" element={<Leave />} />
          <Route path="/add-leave" element={<AddLeave />} />
          <Route path="/editleave" element={<EditLeave />} />
          <Route path="/attendence" element={<Attendence />} />
          <Route path="/holiday" element={<Holiday />} />
          <Route path="/staff-settings" element={<Staff_Settings />} />

          {/* Accounts */}
          <Route path="/providentfund" element={<ProvidentFund />} />
          <Route path="/add-providerfund" element={<Add_ProviderFund />} />
          <Route path="/invoicelist" element={<Invoice />} />
          <Route path="/createinvoice" element={<Create_Invoice />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/addpayment" element={<Add_Payment />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/addexpense" element={<Add_Expense />} />
          <Route path="/taxes" element={<Taxes />} />
          <Route path="/edit-taxes" element={<Edit_Taxes />} />
          <Route path="/addtax" element={<Add_Tax />} />
          <Route path="/edit-provident" element={<Edit_Provident />} />
          <Route path="/edit-payment" element={<Edit_Payment />} />

          {/* Payroll */}
          <Route path="/employeesalary" element={<EmployeeSalary />} />
          <Route path="/addsalary" element={<AddEmployeeSalary />} />
          <Route path="/editsalary" element={<EditEmployeeSalery />} />
          <Route path="/payslip" element={<Payslip />} />

          {/* Email */}
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/compose-mail" element={<ComposeMail />} />
          <Route path="/mail-view" element={<MailView />} />

          {/* Activity */}
          <Route path="/user-activity" element={<UserActivity />} />

          {/* Expense Reports */}
          <Route path="/expense-Report" element={<ExpensesReport />} />
          <Route path="/add-expense" element={<AddExpenses />} />
          <Route path="/invoice-report" element={<Invoice_Report />} />
          <Route path="/edit-expenses" element={<Edit_Expenses />} />

          {/* Chat & Call */}
          <Route path="/chat" element={<Chat />} />
          <Route path="/voice-call" element={<VoiceCall />} />
          <Route path="/video-call" element={<VideoCall />} />
          <Route path="/incoming-call" element={<IncomingCall />} />

          {/* Invoice */}
          <Route path="/invoice-list" element={<InvoiceList />} />
          <Route path="/paid-invoice" element={<Paid_Invoice />} />
          <Route path="/overdue-invoice" element={<OverDue />} />
          <Route path="/draft-invoice" element={<Draft_Invoice />} />
          <Route path="/recurring-invoice" element={<Recurring_Invoice />} />
          <Route path="/cancelled-invoice" element={<Cancelled_Invoice />} />
          <Route path="/invoice-grid" element={<Invoice_Grid />} />
          <Route path="/add-invoice" element={<Add_Invoices />} />
          <Route path="/edit-invoice" element={<Edit_Invoices />} />
          <Route path="/invoice-details" element={<Invoice_Details />} />
          <Route path="/invoice-settings" element={<Invoice_GeneralSettings />} />
          <Route path="/tax-settings" element={<Tax_Settings />} />
          <Route path="/bank-settings" element={<Bank_Settings />} />

          {/* UI Elements & Forms */}
          <Route path="/ui-kit" element={<UiKit />} />
          <Route path="/typography" element={<Typography />} />
          <Route path="/tab" element={<Tab />} />
          <Route path="/basic-input" element={<BasicInput />} />
          <Route path="/inputgroup" element={<InputGroups />} />
          <Route path="/horizontal-form" element={<HorizontalForm />} />
          <Route path="/vertical-form" element={<VerticalForm />} />

          {/* Tables */}
          <Route path="/basic-table" element={<BasicTable />} />
          <Route path="/data-table" element={<DataTable />} />

          {/* Calendar */}
          <Route path="/calender" element={<Calender />} />

          {/* Dashboards */}
          <Route path="/admin-dashboard" element={<Admin_Dashboard />} />
          <Route path="/doctor-dashboard" element={<Doctor_Dashboard />} />
          <Route path="/clinic-dashboard" element={<Clinic_Dashboard />} />
          <Route path="/patient-dashboard" element={<Patient_Dashboard />} />

          {/* Fallback */}
          <Route
            path="*"
            element={
              <div style={{ padding: "40px", textAlign: "center" }}>
                <h2>404 - Page Not Found</h2>
                <Link to="/">Go to MedArc Home</Link>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>

      <div className="sidebar-overlay"></div>
    </>
  );
};

export default Approuter;