import { motion } from "framer-motion";
import React, { useRef, useEffect } from "react";
import "../Assets/CSS/ResponseMessage.css";
export default function ResponseMessage({ type, message, showResponse }) {
  const iconRef = useRef();
  // const [animationMovement, setAnimationMovement] = useState(showResponse);
  useEffect(() => {
    if (type === "error") {
      iconRef.current.innerHTML = '<i class="far fa-exclamation-circle"></i>';
    } else {
      iconRef.current.innerHTML = '<i class="far fa-check-circle"></i>';
    }
    // if (showResponse) {
    //   setAnimationMovement(360);
    // } else {
    //   setAnimationMovement(0);
    // }
  }, []);
  return (
    <>
      <motion.div
        animate={{ x: showResponse }}
        transition={{ ease: "easeOut", duration: 1 }}
        className={`response-message ${
          type === "error" ? "response-error" : "response-success"
        }`}
      >
        <span className="response-icon" ref={iconRef}></span>
        <p className="response-text">{message}</p>
      </motion.div>
    </>
  );
}
