import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import { AnimationConsumer } from "./Receipt";

import "../../Assets/CSS/Report.css";
import axios from "axios";
import Cookies from "js-cookie";
import ResponseMessage from "../ResponseMessage";

export default function ReportComplaint({ transaction_id, user_id }) {
  const token = Cookies.get("ud");
  const complaints = [
    "Failed purchase",
    "Receipt not downloading",
    "Poor service",
    "Other complaint",
  ];
  const [complaintType, setComplaintType] = useState(complaints[0]);
  const [complaintMessage, setComplaintMessage] = useState("");

  const [showResponse, setShowResponse] = useState(0);
  const [responseType, setResponseType] = useState(null);
  const [responseText, setResponseText] = useState("");

  const changeComplaintOption = (e) => {
    setComplaintType(e.target.value);
  };
  function showResponseMessage(type, message) {
    setResponseText(message);
    setResponseType(type);
    setShowResponse(360);
    setTimeout(() => {
      setShowResponse(0);
    }, 2500);
  }
  function submitComplaint() {
    console.clear();
    if (complaintMessage.length === 0) {
      showResponseMessage("error", "Please enter your complaint!");
    } else {
      const complaintOptions = {
        complaintType,
        complaintMessage,
        transaction_id: transaction_id,
        user_id: user_id,
      };
      axios
        .post("http://localhost:8080/report", complaintOptions, {
          headers: { "x-access-token": token },
        })
        .then((res) => {
          console.log(res.data);
          if (res.data.inserted) {
            showResponseMessage("success", "Your complaint was submitted!");
          } else {
            showResponseMessage("error", "An error occurred!");
          }
        })
        .catch((err) => {
          showResponseMessage("error", "An error occurred!");
        });
    }
  }
  return (
    <>
      <ResponseMessage
        type={responseType}
        message={responseText}
        showResponse={showResponse}
      />
      <AnimationConsumer>
        {(animationProp) => {
          return (
            <>
              <motion.div
                className="report-container"
                initial={{
                  scale: 0,
                }}
                animate={{
                  scale: 1,
                }}
                transition={{
                  duration: 0.5,
                }}
              >
                <div>
                  <FormControl
                    variant="standard"
                    sx={{ m: 1, minWidth: "100%" }}
                    style={{ padding: "0px", margin: "0px" }}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      Complaint Type
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={complaints[0]}
                      onChange={changeComplaintOption}
                      label="Complaint Type"
                    >
                      {complaints.map((com) => {
                        return <MenuItem value={com}>{com}</MenuItem>;
                      })}
                    </Select>
                  </FormControl>
                  <br />
                  <br />
                  <br />
                  <TextField
                    id="outlined-multiline-static"
                    label="Complaint details"
                    multiline
                    rows={4}
                    fullWidth
                    spellCheck="false"
                    value={complaintMessage}
                    onChange={(e) => setComplaintMessage(e.target.value)}
                    style={{ padding: "0px", margin: "0px" }}
                  />
                </div>
                <br />
                <span
                  className="submit-profile"
                  onClick={() => submitComplaint()}
                >
                  Submit
                </span>
              </motion.div>
            </>
          );
        }}
      </AnimationConsumer>
    </>
  );
}
