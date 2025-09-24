import { Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import { Toaster } from 'react-hot-toast'
import EmployeeManagement from './pages/EmployeeManagement'
import RoleManagement from './pages/RoleManagement'
import UserManagement from './pages/UserManagement'
import EmployeeEvents from './pages/EmployeeEvents'
import PageNotFound from "./pages/404";
import ProtectedRoute from './components/ProtectedRoute'
import Events from './pages/Events'
import EventTypes from './pages/EventsType'

function App() {

  return (
    <>
    <Toaster />
    <Routes>
      <Route element={<Login />} path='/' />
      <Route element={<Register />} path='/register' />
      <Route element={<Events />} path='/events' />
      <Route element={<ProtectedRoute />}>
        <Route path="dashboard" element={<Dashboard />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="employee-management" element={<EmployeeManagement />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="event-types" element={<EventTypes />} />
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
      <Route path="*" element={<PageNotFound />} />
    </Routes>
    </>
  )
}

export default App
