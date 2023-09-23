import { createSlice } from "@reduxjs/toolkit";
import { act } from "react-dom/test-utils";

interface ModalState {
  signUp: boolean;
  walletConnect: boolean;
  selchain: boolean;
  setting: boolean;
  menu: boolean;
  chain: TCoin;
  chat: boolean;
  screenshot: boolean;
  addchip: number;
  prize: boolean;
  //poker
}

const initialState: ModalState = {
  signUp: false,
  walletConnect: false,
  selchain: false,
  setting: false,
  menu: false,
  chain: "ebone",
  chat: false,
  screenshot: false,
  addchip: -1,
  prize: false,
};

export const slice = createSlice({
  name: "modals",
  initialState,
  reducers: {
    setSignUp: (state, action) => {
      state.signUp = action.payload;
    },
    setWalletConnect: (state, action) => {
      state.walletConnect = action.payload;
    },
    setSelChain: (state, action) => {
      state.selchain = action.payload;
    },
    setSetting: (state, action) => {
      state.setting = action.payload;
    },
    setMenu: (state, action) => {
      state.menu = action.payload;
    },
    setChain: (state, action) => {
      state.chain = action.payload;
    },
    setScreenshot: (state, action) => {
      state.screenshot = action.payload;
    },
    setChat: (state, action) => {
      state.chat = action.payload;
    },
    setAddChip: (state, action) => {
      state.addchip = action.payload;
    },
    setPrize: (state, action) => {
      state.prize = action.payload;
    },
  },
});

export const {
  setSignUp,
  setWalletConnect,
  setMenu,
  setSelChain,
  setSetting,
  setChain,
  setScreenshot,
  setChat,
  setAddChip,
  setPrize,
} = slice.actions;

export default slice.reducer;
