import Cookies from "js-cookie";
import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";
import "./Assets/CSS/All.css";
import Register from "./Components/Auth/Register";
import Products from "./Components/Products";

function App() {
  const token = Cookies.get("ud");
  useEffect(() => {}, []);
  if (token !== undefined) {
    return <Products />;
  } else {
    return <Redirect to="/register" />;
  }
}

export default App;
