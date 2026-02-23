import React, { useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'

function AdminNavbar() {

  const [showDropdown, setShowDropdown] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("token") 
    navigate("/") // go to homepage
  }

  return (
    <div className='admin-navbar'>
      <img className='admin-logo' src={assets.logo2} alt="" />

      <div className='admin-profile-container'>
        <img
          className='admin-profile'
          src={assets.profile_image}
          alt=""
          onClick={() => setShowDropdown(!showDropdown)}
        />

        {showDropdown && (
          <div className='admin-dropdown'>
            <p onClick={handleLogout}>Logout</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminNavbar
