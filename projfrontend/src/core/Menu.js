import React, { Fragment } from "react";
import { withRouter, Link, Redirect } from "react-router-dom";
import { signout, isAuthenticated } from "../auth";

const currentTab = (history, path) => {
  if (history.location.pathname === path) {
    return { color: "#2ecc72" };
  } else {
    return { color: "#FFFFFF" };
  }
};

const Menu = ({ history }) => (
  <div>
    <ul className="nav nav-tabs bg-dark">
      <li className="nav-item">
        <Link className="nav-link" to="/" style={currentTab(history, "/")}>
          Home
        </Link>
      </li>
      <li className="nav-item">
        <Link
          className="nav-link"
          to="/Cart"
          style={currentTab(history, "/Cart")}
        >
          Cart
        </Link>
      </li>
      {isAuthenticated() && isAuthenticated().user.role === 0 && (
        <li className="nav-item">
          <Link
            className="nav-link"
            to="/user/dashboard"
            style={currentTab(history, "/user/dashboard")}
          >
            User Dashboard
          </Link>
        </li>
      )}
      {isAuthenticated() && isAuthenticated().user.role === 1 && (
        <li className="nav-item">
          <Link
            className="nav-link"
            to="/admin/dashboard"
            style={currentTab(history, "/admin/dashboard")}
          >
            Admin Dashboard
          </Link>
        </li>
      )}
      {!isAuthenticated() && (
        <Fragment>
          <li className="nav-item">
            <Link
              className="nav-link"
              to="/signup"
              style={currentTab(history, "/signup")}
            >
              Sign Up
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link"
              to="/signin"
              style={currentTab(history, "/signin")}
            >
              Sign In
            </Link>
          </li>
        </Fragment>
      )}
      {isAuthenticated() && (
        <li className="nav-item">
          <span
            className="nav-link text-warning"
            style={{ cursor: "pointer" }}
            onClick={() => {
              signout(() => history.push("/"));
            }}
          >
            Signout
          </span>
        </li>
      )}
    </ul>
  </div>
);

export default withRouter(Menu);
// withRouter will pass some property while rendering the Menu component
