/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import { blog, dashboard, doctor, doctorschedule, logout, menuicon04, menuicon06, menuicon08, menuicon09, menuicon10, menuicon11, menuicon12, menuicon14, menuicon15, menuicon16, patients, sidemenu } from './imagepath';
import Scrollbars from "react-custom-scrollbars-2";

const Sidebar = (props) => {
  const [sidebar, setSidebar] = useState("");
  
  // Read user role safely from localStorage
  const role = localStorage.getItem("role") || "patient";

  const handleClick = (e, item, item1, item3) => {
    const div = document.querySelector(`#${item}`);
    const ulDiv = document.querySelector(`.${item1}`);
    e?.target?.className ? ulDiv.style.display = 'none' : ulDiv.style.display = 'block'
    e?.target?.className ? div.classList.remove('subdrop') : div.classList.add('subdrop');
  }

  useEffect(() => {
    if (props?.id && props?.id1) {
      const ele = document.getElementById(`${props?.id}`);
      handleClick(ele, props?.id, props?.id1);
    }
  }, [])

  const expandMenu = () => {
    document.body.classList.remove("expand-menu");
  };
  
  const expandMenuOpen = () => {
    document.body.classList.add("expand-menu");
  };

  return (
    <>
      <div className="sidebar" id="sidebar">
        <Scrollbars
          autoHide
          autoHideTimeout={1000}
          autoHideDuration={200}
          autoHeight
          autoHeightMin={0}
          autoHeightMax="95vh"
          thumbMinSize={30}
          universal={false}
          hideTracksWhenNotNeeded={true}
        >
          <div className="sidebar-inner slimscroll">
            <div id="sidebar-menu" className="sidebar-menu"
              onMouseLeave={expandMenu}
              onMouseOver={expandMenuOpen}
            >
              <ul>
                <li className="menu-title">Main</li>
                
                {/* Dashboard Menu */}
                <li className="submenu" >
                  <Link to="#" id="menu-item" onClick={(e) => {
                    handleClick(e, "menu-item", "menu-items")
                  }}>
                    <span className="menu-side">
                      <img src={dashboard} alt="" />
                    </span>{" "}
                    <span> Dashboard </span> <span className="menu-arrow" />
                  </Link>
                  <ul style={{ display: sidebar === 'Dashboard' ? 'block' : "none" }} className='menu-items'>
                    {role === 'admin' && (
                      <li>
                        <Link className={props?.activeClassName === 'admin-dashboard' ? 'active' : ''} to="/admin-dashboard">Admin Dashboard</Link>
                      </li>
                    )}
                    {role === 'doctor' && (
                      <li>
                        <Link className={props?.activeClassName === 'doctor-dashboard' ? 'active' : ''} to="/doctor-dashboard">Doctor Dashboard</Link>
                      </li>
                    )}
                    {role === 'patient' && (
                      <li>
                        <Link className={props?.activeClassName === 'patient-dashboard' ? 'active' : ''} to="/patient-dashboard">Patient Dashboard</Link>
                      </li>
                    )}
                  </ul>
                </li>

                {/* Doctor Specific or Admin Menu */}
                {(role === 'admin') && (
                  <li className="submenu">
                    <Link to="#" id="menu-item1" onClick={(e) => {
                      handleClick(e, "menu-item1", "menu-items1")
                    }}>
                      <span className="menu-side">
                        <img src={doctor} alt="" />
                      </span>{" "}
                      <span> Doctors </span> <span className="menu-arrow" />
                    </Link>
                    <ul style={{ display: 'none' }} className="menu-items1">
                      <li>
                        <Link className={props?.activeClassName === 'doctor-list' ? 'active' : ''} to="/doctorlist">Doctor List</Link>
                      </li>
                      {role === 'admin' && (
                        <li>
                          <Link className={props?.activeClassName === 'add-doctor' ? 'active' : ''} to="/add-doctor">Add Doctor</Link>
                        </li>
                      )}
                    </ul>
                  </li>
                )}

                {/* Clinic Menu - Admin Only */}
                {role === 'admin' && (
                  <li className="submenu">
                    <Link to="#" id="menu-item3" onClick={(e) => {
                      handleClick(e, "menu-item3", "menu-items3")
                    }}>
                      <span className="menu-side">
                        <img src={doctor} alt="" />
                      </span>{" "}
                      <span> Clinic </span> <span className="menu-arrow" /> 
                    </Link>
                    <ul style={{ display: 'none' }} className="menu-items3">
                      <li>
                        <Link className={props?.activeClassName === 'clinic-list' ? 'active' : ''} to="/cliniclist">Clinic List</Link>
                      </li>
                    </ul>
                  </li>
                )}

                {/* Patients Menu */}
                {role !== 'patient' ? (
                  <li className="submenu">
                    <Link to="#" id="menu-item2" onClick={(e) => handleClick(e, "menu-item2", "menu-items2")}>
                      <span className="menu-side">
                        <img src={patients} alt="" />
                      </span>{" "}
                      <span>Patients </span> <span className="menu-arrow" />
                    </Link>
                    <ul style={{ display: "none" }} className="menu-items2">
                      <li>
                        <Link className={props?.activeClassName === 'patient-list' ? 'active' : ''} to="/patientslist">Patients List</Link>
                      </li>
                    </ul>
                  </li>
                ) : (
                  <li>
                    <Link className={props?.activeClassName === 'patient' ? 'active' : ''} to="/patientsprofile">
                      <span className="menu-side">
                        <img src={patients} alt="" />
                      </span>
                      <span>My Profile</span>
                    </Link>
                  </li>
                )}

                {/* Appointments */}
                <li className="submenu">
                  <Link to="#" id="menu-item4" onClick={(e) => handleClick(e, "menu-item4", "menu-items4")}>
                    <span className="menu-side">
                      <img src={menuicon04} alt="" />
                    </span>{" "}
                    <span> Appointments </span> <span className="menu-arrow" />
                  </Link>
                  <ul style={{ display: "none" }} className="menu-items4">
                    <li>
                      <Link className={props?.activeClassName === 'appoinment-list' ? 'active' : ''} to="/appoinmentlist">Appointment List</Link>
                    </li>
                  </ul>
                </li>

              </ul>
              <div className="logout-btn">
                <Link to="/login" onClick={() => { localStorage.clear(); sessionStorage.clear(); }}>
                  <span className="menu-side">
                    <img src={logout} alt="" />
                  </span>{" "}
                  <span>Logout</span>
                </Link>
              </div>
            </div>
          </div>
        </Scrollbars>
      </div>
    </>
  )
}

export default Sidebar;