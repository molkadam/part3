import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Nav";
import Welcome from "./components/Welcome";
import Register from "./components/Register";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./components/Login";
import "./styles/style.css";
import UserList from "./components/UserList";
import Logout from "./components/Logout.js";
import ChatList from "./components/ChatList.js";
import Uploads from "./components/Uploads.js";
import PrivateRoute from "./components/PrivateRoute.js";
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!sessionStorage.getItem("userId");
  });

  useEffect(() => {
    // Check if user is already logged in (you can check from localStorage)
    const logddin = sessionStorage.getItem("userId");
    if (logddin) {
      setIsLoggedIn(true);
    }
  }, []);
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogoutClick = () => {
    setIsLoggedIn(false);
  };

  return (
    <>
      <Router>
        <Navigation isLoggedIn={isLoggedIn} />
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login handleLogin={handleLogin} />} />
          <Route
            path="/logout"
            element={<Logout handleLogoutClick={handleLogoutClick} />}
          />
          <Route
            path="/userlist"
            element={
              <PrivateRoute
                element={<UserList />}
                isLoggedIn={isLoggedIn}
                msg="You are not logged in. Please log in to access the UserList page."
              />
            }
          />
          <Route
            path="/chatlist"
            element={
              <PrivateRoute
                element={<ChatList />}
                isLoggedIn={isLoggedIn}
                msg="You are not logged in. Please log in to access the ChatList page."
              />
            }
          />
          <Route
            path="/uploads"
            element={
              <PrivateRoute
                element={<Uploads />}
                isLoggedIn={isLoggedIn}
                msg="You are not logged in. Please log in to upload and view the files."
              />
            }
          />
        </Routes>
      </Router>

      <Router></Router>
    </>
  );
}

export default App;
