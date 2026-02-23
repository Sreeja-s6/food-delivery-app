import React, { useState, useEffect, useContext } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'

const Navbar = ({ setShowLogin }) => {

    const [menu, setMenu] = useState("Home")
    const [showDropdown, setShowDropdown] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const { getTotalCartAmount } = useContext(StoreContext);

    // check token on load
    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token) setIsLoggedIn(true)
    }, [])

    // LOGOUT
    const handleLogout = () => {
        localStorage.removeItem("token")
        setIsLoggedIn(false)
        setShowDropdown(false)
    }

    return (
        <div className='navbar'>
            <Link to='/'><img src={assets.logo2} alt="" className='logo' /></Link>

            <ul className="navbar-menu">
                <Link to='/' onClick={() => setMenu("Home")} className={menu === "Home" ? "active" : ""}>Home</Link>
                <a href='#explore-menu' onClick={() => setMenu("Menu")} className={menu === "Menu" ? "active" : ""}>Menu</a>
                <a href='#' onClick={() => setMenu("About")} className={menu === "About" ? "active" : ""}>About</a>
                <a href='#' onClick={() => setMenu("Contact")} className={menu === "Contact" ? "active" : ""}>Contact</a>
            </ul>

            <div className="navbar-right">

                {/* CART */}
                <div className="navbar-search-icon">
                    <Link to='/cart'>
                        <img src={assets.basket_icon} alt="" />
                    </Link>
                    <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
                </div>

                {/* LOGIN OR USER */}
                {!isLoggedIn ? (
                    <button onClick={() => setShowLogin(true)}>Login</button>
                ) : (
                    <div className="navbar-profile">
                        <img 
                            src={assets.profile_icon} 
                            alt="" 
                            onClick={() => setShowDropdown(!showDropdown)}
                        />

                        {showDropdown && (
                            <ul className="dropdown-menu">
                                <li>
                                    <Link to="/my-orders">My Orders</Link>
                                </li>
                                <li onClick={handleLogout}>
                                    Logout
                                </li>
                            </ul>
                        )}
                    </div>
                )}

            </div>
        </div>
    )
}

export default Navbar
