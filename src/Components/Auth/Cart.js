import { Container } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import "../../Assets/CSS/Cart.css";
import NavActions from "../NavActions";
import SearchBox from "../SearchBox";
import { fetchCart } from "./FetchUserData";
export default function Cart() {
  const token = Cookies.get("ud");
  const [cart, updateCart] = useState([]);
  const [checkout, updateCheckout] = useState([]);
  const [totalPrice, updateTotalPrice] = useState(0);
  const [shipping, updateShipping] = useState(0);

  const [deliveryAddress, setDeliveryAddress] = useState("");

  useEffect(() => {
    if (token !== undefined) {
      fetchCart().then((res) => {
        if (!res.auth && res.auth !== undefined) {
          Cookies.remove("ud");
        } else {
          updateCart(res.cart);
        }
      });
    }
  }, []);
  useEffect(() => {
    if (token !== undefined) {
      var total = 0;
      checkout.map((checkoutItem) => {
        var itemCost = checkoutItem.price * checkoutItem.product_count;
        total += itemCost;
      });
      const Ships = Math.round(total / 15);
      updateShipping(Ships);
      updateTotalPrice((total + shipping).toLocaleString());
    }
  }, [checkout]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/user/cart/checkout", {
        headers: { "x-access-token": token },
      })
      .then((res) => {
        updateCheckout(res.data.checkoutCart);
      });
  }, [cart]);

  function addProductToCart(productID, productName) {
    if (token !== undefined) {
      axios
        .post(
          "http://localhost:8080/product/cart/add",
          { product_id: productID, product_name: productName },
          { headers: { "x-access-token": Cookies.get("ud") } }
        )
        .then((res) => {
          fetchCart().then((res) => {
            updateCart(res.cart);
          });
        });
    } else {
      window.location.href = "/login";
    }
  }
  function removeProductFromCart(productID) {
    axios
      .post(
        "http://localhost:8080/product/checkout/remove",
        { product_id: productID.product_id },
        { headers: { "x-access-token": Cookies.get("ud") } }
      )
      .then((res) => {
        fetchCart().then((res) => {
          updateCart(res.cart);
        });
      });
  }

  return (
    <>
      <NavActions cart={cart} />
      <SearchBox />
      <Container maxWidth="lg">
        <div className="cart-container">
          <div className="cart-products">
            {checkout.map((checkoutItem) => {
              return (
                <div className="cart-product" key={checkoutItem.product_id}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src={checkoutItem.image}
                      alt=""
                      className="cart-product-image"
                    />
                  </div>
                  <div className="cart-product-details">
                    <span className="cart-product-name">
                      {checkoutItem.product_name}
                    </span>
                    <span className="cart-product-vendor">
                      {checkoutItem.vendor}
                    </span>
                    <span className="cart-product-price">
                      ₦
                      {(
                        checkoutItem.price * checkoutItem.product_count
                      ).toLocaleString()}
                      {/* {checkoutItem.product_count} */}
                    </span>
                  </div>
                  <div className="cart-product-actions">
                    <div className="top-cart-actions">
                      <span className="cart-action top-cart-action">
                        <i className="far fa-heart"></i>
                      </span>
                      <span className="cart-action top-cart-action">
                        <i className="far fa-trash-alt"></i>
                      </span>
                    </div>
                    <div className="bottom-cart-actions">
                      <button
                        className="cart-action modify-cart-action"
                        onClick={() =>
                          addProductToCart(
                            checkoutItem.product_id,
                            checkoutItem.productName
                          )
                        }
                      >
                        <i className="far fa-plus"></i>
                      </button>
                      <span className="cart-product-count">
                        {checkoutItem.product_count}
                      </span>
                      <button
                        onClick={() => removeProductFromCart(checkoutItem)}
                        disabled={
                          checkoutItem.product_count === 1 ? true : false
                        }
                        className="cart-action modify-cart-action"
                      >
                        <i className="far fa-minus"></i>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="cart-results">
            <input
              type="text"
              placeholder="Delivery address..."
              className="delivery-address-input"
              spellCheck="false"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
            />
            <span className="delivery-address">{deliveryAddress}</span>
            <div className="cart-row">
              <span className="cart-result-item">Shipping</span>
              <span className="cart-product-price">₦{shipping}</span>
            </div>
            <div className="cart-row">
              <span className="cart-result-item">Total</span>
              <span className="cart-product-price">₦{totalPrice}</span>
            </div>
            <button className="continue-btn checkout-order">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </Container>
    </>
  );
}
