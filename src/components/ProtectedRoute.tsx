
import { useEffect, useState } from 'react';
import { useUserAuthContext } from '../context/user/user.hook';
import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import PageNotFound from '../pages/404';

const ProtectedRoute = ({role}: {role: string}) => {

  const { token } = useUserAuthContext();
  const [userRole, setUserRole] = useState<string>("");
  
  useEffect(() => {
    if (!token) return;
    const decodedToken = jwtDecode<{ [key: string]: any }>(token);
    const roleClaim = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
    setUserRole(decodedToken[roleClaim]);
  }, [token]);
  
  if (!token) {
    return <Navigate to="/" replace />;
  }

  if(!userRole?.includes(role)) {
    return (
      <PageNotFound
      errorCode="401" 
      title="You shouldn't be here" 
      desc="You are not authorize or do not have sufficient permission to view this resource."/>
    )
  }
  
  return <>
    <Outlet />
    </>
};

export default ProtectedRoute;
