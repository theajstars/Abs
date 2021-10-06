import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";
import "./Assets/CSS/All.css";
import Home from "./Components/Home";

function App() {
  const token = Cookies.get("ud");
  useEffect(() => {}, []);
  useEffect(() => {
    if (token !== undefined) {
      axios
        .get("http://localhost:8080/isUserAuth", {
          headers: { "x-access-token": token },
        })
        .then((res) => {
          console.log(res);
          if (!res.data.auth) {
            Cookies.remove("ud");
          }
        });
    }
  }, []);
  return (
    <>
      <Home />
    </>
  );
  // } else {
  //   return <Redirect to="/register" />;
  // }
}

export default App;
