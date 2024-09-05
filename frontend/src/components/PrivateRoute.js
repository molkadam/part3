import { Navigate } from "react-router-dom";
const PrivateRoute = ({ element, isLoggedIn, msg }) => {
  return isLoggedIn ? (
    element
  ) : (
    <Navigate to="/" state={{ from: window.location.pathname, msg }} />
  );
};

export default PrivateRoute;
