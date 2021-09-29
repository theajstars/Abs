import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { fetchCart } from "./FetchUserData";
import NavActions from "../NavActions";
import SearchBox from "../SearchBox";

export default function Profile() {
  const token = Cookies.get("ud");
  const [cart, updateCart] = useState([]);
  useEffect(() => {
    if (token !== undefined) {
      fetchCart().then((res) => {
        updateCart(res.cart);
        console.log(res.cart);
      });
    } else {
      //User is not logged in
    }
  }, []);
  return (
    <>
      <SearchBox />
      <NavActions cart={cart} />
    </>
  );
}
