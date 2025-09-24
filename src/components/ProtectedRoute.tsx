
import { useUserAuthContext } from '../context/user/user.hook';
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
   const { token } = useUserAuthContext();
  if (!token) {
    return <Navigate to="/" replace />;
  }

  return <>
    <Outlet />
    </>
};

export default ProtectedRoute;
