import { Socket, Server } from "socket.io";
import { IPlayer } from "../types/poker";
const Hand = require("pokersolver").Hand;

import {
  shuffledCards,
  nextActivePlayerId,
  isValid,
  isActive,
  COUNT_DOWN,
  ANIMATION_DELAY_TIME,
  numberOfPlayers,
  playersInfo,
  nullPlayer,
  numberOfActivePlayers,
  numbersToCards,
} from "../utils/poker";
import authController from "../controllers/auth.controller";

export enum Round {
  PREFLOP,
  FLOP,
  TURN,
  RIVER,
  OVER,
}

export class Ring {
  server!: Server;

  id!: number;
  roomid!: number;
  name!: string;
  type!: "Ring Game";
  smallBlind!: number;
  bigBlind!: number;
  players: IPlayer[] = [];
  BuyIn!: number;

  round!: Round;
  pot: number = 0;
  currentBet = 0;
  minRaise = 0;
  dealerId: number = -1;
  SBId: number = -1;
  currentPlayerId: number = -1;
  cards: number[] = [];
  communityCards: number[][] = [[], [], [], [], []];
  countdown = 0;
  timestamp!: number;
  status: string = "WAIT";
  isLockup: boolean = false;
  leaveList: number[] = [];
  plusBet: number = 0; // for last action (currentBet - player.betAmount)
  prizes: number[] = [];
  lastNewPlayerId: number = -1;
  disconnectList: Socket[] = [];

  constructor(
    server: Server,
    id: number,
    name: string,
    type: "Ring Game",
    smallBlind: number,
    bigBlind: number,
    roomid: number
  ) {
    this.server = server;
    this.id = id;
    this.roomid = roomid;
    this.name = name;
    this.type = type;
    this.smallBlind = smallBlind;
    this.bigBlind = bigBlind;
    this.BuyIn = this.bigBlind * 10;
    this.round = Round.OVER;
    for (let i = 0; i < 6; i++) this.players[i] = nullPlayer();
    this.test();
  }

  init() {
    this.currentPlayerId = -1;
    this.SBId = -1;
    this.pot = 0;
    this.isLockup = false;
    this.minRaise = this.bigBlind * 2;
    for (let i = 0; i < 6; i++) {
      if (isValid(this.players[i])) {
        this.players[i].cards = [];
        this.players[i].betAmount = 0;
        this.players[i].totalBet = 0;
        this.players[i].status = "NONE";
      }
    }
    this.communityCards = [[], [], [], [], []];
  }

  async takeSeat(player: IPlayer, position: number) {
    player.status = "JOIN";
    this.players[position] = player;
    this.lastNewPlayerId = position;
    this.broadcast();
    if (this.status == "WAIT") await this.newHand();
  }

  leaveSeat(pos: number) {
    let player = this.players[pos];
    if (isValid(player)) {
      player.leave = true;
      this.broadcast();
    }
  }

  wasDisconnected(socket: Socket) {
    for (let i = 0; i < this.disconnectList.length; i++) {
      if (this.disconnectList[i].id == socket.id) {
        this.disconnectList.splice(i, 1);
        socket.join("room-" + this.id);
        return;
      }
    }
  }

  connect(pos: number, status: boolean) {
    let player = this.players[pos];
    if (isValid(player)) {
      player.disconnect = status;
      this.broadcast();
    }
  }

  async sitOut(i: number) {
    const user = await authController.getUser(this.players[i].address);
    if (user) {
      user.balance.ebone += this.players[i].stack;
      authController.updateUser(user);
    }

    this.players[i].socket?.leave("room-" + this.id);
    this.players[i] = nullPlayer();
  }

  async newHand() {
    console.log("new hand");
    this.status = "WAIT";
    this.init();
    for (let i = 0; i < 6; i++)
      if (
        this.players[i].address &&
        (!this.players[i].stack ||
          this.players[i].leave ||
          this.players[i].disconnect)
      )
        await this.sitOut(i);

    if (numberOfPlayers(this.players) < 2) {
      this.dealerId = -1;
      this.broadcast();
      return;
    }
    console.log("new hand begins!");
    this.cards = shuffledCards();
    if (this.lastNewPlayerId != -1) this.dealerId = this.lastNewPlayerId;
    this.dealerId = nextActivePlayerId(this.dealerId, this.players);
    //    this.SBId = nextActivePlayerId(this.dealerId, this.players);
    this.lastNewPlayerId = -1;
    this.preflop();
  }

