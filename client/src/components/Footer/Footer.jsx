import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <div className='footer' id='footer'>
        <div className="footer-content">

            {/* LEFT - Brand */}
            <div className="footer-content-left">
                <img src={assets.logo3} alt="Foodie" className="footer-logo" />
                <p className="footer-desc">
                    Craving something delicious? Foodie delivers your favorite 
                    meals fresh and fast — right to your doorstep. 
                    Explore hundreds of dishes and order in just a few clicks!
                </p>
                <div className="footer-badges">
                    <div className="footer-badge">🚴 Fast Delivery</div>
                    <div className="footer-badge">🍽️ 100+ Dishes</div>
                    <div className="footer-badge">⭐ Top Rated</div>
                </div>
                {/* SOCIAL MEDIA ICONS */}
                <div className="footer-social">
                    <p className="social-title">Follow Us</p>
                    <div className="footer-social-icons">
                        <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-link facebook">
                            <img src={assets.facebook_icon} alt="Facebook" />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-link twitter">
                            <img src={assets.twitter_icon} alt="Twitter" />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-link linkedin">
                            <img src={assets.linkedin_icon} alt="LinkedIn" />
                        </a>
                    </div>
                </div>
            </div>

            {/* CENTER - Links */}
            <div className="footer-content-center">
                <h2>Quick Links</h2>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><a href="#explore-menu">Our Menu</a></li>
                    <li><a href="#footer">About Us</a></li>
                    <li><a href="#footer">Delivery Info</a></li>
                    <li><a href="#footer">Privacy Policy</a></li>
                    <li><a href="#footer">Terms of Service</a></li>
                </ul>
            </div>

            {/* RIGHT - Contact */}
            <div className="footer-content-right">
                <h2>Contact Us</h2>
                <div className="footer-contact-list">
                    <div className="footer-contact-item">
                        <span className="contact-icon">📞</span>
                        <div>
                            <p className="contact-label">Phone</p>
                            <p className="contact-value">+91 8987765667</p>
                        </div>
                    </div>
                    <div className="footer-contact-item">
                        <span className="contact-icon">📧</span>
                        <div>
                            <p className="contact-label">Email</p>
                            <p className="contact-value">contact@foodie.com</p>
                        </div>
                    </div>
                    <div className="footer-contact-item">
                        <span className="contact-icon">📍</span>
                        <div>
                            <p className="contact-label">Location</p>
                            <p className="contact-value">Kochi, Kerala, India</p>
                        </div>
                    </div>
                    <div className="footer-contact-item">
                        <span className="contact-icon">🕐</span>
                        <div>
                            <p className="contact-label">Working Hours</p>
                            <p className="contact-value">Mon - Sun: 8AM - 11PM</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        <hr className="footer-hr" />

        <div className="footer-bottom">
            <p className="footer-copyright">
                © 2026 Foodie.com — All Rights Reserved
            </p>
            <p className="footer-made">
                Made with ❤️ in Kerala, India
            </p>
        </div>
    </div>
  )
}

export default Footer