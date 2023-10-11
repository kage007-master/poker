import { createSlice } from "@reduxjs/toolkit";
import { gameStates } from "../config/poker";

interface IState {
  gameState: string;
  tableInfo: any;
  robbyInfo: any[];
  prevDealerId: number;
  messages: any[];
  hHand: any;
}

const initialState: IState = {
  gameState: gameStates.preLoading,
  tableInfo: {},
  robbyInfo: [],
  prevDealerId: -1,
  messages: [],
  hHand: {},
};

export const Slice = createSlice({
  name: "poker",
  initialState: initialState,
  reducers: {
    setTableInfo: (state, action) => {
      const { data, address } = action.payload;
      state.prevDealerId = state.tableInfo.dealerId;
      state.tableInfo = data;
      const me = data.players.findIndex(
        (player: any) => address && player.address === address
      );
      state.tableInfo.isMember = me != -1;
      state.tableInfo.isTurn = me != -1 && data.players[me].status === "ACTIVE";
      if (state.tableInfo.isTurn)
        state.tableInfo.isCheck =
          state.tableInfo.currentBet === data.players[me].betAmount;

      if (me >= 1) {
        state.tableInfo.players.splice(
          6,
          0,
          ...state.tableInfo.players.slice(0, me)
        );
        state.tableInfo.players.splice(0, me);
        if (state.tableInfo.dealerId != -1)
          state.tableInfo.dealerId = (state.tableInfo.dealerId + 6 - me) % 6;
        if (state.tableInfo.SBId != -1)
          state.tableInfo.SBId = (state.tableInfo.SBId + 6 - me) % 6;
      }
    },
    setRobbyInfo: (state, action) => {
      state.robbyInfo = action.payload;
    },
    setHHand: (state, action) => {
      state.hHand = action.payload;
    },
    newMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  },
});

export const { setTableInfo, setRobbyInfo, setHHand, newMessage } =
  Slice.actions;

export default Slice.reducer;
