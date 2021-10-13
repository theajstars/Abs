import Cookies from "js-cookie";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../Assets/CSS/NavActions.css";

export default function NavActions({ cart }) {
  const [navVisibility, toggleNavVisibility] = useState(true);
  function toggleActions() {
    toggleNavVisibility(!navVisibility);
    var list = document.querySelector(".nav-actions-container").classList;
    if (list.contains("hide-nav-actions")) {
      list.remove("hide-nav-actions");
      list.add("show-nav-actions");
    } else {
      list.add("hide-nav-actions");
      list.remove("show-nav-actions");
    }
  }
  return (
    <>
      <span className="toggle-actions" onClick={() => toggleActions()}>
        {/* <i className="far fa-chevron-double-left"></i> */}
        {navVisibility && <i className="far fa-chevron-double-right"></i>}
        {!navVisibility && <i className="far fa-chevron-double-left"></i>}
      </span>
      <div className="nav-actions-container">
        <Link to="/" className="nav-action">
          <i className="far fa-home"></i>
        </Link>
        <Link to="/profile" className="nav-action">
          <i className="far fa-user"></i>
        </Link>
        <Link to="/cart" className="nav-action">
          <i className="far fa-shopping-cart"></i>
          <span
            className={`${
              cart.length || [].length > 0 ? "cart-length" : "none-display"
            }`}
          >
            {cart.length || [].length}
          </span>
        </Link>
      </div>
    </>
  );
}