  checkRoundResult() {
    let cnt = 0;
    console.log("************************");
    console.log(this.currentBet);
    console.log(this.players.map((player) => player.betAmount));
    console.log(this.players.map((player) => player.status));

    for (let i = 0; i < 6; i++) {
      if (isActive(this.players[i])) {
        if (
          this.players[i].betAmount != this.currentBet &&
          this.players[i].status != "ALLIN"
        )
          return "RUNNING";
        if (this.players[i].status == "NONE") return "RUNNING";
        if (this.players[i].status != "ALLIN") cnt++;
      }
    }
    console.log("cnt", cnt);
    if (cnt < 2) return "LOCKUP";
    return "ENDED";
  }

  moveTurn() {
    this.countdown = COUNT_DOWN;
    this.broadcast();
    setTimeout(() => {
      if (!numberOfActivePlayers(this.players))
        console.log("what a bug on", this.id);

      if (numberOfActivePlayers(this.players) <= 1) {
        // win the pot uncontested
        this.final();
        return;
      }
      let roundResult = this.checkRoundResult();
      console.log("--", roundResult);
      if (roundResult != "RUNNING") {
        this.round = (this.round + 1) % 5;
        if (roundResult == "ENDED") {
          for (let i = 0; i < 6; i++) {
            if (isActive(this.players[i])) {
              if (this.players[i].status != "ALLIN") {
                this.players[i].status = "NONE";
              }
            }
          }
        }
        switch (this.round) {
          case Round.FLOP:
            this.flop();
            break;
          case Round.TURN:
            this.turn();
            break;
          case Round.RIVER:
            this.river();
            break;
          case Round.OVER:
            this.final();
            break;
        }
        if (roundResult == "LOCKUP" && this.round < Round.OVER) {
          console.log("locked up on", this.id);
          this.isLockup = true;
          setTimeout(() => {
            this.updatePlayers();
            this.moveTurn();
          }, ANIMATION_DELAY_TIME);
        } else if (
          this.round < Round.OVER &&
          numberOfActivePlayers(this.players)
        ) {
          setTimeout(() => {
            this.updatePlayers();
            this.status = "IDLE";
            this.countdown = COUNT_DOWN;
            this.tick();
            this.currentPlayerId = this.dealerId;
            do {
              this.currentPlayerId = nextActivePlayerId(
                this.currentPlayerId,
                this.players
              );
            } while (this.players[this.currentPlayerId].status == "ALLIN");
            this.broadcast();
          }, ANIMATION_DELAY_TIME);
        }
      } else {
        do {
          this.currentPlayerId = nextActivePlayerId(
            this.currentPlayerId,
            this.players
          );
        } while (this.players[this.currentPlayerId].status == "ALLIN");
        if (!this.status.includes("SMALL_BLIND")) {
          if (this.status != "STRADDLE") {
            this.status = "IDLE";
            this.countdown = COUNT_DOWN + 1;
            this.tick();
          } else {
            this.status = "IDLE";
            this.countdown = 4;
            this.tick1();
            console.log("---WAITING FOR STRADDLE----");
          }
        }
      }
    }, ANIMATION_DELAY_TIME);
  }

  // pot and bet update of players
  updatePlayers() {
    this.minRaise = this.bigBlind;
    this.currentBet = 0;
    for (let i = 0; i < 6; i++) {
      this.pot += this.players[i].betAmount;
      this.players[i].totalBet += this.players[i].betAmount;
      this.players[i].betAmount = 0;
    }
  }

  preflop() {
    this.round = Round.PREFLOP;
    this.countdown = COUNT_DOWN;
    this.status = "PREFLOP";
    this.broadcast();
    // small blind
    setTimeout(() => {
      this.currentPlayerId = nextActivePlayerId(this.dealerId, this.players);
      this.smallBlindFn();
      // big blind
      setTimeout(() => {
        this.bigBlindFn();
      }, ANIMATION_DELAY_TIME);
    }, ANIMATION_DELAY_TIME);
  }

  flop() {
    this.status = "FLOP";
    this.communityCards[0].push(this.cards.pop() ?? 0);
    this.communityCards[1].push(this.cards.pop() ?? 0);
    this.communityCards[2].push(this.cards.pop() ?? 0);
    this.broadcast();
  }

  turn() {
    this.status = "TURN";
    this.communityCards[3].push(this.cards.pop() ?? 0);
    this.broadcast();
  }

