import React from "react";
import { Link } from "react-router-dom";
import "../Assets/CSS/NavActions.css";
export default function NavActions() {
  return (
    <>
      <div className="nav-actions-container">
        <Link to="/" className="nav-action">
          <i className="far fa-home"></i>
        </Link>
        <Link to="/profile" className="nav-action">
          <i className="far fa-user"></i>
        </Link>
        <Link to="/cart" className="nav-action">
          <i className="far fa-shopping-cart"></i>
        </Link>
        <Link to="/saved" className="nav-action">
          <i className="far fa-heart"></i>
        </Link>
      </div>
    </>
  );
}
