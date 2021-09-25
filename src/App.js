import Cookies from "js-cookie";
import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";
import "./Assets/CSS/All.css";
import Home from "./Components/Home";

function App() {
  const token = Cookies.get("ud");
  useEffect(() => {}, []);
  if (token !== undefined) {
    return (
      <>
        <Home />
      </>
    );
  } else {
    return <Redirect to="/register" />;
  }
}

export default App;
