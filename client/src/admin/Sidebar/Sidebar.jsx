import React from "react";
import "./Sidebar.css";
import { assets } from "../../assets/assets";
import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-options">

        <NavLink to="/admin/add" className="sidebar-option">
          <img src={assets.addIcon} alt="" style={{width:"30px"}} />
          <p>Add Items</p>
        </NavLink>

        <NavLink to="/admin/list" className="sidebar-option">
          <img src={assets.listIcon} alt="" style={{width:"30px"}} />
          <p>List Items</p>
        </NavLink>

        <NavLink to="/admin/orders" className="sidebar-option">
          <img src={assets.orderIcon} alt="" style={{width:"30px"}} />
          <p>Orders</p>
        </NavLink>

      </div>
    </div>
  );
}

export default Sidebar;
