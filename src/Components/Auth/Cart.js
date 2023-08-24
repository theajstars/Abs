import { Container } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useRef, useState } from "react";
import "../../Assets/CSS/Cart.css";
import { CartProvider } from "../../Context/CartContext";
import NavActions from "../NavActions";
import { toggleProductInSaved } from "../Product";
import SearchBox from "../SearchBox";
import StripeContainer from "../StripeContainer";
import { fetchCart } from "./FetchUserData";
export default function Cart() {
  const token = Cookies.get("ud");
  const [cart, updateCart] = useState([]);
  const [checkout, updateCheckout] = useState([]);
  const [totalPrice, updateTotalPrice] = useState(0);
  const [shipping, updateShipping] = useState(0);

  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [showPaymentModal, togglePaymentModal] = useState(false);

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
    document.title = "Cart";
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
      updateTotalPrice(total + shipping);
    }
  }, [checkout]);

  useEffect(() => {
    if (token !== undefined) {
      //User is logged in
      axios
        .get("https://abs-shop-api.onrender.com/user/cart/checkout", {
          headers: { "x-access-token": token },
        })
        .then((res) => {
          console.log(res);
          updateCheckout(res.data.checkoutCart);
        });
    }
  }, [cart]);

  function addProductToCart(productID, productName) {
    if (token !== undefined) {
      axios
        .post(
          "https://abs-shop-api.onrender.com/product/cart/add",
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
    if (token !== undefined) {
      axios
        .post(
          "https://abs-shop-api.onrender.com/product/checkout/remove",
          { product_id: productID.product_id },
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
  function showModal() {
    if (deliveryAddress.length > 0) {
      togglePaymentModal(true);
    }
  }

  function deleteAllProducts(product_ID) {
    axios
      .post(
        "https://abs-shop-api.onrender.com/cart/product/remove_all",
        { product_ID },
        { headers: { "x-access-token": token } }
      )
      .then((res) => {
        if (res.data.removed) {
          //Product has been removed from cart
          axios
            .get("https://abs-shop-api.onrender.com/user/cart/checkout", {
              headers: { "x-access-token": token },
            })
            .then((res) => {
              updateCheckout(res.data.checkoutCart);
            });
        }
      });
  }
  return (
    <>
      <CartProvider value={totalPrice.toString()}>
        <NavActions cart={cart} />
        <SearchBox />
        <div
          className={`bg-overlay`}
          style={{ display: `${showPaymentModal ? "" : "none"}` }}
          onClick={() => togglePaymentModal(false)}
        ></div>
        <div
          className="stripe-container"
          style={{ display: `${showPaymentModal ? "block" : "none"}` }}
        >
          <StripeContainer />
        </div>
        <Container maxWidth="lg">
          <div className="cart-container">
            <div className="cart-products">
              {checkout.length === 0 && (
                <>
                  <div className="empty-crate">
                    <span className="empty-icon">
                      <i className="far fa-exclamation-circle"></i>
                    </span>
                    <p className="empty-text">
                      There are no items in your cart!
                    </p>
                  </div>
                </>
              )}
              {checkout.map((checkoutItem) => {
                return (
                  <div className="cart-product" key={checkoutItem.product_id}>
                    <div className="cart-product-container">
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
                    </div>
                    <div className="cart-product-actions">
                      <div className="top-cart-actions">
                        <span
                          className="cart-action top-cart-action"
                          onClick={() =>
                            deleteAllProducts(checkoutItem.product_id)
                          }
                        >
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

            <div
              className="cart-results"
              style={{ display: `${checkout.length === 0 ? "none" : "flex"}` }}
            >
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
                <span className="cart-product-price">
                  ₦{shipping.toLocaleString()}
                </span>
              </div>
              <div className="cart-row">
                <span className="cart-result-item">Total</span>
                <span className="cart-product-price">
                  ₦{totalPrice.toLocaleString()}
                </span>
              </div>
              <button
                className="continue-btn checkout-order"
                onClick={() => showModal()}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </Container>
      </CartProvider>
    </>
  );
}
