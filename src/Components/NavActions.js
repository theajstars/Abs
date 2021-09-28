import Cookies from "js-cookie";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../Assets/CSS/NavActions.css";
import { fetchCart } from "./Auth/FetchUserData";

export default function NavActions({ cart }) {
  // const [cart, updateCart] = useState([]);

  const token = Cookies.get("ud");
  useEffect(() => {
    //   if (token !== undefined) {
    //     fetchCart().then((res) => {
    //       updateCart(res.cart);
    //       console.log(res.cart);
    //     });
    //   }
  }, [cart]);
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
          <span
            className={`${
              cart.length || [].length > 0 ? "cart-length" : "none-display"
            }`}
          >
            {cart.length || [].length}
          </span>
        </Link>
        <Link to="/saved" className="nav-action">
          <i className="far fa-heart"></i>
        </Link>
      </div>
    </>
  );
}
