import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import StripeForm from "./StripeForm";
export default function StripeContainer() {
  const PUBLIC_KEY =
    "pk_test_51I9CFcLdHs2SO4REeFvHMS970sASzRs42gf3NupnPN6Gu84ZaIwEbSal6bRIC5DYQcxyIxxjL8EQ3mVQWp249bg400p4iHlz5T";
  const stripeTestPromise = loadStripe(PUBLIC_KEY);

  return (
    <Elements stripe={stripeTestPromise}>
      <StripeForm />
    </Elements>
  );
}
