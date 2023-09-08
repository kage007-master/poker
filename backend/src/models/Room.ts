import { Ring } from "./Ring";
import { SNG } from "./SNG";

export class Room {
  id!: number;
  smallBlind!: number;
  bigBlind!: number;
  BuyIn!: number;
  maxBuyIn!: number;
  type: "Ring Game" | "Turbo SNG";
  tables: number[] = [];

  constructor(
    _id: number,
    _smallBlind: number,
    _bigBlind: number,
    type: "Ring Game" | "Turbo SNG",
    BuyIn: number = 0
  ) {
    this.id = _id;
    this.type = type;
    this.smallBlind = _smallBlind;
    this.bigBlind = _bigBlind;
    if (type === "Turbo SNG") this.BuyIn = BuyIn;
    else this.BuyIn = _bigBlind * 10;
    this.maxBuyIn = _bigBlind * 200;
  }

  infoForLobby(tables: { [key: string]: Ring | SNG }) {
    const { id, smallBlind, bigBlind, BuyIn, maxBuyIn, type } = this;
    let playerCnt = 0;
    for (let i = 0; i < this.tables.length; i++)
      playerCnt += tables[this.tables[i]].numberOfPlayers();
    return {
      id,
      smallBlind,
      bigBlind,
      BuyIn,
      maxBuyIn,
      type,
      tableCnts: this.tables.length,
      playerCnt,
      status: type === "Turbo SNG" ? tables[this.tables[0]].status : "RUNNING",
    };
  }
}
