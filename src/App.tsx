import { Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import { Toaster } from 'react-hot-toast'
import EmployeeManagement from './pages/EmployeeManagement'
import Events from './pages/EventsType'
import RoleManagement from './pages/RoleManagement'
import UserManagement from './pages/UserManagement'
import EmployeeEvents from './pages/EmployeeEvents'
import PageNotFound from "./pages/404";
import ProtectedRoute from './components/ProtectedRoute'

function App() {

  return (
    <>
    <Toaster />
    <Routes>
      <Route element={<Login />} path='/' />
      <Route element={<Register />} path='/register' />
      <Route element={<ProtectedRoute />}>
        <Route path="dashboard" element={<Dashboard />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="employee-management" element={<EmployeeManagement />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="event-types" element={<Events />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="employee-events" element={<EmployeeEvents />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="role-management" element={<RoleManagement />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="user-management" element={<UserManagement />} />
      </Route>

      {/* <Route
          element={<ProtectedRoute path="dashboard" roles={["SuperAdmin"]} />}
        >
          <Route path="dashboard" element={<Dashboard />} />
        </Route> */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
    </>
  )
}

export default App
