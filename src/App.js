import Cookies from "js-cookie";
import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";
import "./Assets/CSS/All.css";
import Home from "./Components/Home";
import Sidebar from "./Components/Sidebar";

function App() {
  const token = Cookies.get("ud");
  useEffect(() => {}, []);
  if (token !== undefined) {
    return (
      <>
        {/* <Sidebar /> */}
        <Home />
      </>
    );
  } else {
    return <Redirect to="/register" />;
  }
}

export default App;