  river() {
    this.status = "RIVER";
    this.communityCards[4].push(this.cards.pop() ?? 0);
    this.broadcast();
  }

  final() {
    this.status = "FINAL";
    this.broadcast();
    setTimeout(() => {
      this.over();
    }, ANIMATION_DELAY_TIME * 3);
  }

  over() {
    let players = this.players;
    let earnings = [0, 0, 0, 0, 0, 0];
    this.updatePlayers();
    for (let i = 0; i < 6; i++) console.log(players[i].totalBet);
    let oldStatus = players.map((player) => player.status);
    let community1: number[] = [],
      community2: number[] = [];
    for (let i = 0; i < 5; i++) {
      if (this.communityCards[i].length) {
        community1.push(this.communityCards[i][0]);
        community2.push(
          this.communityCards[i][this.communityCards[i].length - 1]
        );
      }
    }
    while (numberOfActivePlayers(players)) {
      let hands: any[] = [],
        arr: any[] = [];
      for (let i = 0; i < 6; i++) {
        if (isActive(players[i])) {
          hands[i] = Hand.solve(
            numbersToCards(players[i].cards.concat(community1))
          );
          arr.push(hands[i]);
        }
      }
      let winners = Hand.winners(arr);
      for (let winner of winners) console.log(winner.cards, winner.descr);
      console.log("--------");
      let order: number[] = [];
      for (let i = 0; i < 6; i++) {
        if (winners.includes(hands[i])) order.push(i);
      }
      console.log(order);
      order.sort((a, b) => players[b].totalBet - players[a].totalBet);
      while (order.length) {
        let cur = order[order.length - 1];
        let prize = 0,
          curAmount = players[cur].totalBet;
        for (let i = 0; i < 6; i++) {
          prize += Math.min(curAmount, players[i].totalBet);
          players[i].totalBet -= Math.min(curAmount, players[i].totalBet);
        }
        console.log(curAmount, prize);
        for (let i of order) {
          let v = Math.floor(prize / order.length);
          players[i].stack += v;
          console.log("---", i, v, players[i].stack, this.players[i].stack);
          earnings[i] += v;
        }
        players[cur].status = "FOLD";
        order.pop();
      }
    }
    for (let i = 0; i < 6; i++) players[i].status = oldStatus[i];
    console.log("----------------- END --------------------");
    console.log(players.map((player) => player.stack));
    this.status = "OVER";
    this.prizes = earnings;
    this.broadcast();

    setTimeout(async () => {
      this.communityCards = [[], [], [], [], []];
      await this.newHand();
    }, ANIMATION_DELAY_TIME * 3);
  }

  stake(amount: number) {
    const player = this.players[this.currentPlayerId];
    amount = Math.min(amount, player.stack);
    player.stack -= amount;
    player.betAmount += amount;
    this.plusBet = amount;
    if (!player.stack) player.status = "ALLIN";
  }

  smallBlindFn() {
    console.log("small blind on ", this.id);
    this.status = "SMALL_BLIND";
    this.players[this.currentPlayerId].status = "SMALL_BLIND";
    this.stake(this.smallBlind);
    this.moveTurn();
  }

  bigBlindFn() {
    console.log("big blind on ", this.id);
    this.status = "BIG_BLIND";
    this.players[this.currentPlayerId].status = "BIG_BLIND";
    this.currentBet = this.bigBlind;
    this.stake(this.bigBlind);
    this.broadcast();
    setTimeout(() => {
      if (numberOfActivePlayers(this.players) >= 4) {
        this.status = "STRADDLE";
        this.moveTurn();
      } else {
        this.deliver();
        this.moveTurn();
      }
    }, ANIMATION_DELAY_TIME);
  }

  deliver() {
    for (let i = 0; i < 6; i++)
      if (isActive(this.players[i])) {
        this.players[i].status = "NONE";
        this.players[i].cards = [this.cards.pop() ?? 0, this.cards.pop() ?? 0];
      }
  }

  straddle() {}

  call() {
    console.log("call on", this.id);
    this.status = "CALL";
    let player = this.players[this.currentPlayerId];
    player.status = "CALL";
    this.stake(this.currentBet - player.betAmount);
    this.moveTurn();
  }

  fold() {
    console.log("fold on", this.id);
    this.status = "FOLD";
    let player = this.players[this.currentPlayerId];
    player.status = "FOLD";
    this.moveTurn();
  }

  check() {
    console.log("check on", this.id);
    this.status = "CHECK";
    let player = this.players[this.currentPlayerId];
    player.status = "CHECK";
    this.moveTurn();
  }

