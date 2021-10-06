import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useElements, useStripe, CardElement } from "@stripe/react-stripe-js";
import axios from "axios";
import ResponseMessage from "./ResponseMessage";
import Cookies from "js-cookie";
export default function StripeForm() {
  const [cardholderError, setCardholderError] = useState(false);
  const [cardholder, setCardholder] = useState("");

  const [showResponse, setShowResponse] = useState(0);
  const [responseType, setResponseType] = useState(null);
  const [responseText, setResponseText] = useState("");

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
          const response = await axios.post(
            "http://localhost:8080/cart/pay",
            {
              amount: 990,
              id: id,
            },
            {
              headers: { "x-access-token": Cookies.get("ud") },
            }
          );
          console.log("Response: ", response);
          if (response.data.success) {
            console.log("Payment successful: ", true);
            showResponseMessage("success", "Payment successful!");
          } else {
            console.log("Payment successful: ", false);
            showResponseMessage("error", "Payment unsuccessful!");
          }
        } catch (error) {
          console.log("Some error: ", error);
          showResponseMessage("error", "Payment unsuccessful!");
        }
      } else {
        console.log(error.message);
        showResponseMessage("error", "Payment unsuccessful!");
      }
    }
  };
  const stripe = useStripe();
  const elements = useElements();
  return (
    <>
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
          </button>
        </form>
      </div>
    </>
  );
}
