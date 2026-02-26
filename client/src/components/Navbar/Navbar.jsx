import React, { useState, useEffect, useContext } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'
import { useTheme } from '../../context/ThemeContext'

const Navbar = ({ setShowLogin }) => {

    const [menu, setMenu] = useState("Home")
    const [showDropdown, setShowDropdown] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const { getTotalCartAmount } = useContext(StoreContext);
    const { darkMode, toggleTheme } = useTheme();

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token) setIsLoggedIn(true)
    }, [])

    const handleLogout = () => {
        localStorage.removeItem("token")
        setIsLoggedIn(false)
        setShowDropdown(false)
    }

    const handleMenuClick = (menuName) => {
        setMenu(menuName)
        setMobileMenuOpen(false)
    }

    return (
        <>
            <div className={`navbar ${darkMode ? "dark" : ""}`}>
                <Link to='/'>
                    <img src={assets.logo3} alt="" className='logo' />
                </Link>

                {/* DESKTOP MENU */}
                <ul className="navbar-menu">
                    <Link to='/' onClick={() => setMenu("Home")} className={menu === "Home" ? "active" : ""}>Home</Link>
                    <a href='#explore-menu' onClick={() => setMenu("Menu")} className={menu === "Menu" ? "active" : ""}>Menu</a>
                    <a href='#' onClick={() => setMenu("About")} className={menu === "About" ? "active" : ""}>About</a>
                    <a href='#' onClick={() => setMenu("Contact")} className={menu === "Contact" ? "active" : ""}>Contact</a>
                </ul>

                <div className="navbar-right">

                    {/* DARK MODE TOGGLE */}
                    <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
                        {darkMode ? "☀️" : "🌙"}
                    </button>

                    {/* CART */}
                    <div className="navbar-search-icon">
                        <Link to='/cart'>
                            <img src={assets.basket_icon} alt="" />
                        </Link>
                        <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
                    </div>

                    {/* LOGIN OR USER */}
                    {!isLoggedIn ? (
                        <button className="login-btn" onClick={() => setShowLogin(true)}>Login</button>
                    ) : (
                        <div className="navbar-profile">
                            <img
                                src={assets.profile_icon}
                                alt=""
                                onClick={() => setShowDropdown(!showDropdown)}
                            />
                            {showDropdown && (
                                <ul className="nav-dropdown">
                                    <li>
                                        <Link to="/my-orders" onClick={() => setShowDropdown(false)}>
                                            My Orders
                                        </Link>
                                    </li>
                                    <li onClick={handleLogout}>Logout</li>
                                </ul>
                            )}
                        </div>
                    )}

                    {/* HAMBURGER */}
                    <div className="hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? "✕" : "☰"}
                    </div>

                </div>
            </div>

            {/* MOBILE MENU */}
            {mobileMenuOpen && (
                <div className={`mobile-menu ${darkMode ? "dark" : ""}`}>
                    <Link to='/' onClick={() => handleMenuClick("Home")} className={menu === "Home" ? "active" : ""}>Home</Link>
                    <a href='#explore-menu' onClick={() => handleMenuClick("Menu")} className={menu === "Menu" ? "active" : ""}>Menu</a>
                    <a href='#' onClick={() => handleMenuClick("About")} className={menu === "About" ? "active" : ""}>About</a>
                    <a href='#' onClick={() => handleMenuClick("Contact")} className={menu === "Contact" ? "active" : ""}>Contact</a>
                </div>
            )}
        </>
    )
}

export default Navbar