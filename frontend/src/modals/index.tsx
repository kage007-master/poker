import React from "react";
import ModalSignUp from "./ModalSignUp";
import ModalWalletConnect from "./ModalWalletConnect";
import ModalAddChip from "./ModalAddChip";

const Modals = () => {
  return (
    <>
      <ModalSignUp></ModalSignUp>
      <ModalWalletConnect></ModalWalletConnect>
      <ModalAddChip />
    </>
  );
};

export default Modals;
