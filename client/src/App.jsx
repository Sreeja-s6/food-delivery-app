import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes, useNavigate } from 'react-router-dom'
import Home from './pages/Home/Home'
import Cart from './pages/Cart/Cart'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import MyOrders from "./pages/MyOrders/MyOrders";
import LoginPopup from './components/LoginPopup/LoginPopup'
import Footer from './components/Footer/Footer'
import { ToastContainer } from 'react-toastify';

// Import Admin Components
import Sidebar from './admin/Sidebar/Sidebar'
import AdminNavbar from './admin/Navbar/Navbar'
import Add from './admin/Add/Add'
import List from './admin/List/List'
import AdminOrders from './admin/Orders/Orders'

const App = () => {
  const [showLogin, setShowLogin] = useState(false)
  const [userRole, setUserRole] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const navigate = useNavigate();

  // decode token
  const getUserRole = () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setIsLoggedIn(false)
      setUserRole(null)
      return null
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      setIsLoggedIn(true)
      setUserRole(payload.role)
      return payload.role
    } catch (error) {
      localStorage.removeItem('token')
      setIsLoggedIn(false)
      setUserRole(null)
      return null
    }
  }

  useEffect(() => {
    getUserRole()

    const handleStorageChange = () => {
      getUserRole()
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // AUTO REDIRECT ADMIN
  useEffect(() => {
    if (isLoggedIn && userRole === "admin") {
      navigate("/admin/add");
    }
  }, [isLoggedIn, userRole]);

  // ADMIN LAYOUT
  const AdminLayout = () => {

    return (
      <>
        <AdminNavbar />
        <hr />
        <div className="app-content">
          <ToastContainer autoClose={2000} /> 
          <Sidebar />
          <Routes>
            <Route path="add" element={<Add />} />
            <Route path="list" element={<List />} />
            <Route path="orders" element={<AdminOrders url={import.meta.env.VITE_API_URL} />} />
            <Route index element={<Add />} />
          </Routes>
        </div>
      </>
    )
  }

  // USER LAYOUT
  const UserLayout = () => {
    return (
      <>
        <div className='app'>
          <ToastContainer autoClose={2000} />
          <Navbar setShowLogin={setShowLogin} />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/order' element={<PlaceOrder />} />
            <Route path="/my-orders" element={<MyOrders />} />
          </Routes>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}

      <Routes>
        {/* ADMIN ROUTES */}
        {isLoggedIn && userRole === "admin" && (
          <Route path="/admin/*" element={<AdminLayout />} />
        )}

        {/* USER ROUTES */}
        <Route path="/*" element={<UserLayout />} />
      </Routes>
    </>
  )
}

export default App
