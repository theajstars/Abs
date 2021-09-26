import React from "react";
import ReactDOM from "react-dom";
import { Route, BrowserRouter as Router } from "react-router-dom";

import App from "./App";
import Login from "./Components/Auth/Login";
import Register from "./Components/Auth/Register";
import NavActions from "./Components/NavActions";
import Product from "./Components/Product";
import Products from "./Components/Products";
import Sidebar from "./Components/Sidebar";

ReactDOM.render(
  <Router>
    <Sidebar />
    <NavActions />
    <Route exact path="/" component={App} />
    <Route exact path="/register" component={Register} />
    <Route exact path="/login" component={Login} />
    <Route path="/products" component={Products} />
    <Route path="/product/" component={Product} />
  </Router>,
  document.getElementById("root")
);
