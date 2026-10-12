import React, { useState } from "react";
import FirstStep from "./FirstStep";
import ForgetPass from "./ForgetPass";
import LoginPass from "./LoginPass";
import LoginOtp from "./LoginOtp";

export default function Auth() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pageType, setPageType] = useState("first");
  return (
    <>
      {pageType == "first" ? (
        <FirstStep phoneNumber={phoneNumber} changePage={setPageType} changePhone={setPhoneNumber} />
      ) : pageType == "forget" ? (
        <ForgetPass changePage={setPageType} />
      ) : pageType == "password" ? (
        <LoginPass phoneNumber={phoneNumber} changePage={setPageType} />
      ) : (
        <LoginOtp phoneNumber={phoneNumber} changePage={setPageType} />
      )}
    </>
  );
}
