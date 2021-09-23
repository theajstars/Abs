import axios from "axios";
import Cookies from "js-cookie";
import React, { useState, useEffect } from "react";
import GoogleLogin from "react-google-login";
import "../../Assets/CSS/Register.css";
import TopRightLink from "../TopRightLink";
import GoogleAuthButton from "./GoogleAuthButton";

export default function Register() {
  const token = Cookies.get("ud");
  if (token !== undefined) {
    window.location.href = "/";
  }
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [password2Error, setPassword2Error] = useState(false);

  const googleLoginSuccess = async (googleData) => {
    const res = await fetch("http://localhost:8080/api/v1/auth/google", {
      method: "POST",
      body: JSON.stringify({
        token: googleData.tokenId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    console.log(data);
  };

  const googleLoginFailure = async (googleData) => {};
  function registerUser() {
    if (name.length === 0) {
      setNameError(true);
    } else {
      setNameError(false);
    }
    if (password.length < 6 || password !== password2) {
      setPasswordError(true);
      setPassword2Error(true);
    } else {
      setPasswordError(false);
      setPassword2Error(false);
    }
    function validateEmail(email) {
      const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    }
    if (validateEmail(email)) {
      setEmailError(false);
    } else {
      setEmailError(true);
    }
    if (
      name.length > 0 &&
      password === password2 &&
      password2.length >= 6 &&
      validateEmail(email)
    ) {
      // If no errors, register user
      const user = {
        name: name,
        email: email,
        password: password,
      };
      axios.post("http://localhost:8080/user/register", user).then((res) => {
        console.log(res);
      });
    }
  }
  return (
    <>
      <TopRightLink tag="Login" route="/login" />
      <div className="register-container">
        <span className="form-head">Register</span>
        <form
          className="register-form"
          onSubmit={(e) => {
            e.preventDefault();
            registerUser();
          }}
        >
          <input
            type="text"
            className={`form-input register-form-input ${
              nameError ? "form-input-error" : ""
            }`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            spellCheck="false"
          />
          <input
            type="text"
            className={`form-input register-form-input ${
              emailError ? "form-input-error" : ""
            }`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            spellCheck="false"
          />
          <div className="flex-row">
            <input
              type="password"
              className={`form-input register-form-input ${
                passwordError ? "form-input-error" : ""
              }`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              spellCheck="false"
            />
            <input
              type="password"
              className={`form-input register-form-input ${
                password2Error ? "form-input-error" : ""
              }`}
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              placeholder="Confirm Password"
              spellCheck="false"
            />
          </div>
          <button type="submit" className="continue-btn">
            Continue
          </button>
          <div className="google-auth-container">
            <GoogleLogin
              clientId="968807946751-56tmu40s84lvcbsicd1i99j7ma4pnsbt.apps.googleusercontent.com"
              cookiePolicy={"single_host_origin"}
              onSuccess={googleLoginSuccess}
              onFailure={googleLoginFailure}
            />
          </div>
        </form>
      </div>
    </>
  );
}
