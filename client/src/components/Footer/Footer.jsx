import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'

function Footer() {
  return (
    <div className='footer' id='footer'>
        <div className="footer-content">
            <div className="footer-content-left">
                <img src={assets.logo2} alt="" />
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi rem illum architecto iure illo adipisci sapiente ipsa exercitationem, blanditiis aliquam!</p>
                <div className="footer-social-icons">
                    <img src={assets.facebook_icon} alt="" />
                    <img src={assets.twitter_icon} alt="" />
                    <img src={assets.linkedin_icon} alt="" />
                </div>
            </div>
            <div className="footer-content-center">
                <h2>COMPANY</h2>
                <ul>
                    <li>Home</li>
                    <li>About Us</li>
                    <li>Delivery</li>
                    <li>Privacy Policy</li>
                </ul>
            </div>
            <div className="footer-content-right">
                <h2>GET IN TOUCH</h2>
                <ul>
                    <li>+91 8987765667</li>
                    <li>contact@foodie.com</li>
                </ul>
            </div>
        </div>
        <hr />
        <p className="footer-copyright">Copyright 2026 &copy; Foodie.com - All rights reserved</p>
    </div>
  )
}

export default Footer