import axios from "axios";
import Cookies from "js-cookie";
import React, { useState } from "react";
import GoogleLogin from "react-google-login";
import "../../Assets/CSS/Login.css";
import ResponseMessage from "../ResponseMessage";
import TopRightLink from "../TopRightLink";
import GoogleAuthButton from "./GoogleAuthButton";
export default function Login() {
  const googleSecretKey = process.env.REACT_APP_google_secret;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const [showResponse, setShowResponse] = useState(0);
  const [responseType, setResponseType] = useState(null);
  const [responseText, setResponseText] = useState("");
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
  function googleLoginFailure() {}

  function showResponseMessage(type, message) {
    setResponseText(message);
    setResponseType(type);
    setShowResponse(360);
    setTimeout(() => {
      setShowResponse(0);
    }, 2500);
  }
  function loginUser() {
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

    if (password.length === 0) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }

    if (password.length > 0 && validateEmail(email)) {
      const user = {
        email: email,
        password: password,
      };
      axios.post("http://localhost:8080/user/login", user).then((res) => {
        console.log(res.data);
        const auth = res.data.auth;
        const token = res.data.token;
        if (auth) {
          Cookies.set("ud", token);
          showResponseMessage("success", "Login successful!");
        } else {
          showResponseMessage("error", "Invalid username or password!");
        }
      });
    }
  }
  return (
    <>
      <TopRightLink route="/register" tag="Register" />
      <ResponseMessage
        type={responseType}
        message={responseText}
        showResponse={showResponse}
      />
      <div className="login-container">
        <div className="form-head">Login</div>
        <form
          className="login-form"
          onSubmit={(e) => {
            e.preventDefault();
            loginUser();
          }}
        >
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
          <button type="submit" className="continue-btn">
            Continue
          </button>
          <div className="google-auth-container">
            <GoogleLogin
              clientId={googleSecretKey}
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
