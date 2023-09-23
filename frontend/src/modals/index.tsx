import React from "react";
import ModalSignUp from "./ModalSignUp";
import ModalWalletConnect from "./ModalWalletConnect";
import ModalAddChip from "./ModalAddChip";
import ModalPrize from "./ModalPrize";

const Modals = () => {
  return (
    <>
      <ModalSignUp />
      <ModalWalletConnect />
      <ModalAddChip />
      <ModalPrize />
    </>
  );
};

export default Modals;
