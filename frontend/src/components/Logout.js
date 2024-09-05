import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = ({ handleLogoutClick }) => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("loggdin");
    sessionStorage.removeItem('userId');
    handleLogoutClick(false);
    navigate("/welcome");
  }, [navigate, handleLogoutClick]);

  return null;
};

export default Logout;
