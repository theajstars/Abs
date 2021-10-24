import Cookies from "js-cookie";
import React, { useEffect, useState, useRef } from "react";
import emailjs from "emailjs-com";
import { fetchCart } from "./FetchUserData";
import NavActions from "../NavActions";
import SearchBox from "../SearchBox";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import "../../Assets/CSS/Profile.css";
import { Container, Switch } from "@mui/material";
import ResponseMessage from "../ResponseMessage";
export default function Profile() {
  const [token, setToken] = useState(Cookies.get("ud"));
  const [cart, updateCart] = useState([]);
  const [profile, updateProfile] = useState({});
  const [orders, updateOrders] = useState([]);
  const [activePage, setActivePage] = useState("account");
  const [newsletter, toggleNewsletter] = useState(false);

  const [responseType, setResponseType] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [showResponse, setShowResponse] = useState(0);

  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [bgOverlay, toggleBgOverlay] = useState(false);
  const [validToken, updateValidToken] = useState(0);

  const changePasswordForm = useRef();

  useEffect(() => {
    document.title = "Profile";
    if (token !== undefined) {
      axios
        .get("https://abs-shop.herokuapp.com/user/cart/checkout", {
          headers: { "x-access-token": token },
        })
        .then((res) => {
          // updateCart(res.data.checkoutCart);
          fetchCart().then((res) => {
            updateCart(res.cart);
          });
        });
      // Fetch user profile
      axios
        .get("https://abs-shop.herokuapp.com/user/profile", {
          headers: { "x-access-token": token },
        })
        .then((res) => {
          updateProfile(res.data.profile);
          toggleNewsletter(res.data.newsletter);
        });

      //Fetch user Orders
      axios
        .get("https://abs-shop.herokuapp.com/orders", {
          headers: { "x-access-token": token },
        })
        .then((res) => {
          if (res.data.orders) {
            updateOrders(res.data.orders);
          }
        });
    } else {
      //User is not logged in
    }
  }, []);
  function showResponseMessage(type, message) {
    setResponseText(message);
    setResponseType(type);
    setShowResponse(360);
    setTimeout(() => {
      setShowResponse(0);
    }, 2500);
  }
  function submitProfile() {
    function validateEmail(email) {
      const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    }
    if (profile.name.length < 4 || !validateEmail(profile.email)) {
      showResponseMessage("error", "There are errors in your form!");
    } else {
      axios
        .post(
          "https://abs-shop.herokuapp.com/profile/update",
          { profile, newsletter },
          { headers: { "x-access-token": token } }
        )
        .then((res) => {
          if (res.data.updated) {
            showResponseMessage("success", "Your profile has been updated!");
          } else {
            showResponseMessage("error", "Could not update profile!");
          }
        });
    }
  }
  function resetPassword() {
    axios
      .get("https://abs-shop.herokuapp.com/password/reset", {
        headers: { "x-access-token": token },
      })
      .then((res) => {
        if (res.data.reset_init) {
          updateValidToken(res.data.token);
          const templateParams = {
            name: res.data.name,
            token: res.data.token,
          };
          emailjs
            .send(
              "service_q2bcxpq",
              "template_ivea1sh",
              templateParams,
              "user_hq1bM0N9gDNnr227wl7Ld"
            )
            .then(
              function (response) {
                showResponseMessage(
                  "success",
                  "Password reset link has been sent!"
                );
                setTimeout(() => {
                  toggleBgOverlay(true);
                  setResetToken("");
                  setNewPassword("");
                  setConfirmPassword("");
                }, 800);
              },
              function (error) {}
            );
        } else {
          showResponseMessage("error", "Please try again!");
        }
      });
  }

  function updatePassword() {
    if (parseInt(resetToken) === validToken) {
      // User provided correct token
      if (newPassword.length < 8) {
        showResponseMessage("error", "Please enter a secure password!");
      } else if (newPassword !== confirmPassword) {
        showResponseMessage("error", "Passwords do not match!");
      } else {
        //Token is valid and passwords match
        axios
          .post(
            "https://abs-shop.herokuapp.com/password/update",
            { password: newPassword },
            { headers: { "x-access-token": Cookies.get("ud") } }
          )
          .then((res) => {
            if (res.data.updated) {
              showResponseMessage("success", "Password has been changed!");
            }
          });
      }
    } else {
      showResponseMessage("error", "Wrong token, please check email!");
    }
  }

  function getFullDate(date) {
    var d = new Date(parseInt(date));
    var fullDate = d.getDate() < 10 ? `0${d.getDate()}` : d.getDate();
    var fullMonth = d.getMonth() < 10 ? `0${d.getMonth()}` : d.getMonth();
    var fullYear = d.getFullYear();
    return `Date: ${fullDate} - ${fullMonth} - ${fullYear}`;
  }
  return (
    <>
      <div
        onClick={() => toggleBgOverlay(false)}
        className={`${
          bgOverlay ? "show-profile-overlay" : "hide-profile-overlay"
        }`}
      ></div>
      <div
        className={`${
          bgOverlay ? "reset-password-container" : "hide-profile-overlay"
        }`}
      >
        <form
          autoComplete="off"
          ref={changePasswordForm}
          onSubmit={(e) => {
            e.preventDefault();
            alert("Submitted!");
          }}
        >
          <label htmlFor="reset-p-token">Reset Token</label>
          <input
            type="text"
            id="reset-p-token"
            name="reset-token-that-was-sent"
            onFocus={(e) => e.preventDefault()}
            className="form-input reset-password"
            autoComplete="off"
            value={resetToken}
            onChange={(e) => setResetToken(e.target.value)}
          />
          <label htmlFor="new-password">New Password</label>
          <input
            type="password"
            id="new-password"
            name="kasfjskdsjaio"
            className="form-input reset-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            type="password"
            name="amdfdjiojda09ji310"
            id="confirm-password"
            className="form-input reset-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <span className="submit-profile" onClick={() => updatePassword()}>
            Submit
          </span>
        </form>
      </div>
      <ResponseMessage
        type={responseType}
        message={responseText}
        showResponse={showResponse}
      />
      <SearchBox />
      <NavActions cart={cart} />
      {token === undefined && <Redirect to="/login" />}
      <div className="profile-container">
        <Container maxWidth="md">
          <div className="profile-nav">
            <div className="profile-nav-left">
              <span
                className={`profile-link edit-account ${
                  activePage === "account"
                    ? "active-profile-link"
                    : "inactive-profile-link"
                }`}
                onClick={() => setActivePage("account")}
              >
                Edit Account
              </span>

              <span
                className={`profile-link orders ${
                  activePage === "orders"
                    ? "active-profile-link"
                    : "inactive-profile-link"
                }`}
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
                  value={profile.name || ""}
                  spellCheck="false"
                  onChange={(e) =>
                    updateProfile({ ...profile, name: e.target.value })
                  }
                />
                <input
                  type="text"
                  className="form-input profile-form-input"
                  placeholder="Email"
                  value={profile.email || ""}
                  spellCheck="false"
                  onChange={(e) =>
                    updateProfile({ ...profile, email: e.target.value })
                  }
                />
              </div>
              <span className="change-password" onClick={() => resetPassword()}>
                Change password&nbsp; <i className="far fa-key"></i>
              </span>
              <div className="newsletter" style={{ zIndex: "0" }}>
                Subscribe to newsletter
                <Switch
                  value={newsletter}
                  checked={newsletter}
                  onChange={() => toggleNewsletter(!newsletter)}
                />
              </div>
              <span className="submit-profile" onClick={() => submitProfile()}>
                Submit
              </span>
            </div>
          )}
          {activePage === "orders" && (
            <div className="cart-products">
              <br />

              {orders.map((order) => {
                return (
                  <>
                    <div
                      className="cart-product"
                      key={order.product_id}
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        window.open(`/transaction/${order.transaction_id}`)
                      }
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <div className="cart-product-container">
                          <img
                            src={order.image}
                            alt=""
                            className="cart-product-image"
                          />
                        </div>
                        <div className="cart-product-details">
                          <span style={{ marginBottom: "10px" }}>
                            <span style={{ fontWeight: "600" }}>ID: </span>

                            <i>{order.transaction_id}</i>
                          </span>

                          <span className="cart-product-name">
                            {order.name.trim()}
                          </span>
                          <span className="cart-product-vendor">
                            {order.vendor}
                          </span>
                          <span className="cart-product-price">
                            ₦{order.amount}
                          </span>
                          <span>
                            <span style={{ fontWeight: "600" }}>Amount: </span>
                            {order.count}
                          </span>
                          <span>{getFullDate(order.date)}</span>
                        </div>
                      </div>
                    </div>
                    <br />
                    <br />
                    <br />
                  </>
                );
              })}
            </div>
          )}
        </Container>
      </div>
    </>
  );
}
