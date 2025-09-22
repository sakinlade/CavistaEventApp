import { Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import { Toaster } from 'react-hot-toast'
import EmployeeManagement from './pages/EmployeeManagement'
import Events from './pages/Events'
import RoleManagement from './pages/RoleManagement'
import UserManagement from './pages/UserManagement'

function App() {

  return (
    <>
    <Toaster />
    <Routes>
      <Route element={<Login />} path='/' />
      <Route element={<Register />} path='/register' />
      <Route element={<Dashboard />} path='/dashboard' />
      <Route element={<EmployeeManagement />} path='/employee-management' />
      <Route element={<Events />} path='/events' />
      <Route element={<RoleManagement />} path='/role-management' />
      <Route element={<UserManagement />} path='/user-management' />
    </Routes>
    </>
  )
}

export default App
