import axios from "axios";
import Cookies from "js-cookie";
import React, { useState, useEffect } from "react";
import GoogleLogin from "react-google-login";
import "../../Assets/CSS/Login.css";
import ResponseMessage from "../ResponseMessage";
import TopRightLink from "../TopRightLink";
export default function Login() {
  const token = Cookies.get("ud");
  if (token !== undefined) {
    window.location.href = "/";
  }
  useEffect(() => {
    document.title = "Login | Abs";
  }, []);
  const googleSecretKey = process.env.REACT_APP_google_secret;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const [showResponse, setShowResponse] = useState(0);
  const [responseType, setResponseType] = useState(null);
  const [responseText, setResponseText] = useState("");
  const googleLoginSuccess = async (googleData) => {
    const res = await fetch(
      "https://abs-shop-api.onrender.com/api/v1/auth/google",
      {
        method: "POST",
        body: JSON.stringify({
          token: googleData.tokenId,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();
    if (data.token) {
      Cookies.set("ud", data.token);
      window.location.href = "/";
    }
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
      axios
        .post("https://abs-shop-api.onrender.com/user/login", user)
        .then((res) => {
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
              onFailure={googleLoginSuccess}
            />
          </div>
        </form>
      </div>
    </>
  );
}
