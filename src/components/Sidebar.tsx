import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaUser } from "react-icons/fa";
import { MdEvent } from "react-icons/md";
import { useUserAuthContext } from '../context/user/user.hook';
import { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import { LuLogOut, LuSparkles } from 'react-icons/lu';
import { UserAuthAction } from '../context/user/user-reducer';
import { Text } from '@chakra-ui/react';

const Sidebar = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const { token, dispatch } = useUserAuthContext();
  const currentPath = location.pathname;

  const [userName, setUserName] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("");

  useEffect(() => {
    if (!token) return;
    const decodedToken = jwtDecode<{ [key: string]: any }>(token);
    const nameClaim = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name";
    const roleClaim = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
    setUserName(decodedToken[nameClaim]);
    setUserRole(decodedToken[roleClaim]);
  }, [token]);

  const navItems = [
    { 
      path: "/dashboard", 
      label: "Dashboard", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      ) 
    },
    { 
      path: "/employee-events", 
      label: "Employee Events", 
      icon: (
       <MdEvent className='w-5 h-5'/>
      ) 
    },
    { 
      path: "/employee-management", 
      label: "Employee List", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
        </svg>
      ) 
    },
    { 
      path: "/event-types", 
      label: "Event Types", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
        </svg>
      ) 
    },
    { 
      path: "/user-management", 
      label: "User Management", 
      icon: (
        <FaUser />
      ) 
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    dispatch({ type: UserAuthAction.LOG_OUT as keyof typeof UserAuthAction });
    navigate('/');
  }
  return (
    <aside className="w-64 bg-gradient-to-b from-red-700 to-red-900 text-white flex flex-col h-screen shadow-xl">
      <div className="p-6">
        <div className="flex items-center justify-center space-x-2">
          <LuSparkles className='text-red-100 w-8 h-8' />
          <Text className="text-xl font-bold">SparkHub</Text>
        </div>
      </div>
      <div className="px-3 py-2">
        <div className="text-xs font-semibold text-red-200 tracking-wider uppercase pl-4">
          Main Navigation
        </div>
      </div>
      
      <nav className="flex-1 px-3 py-2 space-y-1">
        {navItems.map((item) => (
          <Link 
            key={item.path}
            to={item.path}
            className={`flex items-center px-4 py-3 transition-all rounded-lg ${
              currentPath === item.path 
                ? 'bg-white! text-red-800! shadow-md' 
                : 'text-red-100 hover:bg-red-600'
            }`}
          >
            <div className="mr-3">
              {item.icon}
            </div>
            <span className="font-medium">{item.label}</span>
            {currentPath === item.path && (
              <div className="ml-auto w-1.5 h-6 bg-red-400 rounded-full"></div>
            )}
          </Link>
        ))}
      </nav>
      
      <div className="p-4 mt-auto border-t border-red-600">
        <div onClick={handleLogout} className="flex mb-3 ml-2">
          <LuLogOut className='w-5 h-5 text-red-50 hover:text-red-100' />
          <span className="ml-2 text-sm text-red-50 hover:text-red-100 cursor-pointer">Logout</span>
        </div>
        <div className="flex items-center px-2 py-3 w-full">
          <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
            <span className="font-medium text-sm uppercase">{userName.charAt(0)}</span>
            <span className="font-medium text-sm uppercase">{userName.charAt(1)}</span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium capitalize">{userName}</p>
            {
              userRole?.includes('SuperAdmin') ?
              <p className="text-xs text-red-200 uppercase">Super Admin</p>
              :
              <p className="text-xs text-red-200 uppercase">User</p>
            }
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;