  allIn() {
    console.log("allin on", this.id);
    this.status = "ALLIN";
    let player = this.players[this.currentPlayerId];
    player.status = "ALLIN";
    if (player.stack > this.currentBet) {
      this.minRaise = player.stack + player.stack - this.currentBet;
      this.currentBet = player.stack;
    }
    this.stake(player.stack);
    this.moveTurn();
  }

  raise(amount: number) {
    this.status = "RAISE";
    let player = this.players[this.currentPlayerId];
    player.status = "RAISE";
    if (this.currentBet === 0) this.minRaise = amount + amount;
    else
      this.minRaise =
        amount + amount - Math.max(this.bigBlind, this.currentBet);
    this.currentBet = amount;
    this.stake(amount - player.betAmount);
    this.moveTurn();
  }

  infoForLobby() {
    const { id, name, type, smallBlind, bigBlind, BuyIn } = this;
    return {
      id,
      name,
      type,
      smallBlind,
      bigBlind,
      BuyIn,
      activePlayersCnt: numberOfPlayers(this.players),
    };
  }

  info = async (viewer: string = "") => {
    let data = {
      id: this.id,
      name: this.name,
      type: this.type,
      smallBlind: this.smallBlind,
      bigBlind: this.bigBlind,
      round: this.round,
      pot: this.pot,
      currentBet: this.currentBet,
      minRaise: this.minRaise,
      dealerId: this.dealerId,
      SBId: this.SBId,
      currentPlayerId: this.currentPlayerId,
      countdown: this.countdown,
      status: this.status,
      communityCards: this.communityCards,
      plusBet: this.plusBet,
      players: this.players,
    };
    // if (data.status.includes("BLIND") || data.status == "CALL" || data.status == "RAISE" || data.status == "ALLIN") {
    //   data.status = "BET";
    // }
    data.players = await playersInfo(
      this.players,
      this.round == Round.OVER || this.isLockup ? "all" : viewer
    );
    data.players.forEach((player, index) => {
      if (isActive(player)) {
        if (index != this.currentPlayerId || this.isLockup)
          player.status = "IDLE";
        else if (this.status == "IDLE") player.status = "ACTIVE";
        else if (
          player.status.includes("BLIND") ||
          player.status == "CALL" ||
          player.status == "RAISE" ||
          player.status == "ALLIN"
        )
          player.status = "BET";
      }
      player.prize = this.prizes[index];
    });
    return data;
  };

  getPosition = (address: string) => {
    for (let i = 0; i < 6; i++)
      if (this.players[i].address == address) return i;
    return -1;
  };

  getStatus = (address: string) => {
    for (let i = 0; i < 6; i++)
      if (this.players[i].address == address) {
        if (this.players[i].leave) return "LEAVE";
        if (this.players[i].disconnect) return "DISCONNECT";
        return this.players[i].status;
      }
    return "NOT_EXIST";
  };

  tick = async () => {
    this.countdown--;
    this.broadcast();
    // console.log(this.countdown);
    if (this.status == "IDLE") {
      if (this.countdown < 0) this.fold();
      else setTimeout(this.tick, 1000);
    }
  };

  tick1 = async () => {
    this.countdown--;
    this.broadcast();
    if (this.status == "IDLE") {
      if (this.countdown < 0) {
        this.deliver();
        this.countdown = COUNT_DOWN + 1;
        this.tick();
      } else setTimeout(this.tick1, 1000);
    }
  };

  broadcast(channel: string = "") {
    console.log(this.status, this.currentPlayerId);
    console.log(this.players.map((player) => player.status));
    console.log(this.players.map((player) => player.betAmount));

    this.server
      .in("room-" + this.id)
      .fetchSockets()
      .then((sockets) => {
        for (let socket of sockets) {
          let viewer = "";
          this.players.forEach((player) => {
            if (player.socket?.id == socket.id) viewer = player.address;
          });
          this.info(viewer).then((data) => {
            socket.emit("tableInfo", data);
          });
        }
      });
  }

  getPlayerPosition(socket: Socket) {
    for (let i = 0; i < 6; i++) {
      if (this.players[i].socket?.id == socket.id) return i;
    }
    return -1;
  }

  isSocketOfPlayer(socket: Socket) {
    return this.getPlayerPosition(socket) > -1;
  }

  numberOfPlayers() {
    return numberOfPlayers(this.players);
  }
  test() {}
}
