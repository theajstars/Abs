import React, { useState, useEffect } from "react";
import "../../Assets/CSS/Receipt.css";
import Logo from "../../Assets/IMG/Logo.jpg";
import Pdf from "react-to-pdf";
import { Redirect } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import ReportComplaint from "./ReportComplaint";
import { motion } from "framer-motion";
const pdfRef = React.createRef();

const animationContext = React.createContext();
const AnimationProvider = animationContext.Provider;
const AnimationConsumer = animationContext.Consumer;

export { AnimationConsumer, AnimationProvider };

export default function Receipt() {
  const token = Cookies.get("ud");
  const [receiptError, setReceiptError] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  // const [show]

  const [transaction, setTransaction] = useState([]);
  useEffect(() => {
    document.title = "Success!";
    const url = new URL(window.location.href);
    const path = url.pathname;
    if (token === undefined) {
      setReceiptError(true);
    }
    if (path.indexOf("transaction") === -1) {
      //address is false
      setReceiptError(true);
    } else {
      setReceiptError(false);
      const index = path.indexOf("transaction/");
      const transactionID = path.substring(index + 12, path.length + 1);
      //Fetch receipt details
      axios
        .post(
          "https://abs-shop.herokuapp.com/transaction",
          { transactionID },
          { headers: { "x-access-token": token } }
        )
        .then((res) => {
          const trans = res.data.transaction;
          if (trans.length === 0) {
            //Transaction does not exist
            setReceiptError(true);
          } else {
            setReceiptError(false);
            setTransaction(trans);
            setShowReceipt(true);
          }
        });
    }
  }, []);

  function report(display) {
    setShowReportDialog(display);
  }
  return (
    <>
      {showReportDialog && (
        <>
          <motion.div
            initial={{
              y: "-100vh",
            }}
            animate={{
              y: showReportDialog ? "0" : "-100vh",
            }}
            transition={{
              duration: 0.17,
            }}
            className="report-overlay"
            onClick={() => report(false)}
          ></motion.div>
          <AnimationProvider value={showReportDialog}>
            <ReportComplaint
              transaction_id={transaction[0].transaction_id}
              user_id={transaction[0].user_id}
            />
          </AnimationProvider>
        </>
      )}
      {showReceipt && (
        <div className="receipt-container">
          <div className="receipt" ref={pdfRef}>
            <img src={Logo} alt="" className="receipt-image" />
            <span className="purchaser-name">{transaction[0].name}</span>
            <div className="transaction-details">
              <div className="transaction-left">
                <span>ID</span>
                <span>Number</span>
                <span>Card Type</span>
                <span>Status</span>
              </div>
              <div className="transaction-right">
                <span>{transaction[0].transaction_id}</span>
                <span>xxxxxxxxxxx{transaction[0].card_number}</span>
                <span>{transaction[0].card_type}</span>
                <span className="transaction-status">Successful</span>
              </div>
            </div>
            <div className="transaction-content">
              {transaction.map((trans) => {
                return (
                  <span>
                    <b>{trans.count}x</b> {trans.product_name}
                  </span>
                );
              })}
            </div>
            <div className="transaction-total">
              <span>TOTAL</span>
              <span>₦{transaction[0].amount.toLocaleString()}</span>
            </div>
          </div>
          <div className="receipt-actions">
            <span onClick={() => report(true)}>
              Report&nbsp;
              <i
                className="far fa-exclamation-triangle"
                style={{ fontSize: "15px" }}
              ></i>
            </span>
            <Pdf targetRef={pdfRef} filename="receipt.pdf">
              {({ toPdf }) => (
                <span onClick={toPdf}>
                  Download&nbsp;{" "}
                  <i
                    className="far fa-cloud-download-alt"
                    style={{ fontSize: "15px" }}
                  ></i>
                </span>
              )}
            </Pdf>
          </div>
        </div>
      )}
      {receiptError && <Redirect to="/" />}
    </>
  );
}
