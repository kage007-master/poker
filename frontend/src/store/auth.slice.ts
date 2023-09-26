import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import env from "../config";

const { ApiNetworkProvider } = require("@multiversx/sdk-network-providers");
const apiNetworkProvider = new ApiNetworkProvider(
  "https://devnet-api.multiversx.com"
);

interface IState {
  token: string;
  user: {
    address: string;
    name: string;
    avatar: string;
    balance: Record<TCoin, number>;
  };
  nfts: [];
  users: [];
}

const initialState: IState = {
  token: "",
  user: {
    address: "",
    name: "",
    avatar: "",
    balance: {
      btc: 0,
      eth: 0,
      ltc: 0,
      egld: 0,
      kas: 0,
      erg: 0,
      xrp: 0,
      bnb: 0,
      usdc: 0,
      usdt: 0,
      matic: 0,
      ada: 0,
      sol: 0,
      ebone: 0,
    },
  },
  nfts: [],
  users: [],
};

export const getUsers = createAsyncThunk("getusers", async () => {
  const res = await axios.get(env.authURL + "/auth/users");
  return res.data;
});

export const getNfts = createAsyncThunk("getNfts", async (address: string) => {
  const data = await apiNetworkProvider.doGetGeneric(
    `accounts/${address}/nfts`
  );
  return data;
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
    },
    setLogout: (state) => {
      state.token = initialState.token;
      state.user = initialState.user;
    },
    setAuth: (state, action: PayloadAction<IState>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      axios.defaults.headers.common["x-auth-token"] = action.payload.token;
      // socketEvents.emitAuth({ auth: state });
    },
    setBalance: (state, action: PayloadAction<any>) => {
      let chain: TCoin = action.payload.chain;
      state.user.balance[chain] += action.payload.amount;
      state.user.balance[chain] = Number(state.user.balance[chain].toFixed(8));
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUsers.pending, (state, action) => {});
    builder.addCase(getUsers.fulfilled, (state, action: any) => {
      state.users = action.payload;
    });
    builder.addCase(getUsers.rejected, (state, action) => {});
    builder.addCase(getNfts.pending, (state, action) => {});
    builder.addCase(getNfts.fulfilled, (state, action: any) => {
      state.nfts = action.payload.map((item: any) => {
        return { name: item.identifier, url: item.url };
      });
      console.log(state.nfts);
    });
    builder.addCase(getNfts.rejected, (state, action) => {});
  },
});

export const { setAuth, setUser, setLogout, setBalance } = authSlice.actions;

export default authSlice.reducer;
