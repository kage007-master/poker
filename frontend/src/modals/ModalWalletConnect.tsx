import React, { useEffect, useContext } from "react";
import Modal from "react-modal";
import {
  ExtensionLoginButton,
  LedgerLoginButton,
  WalletConnectLoginButton,
  WebWalletLoginButton,
} from "components/sdkComponents";

import { useGetIsLoggedIn } from "hooks/sdkDappHooks";
import { useDispatch, useSelector } from "react-redux";
import { setWalletConnect } from "store/modal.slice";
import { ToastrContext } from "providers/ToastrProvider";

import { ReactComponent as Icon1 } from "assets/svg/wallet-icon-1.svg";
import { ReactComponent as Icon2 } from "assets/svg/wallet-icon-2.svg";
import { ReactComponent as Icon3 } from "assets/svg/wallet-icon-3.svg";
import { ReactComponent as Icon4 } from "assets/svg/wallet-icon-4.svg";

import { RootState } from "store";

Modal.setAppElement("body");

const ModalWalletConnect = () => {
  const notify = useContext(ToastrContext);
  const isModalOpen = useSelector(
    (state: RootState) => state.modal.walletConnect
  );
  const dispatch = useDispatch();
  const isLogin = useGetIsLoggedIn();
  const commonProps = {
    nativeAuth: true, // optional
  };

  const Item = (text: string, Icon: any) => {
    return (
      <div className="w-full flex justify-between items-center">
        <p className="text-bright">{text}</p>
        <Icon className="w-8" />
      </div>
    );
  };

  useEffect(() => {
    if (isLogin) {
      dispatch(setWalletConnect(false));
      notify.success("Wallect Connected");
    }
    return () => {};
  }, [isLogin]);
  return (
    <div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => {
          dispatch(setWalletConnect(false));
        }}
        className="modal-fade modal-content"
        overlayClassName="bg-[rgba(14,18,36,.7)] fixed w-full h-full top-0 left-0 backdrop-blur-xl z-50"
      >
        <img src="/assets/ddog.png" className="mx-auto w-16 lg:w-20" />
        <h3 className="text-2xl lg:text-4xl text-bright mt-2">
          Connect your wallet
        </h3>
        <p className="text-xs lg:text-sm mt-2 mb-5">
          Please select a wallet to connect to our site
        </p>
        <div className="flex flex-col">
          <ExtensionLoginButton
            loginButtonText="MultiversX DeFi Wallet"
            className="!py-0 lg:!py-1 btn"
            {...commonProps}
          >
            {Item("MultiversX DeFi Wallet", Icon1)}
          </ExtensionLoginButton>
          <WebWalletLoginButton
            loginButtonText="MultiversX Web Wallet"
            className="!py-0 lg:!py-1 btn"
            {...commonProps}
          >
            {Item("MultiversX Web Wallet", Icon2)}
          </WebWalletLoginButton>
          <LedgerLoginButton
            loginButtonText="Ledger"
            className="!py-0 lg:!py-1 btn"
            {...commonProps}
          >
            {Item("Ledger", Icon3)}
          </LedgerLoginButton>
          <WalletConnectLoginButton
            loginButtonText="xPortal App"
            className="!py-0 lg:!py-1 btn"
            {...commonProps}
          >
            {Item("xPortal App", Icon4)}
          </WalletConnectLoginButton>
        </div>
      </Modal>
    </div>
  );
};

export default ModalWalletConnect;
