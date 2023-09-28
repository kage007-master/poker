import { createSlice } from "@reduxjs/toolkit";

interface ModalState {
  profile: boolean;
  walletConnect: boolean;
  selchain: boolean;
  setting: boolean;
  menu: boolean;
  chain: TCoin;
  chat: boolean;
  screenshot: boolean;
  addchip: number;
  prize: boolean;
  prizedata: any;
  //poker
}

const initialState: ModalState = {
  profile: false,
  walletConnect: false,
  selchain: false,
  setting: false,
  menu: false,
  chain: "ebone",
  chat: false,
  screenshot: false,
  addchip: -1,
  prize: false,
  prizedata: {},
};

export const slice = createSlice({
  name: "modals",
  initialState,
  reducers: {
    setProfile: (state, action) => {
      state.profile = action.payload;
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
    setPrizeData: (state, action) => {
      state.prizedata = action.payload;
    },
  },
});

export const {
  setProfile,
  setWalletConnect,
  setMenu,
  setSelChain,
  setSetting,
  setChain,
  setScreenshot,
  setChat,
  setAddChip,
  setPrize,
  setPrizeData,
} = slice.actions;

export default slice.reducer;
