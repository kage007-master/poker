import { useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setWalletConnect } from "../store/modal.slice";
import {
  useGetAccountInfo,
  useGetIsLoggedIn,
  logout,
} from "../hooks/sdkDappHooks";
import axios from "axios";
import { setAuth } from "../store/auth.slice";
import { ToastrContext } from "../providers/ToastrProvider";
import { AppDispatch, RootState } from "../store";
import env from "../config";

const LogIn = () => {
  const signUp = useSelector((state: RootState) => state.modal.signUp);
  const account = useGetAccountInfo();
  const isLogin = useGetIsLoggedIn();
  const dispatch = useDispatch<AppDispatch>();
  const notify = useContext(ToastrContext);

  const handleLogin = async () => {
    if (!account.address) return;
    try {
      const result = await axios.post(env.authURL + "/auth/login", {
        address: account.address,
      });
      if (result && result.status === 200) {
        dispatch(setAuth(result.data));
        if (result.data.isNew) notify.success("Welcome to DDog Club!");
        else notify.success("Login Successfully!");
      }
    } catch (errors: any) {
      console.log(errors);
      if (errors.response.status === 400)
        notify.error(errors.response.data.errors[0].msg);
      else notify.error("Server Error!");
      logout();
      notify.warning("Wallert Disconnected!");
    }
  };

  useEffect(() => {
    if (!isLogin) return;
    if (signUp) return;
    dispatch(setWalletConnect(false));
    handleLogin();
    return () => {};
  }, [isLogin]);

  return <></>;
};

export default LogIn;
