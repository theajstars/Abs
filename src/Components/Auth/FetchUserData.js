import axios from "axios";
import Cookies from "js-cookie";
import React, { useState } from "react";

const token = Cookies.get("ud");
export async function fetchCart() {
  if (token !== undefined) {
    const cart = await axios.get(
      "https://abs-shop-api.onrender.com/user/cart",
      {
        headers: { "x-access-token": token },
      }
    );
    return await cart.data;
  } else {
    const cart = [];
    return cart;
  }
}
export default function FetchUserData() {
  return <div></div>;
}
