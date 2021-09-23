import React, { useState } from "react";
import GoogleLogin from "react-google-login";
import "../../Assets/CSS/Login.css";
import TopRightLink from "../TopRightLink";
import GoogleAuthButton from "./GoogleAuthButton";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
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
  }
  return (
    <>
      <TopRightLink route="/register" tag="Register" />
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
