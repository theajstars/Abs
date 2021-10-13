import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useElements, useStripe, CardElement } from "@stripe/react-stripe-js";
import axios from "axios";
import ResponseMessage from "./ResponseMessage";
import Cookies from "js-cookie";
import { Redirect } from "react-router-dom";
import { CartConsumer } from "../Context/CartContext";
export default function StripeForm() {
  const [cardholderError, setCardholderError] = useState(false);
  const [cardholder, setCardholder] = useState("");
  const [totalPrice, updateTotalPrice] = useState(0);
  const [showResponse, setShowResponse] = useState(0);
  const [responseType, setResponseType] = useState(null);
  const [responseText, setResponseText] = useState("");

  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptAddress, setReceiptAddress] = useState("");

  const [showPrevention, setShowPrevention] = useState(false);

  useEffect(() => {
    if (showReceipt) {
      window.open(receiptAddress);
    }
  }, [showReceipt]);
  function showResponseMessage(type, message) {
    setResponseText(message);
    setResponseType(type);
    setShowResponse(360);
    setTimeout(() => {
      setShowResponse(0);
    }, 2500);
  }
  const handleSubmit = async (event) => {
    event.preventDefault();
    setShowPrevention(true);
    if (cardholder.length === 0) {
      setCardholderError(true);
    } else {
      setCardholderError(false);
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardElement),
      });

      if (!error) {
        console.log("Token generated!", paymentMethod);
        //   send token to backend
        try {
          const { id } = paymentMethod;
          const last4 = paymentMethod.card.last4;
          const cardType = paymentMethod.card.brand;
          const response = await axios.post(
            "http://localhost:8080/cart/pay",
            {
              amount: totalPrice,
              id: id,
              cardType: paymentMethod.card.brand,
              last4: paymentMethod.card.last4,
            },
            {
              headers: { "x-access-token": Cookies.get("ud") },
            }
          );

          if (response.data.success) {
            // Payment was successful

            console.log(response.data);
            console.log("Payment successful: ", true);
            const transactionID = response.data.id;
            setReceiptAddress(`/transaction/${transactionID}`);
            showResponseMessage("success", "Payment successful!");
            setTimeout(() => {
              //Purchase complete
              //Send user cart to order
              //Clear user cart
              //Show transaction receipt
              axios.post(
                "http://localhost:8080/purchase/complete",
                { transactionID, cardType, last4, totalPrice },
                { headers: { "x-access-token": Cookies.get("ud") } }
              );
              setShowReceipt(true);
              setTimeout(() => {
                setShowPrevention(false);
                window.location.href = "/";
              }, 400);
            }, 2500);
          } else {
            setTimeout(() => {
              setShowPrevention(false);
            }, 400);
            console.log("Payment successful: ", false);
            showResponseMessage("error", "Payment unsuccessful!");
          }
        } catch (error) {
          console.log("Some error: ", error);
          setTimeout(() => {
            setShowPrevention(false);
          }, 400);
          showResponseMessage("error", "Payment unsuccessful!");
        }
      } else {
        console.log(error.message);
        setTimeout(() => {
          setShowPrevention(false);
        }, 400);
        showResponseMessage("error", "Payment unsuccessful!");
      }
    }
  };
  const stripe = useStripe();
  const elements = useElements();
  return (
    <>
      <div className={`${showPrevention ? "prevent-action" : "none-display"}`}>
        <span className="loading-icon">
          Processing payment&nbsp;<i className="far fa-spinner fa-spin"></i>
        </span>
      </div>
      <ResponseMessage
        type={responseType}
        message={responseText}
        showResponse={showResponse}
      />
      <div>
        <form onSubmit={(e) => handleSubmit(e)} className="payment-form">
          <label htmlFor="card-element" className="card-label">
            Credit / Debit card
          </label>
          <div style={{ marginTop: "14px" }}></div>
          <input
            type="text"
            className={`cardholder ${
              cardholderError ? "cardholder-error" : ""
            }`}
            placeholder="Cardholder name"
            spellCheck="false"
            value={cardholder}
            onChange={(e) => setCardholder(e.target.value)}
          />
          <div style={{ marginTop: "12px" }}></div>

          <CardElement
            id="card-element"
            options={{
              style: {
                base: {
                  fontSize: "18px",
                  fontFamily: "'Jost', sans-serif",
                },
              },
            }}
          />

          <div style={{ marginTop: "14px" }}></div>
          <button type="submit" className="pay-btn">
            Pay
            <CartConsumer>
              {(cart) => {
                console.log("Cart: ", cart);
                updateTotalPrice(parseInt(cart));
              }}
            </CartConsumer>
          </button>
        </form>
      </div>
    </>
  );
}
