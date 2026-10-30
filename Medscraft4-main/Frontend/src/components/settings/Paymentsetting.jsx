import React from 'react'
import Header from 'src/components/Header'
import Sidebar from 'src/components/Sidebar'
import { Link } from 'react-router-dom'
import FeatherIcon from 'feather-icons-react/build/FeatherIcon'

const Paymentsetting = () => {
  return (
    <div>
      <Header />
      <Sidebar />
      <div className="page-wrapper">
        {/* Page Content */}
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="index.html">Dashboard </Link>
                  </li>
                  <li className="breadcrumb-item">
                    <i className="feather-chevron-right">
                      <FeatherIcon icon="chevron-right"/>
                    </i>
                  </li>
                  <li className="breadcrumb-item active">Settings</li>
                </ul>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          <div className="settings-menu-links">
            <ul className="nav nav-tabs menu-tabs">
              <li className="nav-item ">
                <Link className="nav-link" to="/settings">
                  General Settings
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/localization">
                  Localization
                </Link>
              </li>
              <li className="nav-item active">
                <Link className="nav-link" to="/paymentsetting">
                  Payment Settings
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/settingsemail">
                  Email Settings
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/settingssocialmedia">
                  Social Media Login
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/settingssociallink">
                  Social Links
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/settingsseo">
                  SEO Settings
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/settingsthem">
                  Theme Settings
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/settingschangepassword">
                  Change Password
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/settingsothers">
                  Others
                </Link>
              </li>
            </ul>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="card-title">Paypal</h5>
                  <div className="status-toggle d-flex justify-content-between align-items-center">
                    <input type="checkbox" id="status_1" className="check" />
                    <label htmlFor="status_1" className="checktoggle">
                      checkbox
                    </label>
                  </div>
                </div>
                <div className="card-body pt-0">
                  <form>
                    <div className="settings-form">
                      <div className="form-group">
                        <p className="pay-cont">Paypal Option</p>
                        <label className="custom_radio me-4">
                          <input
                            type="radio"
                            name="budget"
                            defaultChecked={true}
                          />
                          <span className="checkmark"/> Sandbox
                        </label>
                        <label className="custom_radio">
                          <input type="radio" name="budget" defaultValue="Yes" />
                          <span className="checkmark" /> Live
                        </label>
                      </div>
                      {/* Braintree & Paypal Inputs with safe placeholders */}
                      <div className="form-group form-placeholder">
                        <label>
                          Braintree Tokenization key <span className="star-red">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Tokenization key"
                        />
                      </div>
                      <div className="form-group form-placeholder">
                        <label>
                          Braintree Merchant ID <span className="star-red">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Merchant ID"
                        />
                      </div>
                      <div className="form-group form-placeholder">
                        <label>
                          Braintree Public key <span className="star-red">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Public key"
                        />
                      </div>
                      <div className="form-group form-placeholder">
                        <label>
                          Braintree Private key <span className="star-red">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Private key"
                        />
                      </div>
                      <div className="form-group form-placeholder">
                        <label>
                          Paypal APP ID <span className="star-red">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter APP ID"
                        />
                      </div>
                      <div className="form-group form-placeholder">
                        <label>
                          Paypal Secret Key <span className="star-red">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Secret Key"
                        />
                      </div>
                      <div className="form-group mb-0">
                        <div className="settings-btns">
                          <button
                            type="submit"
                            className="border-0 btn btn-primary btn-gradient-primary btn-rounded"
                          >
                            Save
                          </button>
                          &nbsp;&nbsp;
                          <button
                            type="submit"
                            className="btn btn-secondary btn-rounded"
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
            <div className="col-md-6">
              <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="card-title">Stripe</h5>
                  <div className="status-toggle d-flex justify-content-between align-items-center">
                    <input
                      type="checkbox"
                      id="status_2"
                      className="check"
                      defaultChecked={true}
                    />
                    <label htmlFor="status_2" className="checktoggle">
                      checkbox
                    </label>
                  </div>
                </div>
                <div className="card-body pt-0">
                  <form>
                    <div className="settings-form">
                      <div className="form-group">
                        <p className="pay-cont">Stripe Option</p>
                        <label className="custom_radio me-4">
                          <input
                            type="radio"
                            name="budget"
                            defaultChecked={true}
                          />
                          <span className="checkmark" /> Sandbox
                        </label>
                        <label className="custom_radio">
                          <input type="radio" name="budget" defaultValue="Yes" />
                          <span className="checkmark" /> Live
                        </label>
                      </div>
                      <div className="form-group form-placeholder">
                        <label>
                          Gateway Name <span className="star-red">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Stripe"
                        />
                      </div>
                      <div className="form-group form-placeholder">
                        <label>
                          API Key <span className="star-red">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter API Key"
                          defaultValue={import.meta.env.VITE_STRIPE_API_KEY || ""}
                        />
                      </div>
                      <div className="form-group form-placeholder">
                        <label>
                          Rest Key <span className="star-red">*</span>
                        </label>
                        <label className="star-red">*</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Rest Key"
                          defaultValue={import.meta.env.VITE_STRIPE_REST_KEY || ""}
                        />
                      </div>
                      <div className="form-group mb-0">
                        <div className="settings-btns">
                          <button
                            type="submit"
                            className="border-0 btn btn-primary btn-gradient-primary btn-rounded"
                          >
                            Save
                          </button>
                          &nbsp;&nbsp;
                          <button
                            type="submit"
                            className="btn btn-secondary btn-rounded"
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
        {/* /Page Content */}
      </div>
    </div>
  )
}

export default Paymentsetting;