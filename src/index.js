import React from "react";
import ReactDOM from "react-dom";
import { Route, BrowserRouter as Router } from "react-router-dom";

import App from "./App";
import Cart from "./Components/Auth/Cart";
import Login from "./Components/Auth/Login";
import Profile from "./Components/Auth/Profile";
import Receipt from "./Components/Auth/Receipt";
import Register from "./Components/Auth/Register";
import Saved from "./Components/Auth/Saved";
import Product from "./Components/Product";
import Products from "./Components/Products";
import Sidebar from "./Components/Sidebar";
import StripeContainer from "./Components/StripeContainer";

ReactDOM.render(
  <>
    <Router>
      <Sidebar />
      <Route path="/transaction" component={Receipt} />
      {/* <NavActions /> */}
      <Route exact path="/" component={App} />
      <Route exact path="/register" component={Register} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/cart" component={Cart} />
      <Route exact path="/profile" component={Profile} />
      <Route exact path="/saved" component={Saved} />
      <Route path="/products" component={Products} />
      <Route path="/product/" component={Product} />
      <Route exact path="/stripe" component={StripeContainer} />
    </Router>
  </>,
  document.getElementById("root")
);
