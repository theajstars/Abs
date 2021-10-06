import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { fetchCart } from "./FetchUserData";
import NavActions from "../NavActions";
import SearchBox from "../SearchBox";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import "../../Assets/CSS/Profile.css";
import { Container, Switch } from "@mui/material";
export default function Profile() {
  const [token, setToken] = useState(Cookies.get("ud"));
  const [cart, updateCart] = useState([]);
  const [profile, updateProfile] = useState({});

  const [activePage, setActivePage] = useState("account");
  const [newsletter, toggleNewsletter] = useState(false);
  useEffect(() => {
    document.title = "Profile";
    if (token !== undefined) {
      axios
        .get("http://localhost:8080/user/cart/checkout", {
          headers: { "x-access-token": token },
        })
        .then((res) => {
          updateCart(res.data.checkoutCart);
          console.log(res.data.checkoutCart);
        });
      // Fetch user profile
      axios
        .get("http://localhost:8080/user/profile", {
          headers: { "x-access-token": token },
        })
        .then((res) => {
          updateProfile(res.data.profile);
          console.log(res.data);
        });
    } else {
      //User is not logged in
    }
  }, []);

  return (
    <>
      <SearchBox />
      <NavActions cart={cart} />
      {token === undefined && <Redirect to="/login" />}
      <div className="profile-container">
        <Container maxWidth="md">
          <div className="profile-nav">
            <div className="profile-nav-left">
              <span
                className="profile-link edit-account active-profile-link"
                onClick={() => setActivePage("account")}
              >
                Edit Account
              </span>

              <span
                className="profile-link orders inactive-profile-link"
                onClick={() => setActivePage("orders")}
              >
                My Orders
              </span>
            </div>
            <div className="profile-nav-right">
              <span
                className="logout"
                onClick={() => {
                  Cookies.remove("ud");
                  setToken(Cookies.get("ud"));
                }}
              >
                Logout
              </span>
            </div>
          </div>
          {activePage === "account" && (
            <div className="account-container">
              <div className="profile-form-row">
                <input
                  type="text"
                  className="form-input profile-form-input"
                  placeholder="Name"
                  value={profile.name}
                  spellCheck="false"
                  onChange={(e) =>
                    updateProfile({ ...profile, name: e.target.value })
                  }
                />
                <input
                  type="text"
                  className="form-input profile-form-input"
                  placeholder="Email"
                  value={profile.email}
                  spellCheck="false"
                  onChange={(e) =>
                    updateProfile({ ...profile, email: e.target.value })
                  }
                />
              </div>
              <span className="change-password">
                Change password&nbsp; <i className="far fa-key"></i>
              </span>
              <div className="newsletter">
                Subscribe to newsletter
                <Switch
                  value={newsletter}
                  checked={newsletter}
                  onChange={() => toggleNewsletter(!newsletter)}
                />
              </div>
              <span className="submit-profile">Submit</span>
            </div>
          )}
        </Container>
      </div>
    </>
  );
}
