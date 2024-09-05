import React from "react";
import { NavLink } from "react-router-dom";
import { Container } from "react-bootstrap";

const Navigation = ({ isLoggedIn }) => {
  return (
    <Container className="navigationBar center">
      <div className="nav">
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Home
        </NavLink>
      </div>

      {/* Show these links only if the user is not logged in */}
      {!isLoggedIn && (
        <>
          <div className="nav">
            <NavLink
              to="/login"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Login
            </NavLink>
          </div>

          <div className="nav">
            <NavLink
              to="/register"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Register
            </NavLink>
          </div>
        </>
      )}

      {/* Show these links only if the user is logged in */}
      {isLoggedIn && (
        <>
          <div className="nav">
            <NavLink
              to="/chatlist"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Chat List
            </NavLink>
          </div>

          <div className="nav">
            <NavLink
              to="/userlist"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              User List
            </NavLink>
          </div>

          <div className="nav">
            <NavLink
              to="/uploads"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Uploads
            </NavLink>
          </div>

          <div className="nav">
            <NavLink
              to="/logout"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Logout
            </NavLink>
          </div>
        </>
      )}
    </Container>
  );
};

export default Navigation;
