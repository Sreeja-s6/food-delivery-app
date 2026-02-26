import React from 'react'
import './ExploreMenu.css'
import { menu_list } from '../../assets/assets'
import { useTheme } from '../../context/ThemeContext'

const ExploreMenu = ({ category, setCategory }) => {

    const { darkMode } = useTheme();

    return (
        <div className={`explore-menu ${darkMode ? "dark" : ""}`} id='explore-menu'>
            
            <h1>Explore Our Menu</h1>
            
            <p className='explore-menu-text'>
                From sizzling street food to fine dining delights — 
                our menu has something for every craving. 
                Browse through our delicious categories, 
                add your favorites to cart, and get it delivered 
                fresh to your doorstep. Your next meal is just a click away!
            </p>

            <div className="explore-menu-list">
                {menu_list.map((item, index) => (
                    <div
                        onClick={() => setCategory(prev =>
                            prev === item.menu_name ? "All" : item.menu_name
                        )}
                        key={index}
                        className="explore-menu-list-item"
                    >
                        <img
                            className={category === item.menu_name ? "active" : ""}
                            src={item.menu_image}
                            alt={item.menu_name}
                        />
                        <p>{item.menu_name}</p>
                    </div>
                ))}
            </div>
            <hr />
        </div>
    )
}

export default ExploreMenu