import { useContext, useState } from "react";
import Modal from "react-modal";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSignUp, setWalletConnect } from "store/modal.slice";
import { useGetAccountInfo, useGetIsLoggedIn } from "hooks/sdkDappHooks";
import { logout } from "hooks/sdkDappHooks";
import { initAvatar } from "config/const";
import { ToastrContext } from "providers/ToastrProvider";
import axios from "axios";
import { setAuth } from "store/auth.slice";
import { AppDispatch, RootState } from "store";
import { Icon } from "@iconify/react";
import env from "../config";
Modal.setAppElement("body");

const ModalSignUp = () => {
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const [avatar, setAvatar] = useState(initAvatar);
  const [name, setName] = useState("");
  const notify = useContext(ToastrContext);
  const dispatch = useDispatch<AppDispatch>();
  const isLogin = useGetIsLoggedIn();
  const isOpen = useSelector((state: RootState) => state.modal.signUp);
  const account = useGetAccountInfo();
  useEffect(() => {
    if (name && error === "name") setError("");
    if (agree && error === "agree") setError("");
    return () => {};
  }, [name, agree]);

  const handleSignUp = async () => {
    if (!account.address) {
      setError("wallet");
      return notify.error("Please connect your wallet!");
    }
    if (!name) {
      setError("name");
      return notify.error("Username required!");
    }
    if (!agree) {
      setError("agree");
      return notify.error("Please agree to the Terms and Conditions!");
    }
    if (!avatar) return notify.error("Please select your Avatar!");
    try {
      const result = await axios.post(env.authURL + "/auth/register", {
        address: account.address,
        name,
        avatar,
      });
      if (result && result.status === 200) {
        dispatch(setAuth(result.data));
        notify.success("Sign Up Successfully!");
        notify.success("Login Successfully!");
        dispatch(setSignUp(false));
        setName("");
        setAgree(false);
        setError("");
        setAvatar(initAvatar);
      }
    } catch (errors: any) {
      console.log(errors);
      if (errors.response.status === 400)
        notify.error(errors.response.data.errors[0].msg);
      else notify.error("Server Error!");
    }
  };
  return (
    <Modal
      id="modalAuth"
      isOpen={isOpen}
      onRequestClose={() => {
        dispatch(setSignUp(false));
        if (isLogin) {
          logout();
          notify.warning("Wallet Disconnected");
        }
        setName("");
        setAgree(false);
        setError("");
        setAvatar(initAvatar);
      }}
      className="modal-fade modal-content text-sm md:text-base"
      overlayClassName="bg-[rgba(14,18,36,.7)] fixed w-full h-full top-0 left-0 backdrop-blur-xl z-50"
      contentLabel="Sign Up"
    >
      <img src="/assets/ddog.png" className="mx-auto w-10 lg:w-20"></img>
      <h1 className="text-2xl lg:text-4xl text-bright mt-2">Sign Up</h1>

      <div className="rounded-2xl mt-6 overflow-hidden">
        <div className="flex flex-col gap-2 lg:gap-4 items-center backdrop-blur-lg bg-gradient-to-br from-[#444B6B]/[.5] to-[#5A6B8C]/[.5] w-full h-max p-3 lg:p-4">
          {account.address ? (
            <div className="flex p-2.5 md:p-3 border-border rounded-md border w-full gap-2 items-center text-bright">
              <div className="m-overflow">{account.address}</div>
              <div
                onClick={() => {
                  logout();
                  notify.warning("Wallet Disconnected");
                }}
              >
                <Icon
                  icon="tabler:wallet-off"
                  className={
                    "text-lg w-5 h-5 flex-none cursor-pointer anim text-tomato"
                  }
                ></Icon>
              </div>
            </div>
          ) : (
            <button
              className={`w-full !py-4 btn ${
                error === "wallet" && "border border-tomato"
              }`}
              onClick={() => {
                dispatch(setWalletConnect(true));
              }}
            >
              Connect Wallet
            </button>
          )}
          <input
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setName(e.target.value);
            }}
            className={`p-4 rounded-md bg-transparent outline-none text-center text-bright border-border border w-full placeholder:text-center focus:border-indigo anim ${
              error === "name" && "border-tomato"
            }`}
            placeholder="Username"
          ></input>

          <div className="text-xs md:text-sm flex items-start gap-2 md:gap-3">
            <div
              className={`flex items-center cursor-pointer ${
                error === "agree" ? "text-tomato" : "text-indigo"
              }`}
              onClick={() => {
                setAgree(!agree);
              }}
            >
              {agree ? (
                <Icon icon={"mdi:shield-check"} className={"w-5 h-5"}></Icon>
              ) : (
                <Icon icon={"mdi:shield-outline"} className={"w-5 h-5"}></Icon>
              )}
            </div>
            <div>
              I agree to the{" "}
              <a
                className="text-indigo hover:text-indigoBright font-semibold"
                href="/"
              >
                Terms and conditions
              </a>{" "}
              & confirm I am at least 18 years old
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center bg-gradient-to-br from-[#505880] to-[#667AA0] h-full py-2 lg:py-4">
          <button onClick={handleSignUp}>
            <img className="w-[80%] mx-auto" src="assets/buttons/signup.png" />
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalSignUp;
