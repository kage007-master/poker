import { Server, Socket } from "socket.io";
import { Ring } from "../models/Ring";
import { SNG } from "../models/SNG";
import { User } from "../types/User";
import authController from "../controllers/auth.controller";
import { Room } from "../models/Room";
import { nullPlayer } from "../utils/poker";

const Hand = require("pokersolver").Hand;

interface Message {
  text: string;
  address: string;
  avatar: string;
  time: Date;
}

export default class PokerService {
  private io!: Server;
  public tables: { [key: string]: Ring | SNG } = {};
  public rooms: { [key: number]: Room } = {};
  public users: Record<string, User> = {};
  public tableCounter: number = 0;
  public roomCounter: number = 0;
  public hHands: any = null;
  public hHandUsers: string[] = [];

  messages: Message[] = [];

  constructor(io: Server) {
    this.io = io;
    this.buildConnection();
    this.createRoom({ smallBlind: 1, bigBlind: 2 });
    this.createSNG({ smallBlind: 1, bigBlind: 2, buyIn: 500 });
    this.createRoom({ smallBlind: 2, bigBlind: 5 });
    this.createRoom({ smallBlind: 4, bigBlind: 8 });
    this.createSNG({ smallBlind: 5, bigBlind: 10, buyIn: 1000 });
    this.createRoom({ smallBlind: 10, bigBlind: 20 });
    this.createSNG({ smallBlind: 20, bigBlind: 40, buyIn: 2000 });
    this.createRoom({ smallBlind: 50, bigBlind: 100 });
  }

  buildConnection = () => {
    this.io.on("connection", (socket: Socket) => {
      socket.on("joinGame", () => this.newConnection(socket));
      socket.on("enterRoom", (data) => this.enterRoom(socket, data));
      socket.on("enterTable", (data) => this.enterTable(socket, data));
      socket.on("takeSeat", (data) => this.takeSeat(socket, data));
      socket.on("leaveTable", (data) => this.leaveTable(socket, data));
      socket.on("addchip", (data) => this.addchip(socket, data));
      socket.on("fold", (data) => this.fold(socket, data));
      socket.on("call", (data) => this.call(socket, data));
      socket.on("raise", (data) => this.raise(socket, data));
      socket.on("check", (data) => this.check(socket, data));
      socket.on("allIn", (data) => this.allIn(socket, data));

      socket.on("message", (data: any) => {
        const newMessage = {
          ...data,
          time: new Date(),
        };
        this.messages.push(newMessage);
        this.io.emit("message", newMessage);
      });

      socket.on("reconnect", () => this.connect(socket, false));
      socket.on("disconnect", () => this.connect(socket, true));

      setTimeout(() => {
        socket.emit("HighHand", {
          cards: this.hHands?.cards,
          users: this.hHandUsers,
        });
      }, 1000);
    });
  };

  newConnection = async (socket: Socket) => {
    this.connect(socket, true);
    this.sendMessage(socket, "lobbyInfo", this.lobbyInfo());
  };

  createRoom = async (data: any) => {
    const { type, smallBlind, bigBlind } = data;
    this.rooms[this.roomCounter] = new Room(
      Number(this.roomCounter),
      smallBlind,
      bigBlind,
      "Ring Game"
    );
    for (var i = 0; i < 4; i++) {
      this.createTable({
        name: "aaa",
        type: "Ring Game",
        smallBlind,
        bigBlind,
        roomid: this.roomCounter,
        parent: this,
      });
    }
    this.roomCounter++;
    this.broadcastMessage("lobbyInfo", this.lobbyInfo());
  };

  createSNG = async (data: any) => {
    const { smallBlind, bigBlind, buyIn } = data;
    this.rooms[this.roomCounter] = new Room(
      Number(this.roomCounter),
      smallBlind,
      bigBlind,
      "Turbo SNG",
      buyIn
    );
    this.tables[this.tableCounter] = new SNG(
      this.io,
      Number(this.tableCounter),
      "ttt",
      "Turbo SNG",
      smallBlind,
      bigBlind,
      buyIn,
      this.roomCounter
    );
    this.rooms[this.roomCounter].tables.push(this.tableCounter);
    this.tableCounter++;
    this.roomCounter++;
    this.broadcastMessage("lobbyInfo", this.lobbyInfo());
  };

  enterRoom = async (socket: Socket, data: any) => {
    const { roomId, address } = data;
    if (this.rooms[roomId].type === "Ring Game") {
      let minPlayerTableId = -1;
      let minPlayerCnt = 6;
      let emptyTableId = -1;
      this.rooms[roomId].tables.map((tableId) => {
        const status = this.tables[tableId].getStatus(address);
        if (status == "DISCONNECT") {
          minPlayerTableId = tableId;
          return;
        }
        if (status != "NOT_EXIST") return;
        const playerCnt = this.tables[tableId].numberOfPlayers();
        if (playerCnt === 0 && emptyTableId === -1) emptyTableId = tableId;
        else if (playerCnt > 0 && playerCnt < 6 && minPlayerCnt > playerCnt)
          minPlayerTableId = tableId;
      });
      socket.emit(
        "avaliableTableId",
        minPlayerTableId >= 0 ? minPlayerTableId : emptyTableId
      );
    } else {
      socket.emit("avaliableTableId", this.rooms[roomId].tables[0]);
    }
  };

  createTable = async (data: any) => {
    const { name, type, smallBlind, bigBlind, roomid, parent } = data;
    this.tables[this.tableCounter] = new Ring(
      this.io,
      Number(this.tableCounter),
      name,
      type,
      smallBlind,
      bigBlind,
      roomid,
      parent
    );
    this.rooms[roomid].tables.push(this.tableCounter);
    this.tableCounter++;
  };

  enterTable = async (socket: Socket, data: any) => {
    const { address, id } = data;
    if (
      !address ||
      typeof id == undefined ||
      !this.tables[id] ||
      this.tables[id].status === "FINISHED"
    ) {
      this.sendMessage(socket, "error", "Invalid data");
      return;
    }

    const status = this.tables[id].getStatus(address);
    if (status === "NOT_EXIST") this.tableInfo(socket, data);
    else if (status === "DISCONNECT") {
      const pos = this.tables[id].getPosition(address);
      this.tables[id].players[pos].socket = socket;
      this.tables[id].players[pos].disconnect = false;
      this.tableInfo(socket, data);
    } else {
      this.sendMessage(
        socket,
        "error",
        "You already participated in the table"
      );
    }
  };

  tableInfo = async (socket: Socket, data: any) => {
    const { address, id } = data;
    if (!address || typeof id == undefined || !this.tables[id]) {
      this.sendMessage(socket, "error", "Invalid data");
      return;
    }
    this.sendMessage(socket, "tableInfo", await this.tables[id].info(address));
    socket.join("room-" + id);
  };

  addchip = async (socket: Socket, data: any) => {
    const { address, tableId, chip } = data;
    if (!address || typeof tableId == undefined || !this.tables[tableId]) {
      this.sendMessage(socket, "error", "Invalid data");
      return;
    }
    if (this.tables[tableId].type === "Turbo SNG") {
      this.sendMessage(socket, "error", "You can't add chips on tournaments!");
      return;
    }
    const pos = this.tables[tableId].getPosition(address);
    if (pos === -1) {
      this.sendMessage(socket, "error", "You didn't participate this table.");
      return;
    }
    const user = await authController.getUser(address);
    if (user) {
      if (user.balance.ebone < chip) {
        this.sendMessage(
          socket,
          "error",
          `You don't have enough chips to add.`
        );
        return;
      }
      user.balance.ebone -= chip;
      authController.updateUser(user);
      if (this.tables[tableId].status === "WAIT")
        this.tables[tableId].players[pos].stack += chip;
      else this.tables[tableId].players[pos].addchip += chip;
      this.sendMessage(
        socket,
        "tableInfo",
        await this.tables[tableId].info(address)
      );
    }
  };

  takeSeat = async (socket: Socket, data: any) => {
    const { address, tableId, position, buyIn } = data;
    if (
      !address ||
      typeof tableId == undefined ||
      typeof position == undefined ||
      typeof buyIn == undefined ||
      !this.tables[tableId] ||
      position >= 6
    ) {
      this.sendMessage(socket, "error", "Invalid data");
      return;
    }
    const table = this.tables[tableId];
    if (table?.players[position]?.address) {
      this.sendMessage(
        socket,
        "error",
        "That seat is already taken by other one"
      );
      return;
    }
    if (table?.type === "Turbo SNG" && table?.status !== "WAIT") {
      this.sendMessage(socket, "error", "This tournament is already started");
      return;
    }
    if (table.getPosition(address) >= 0) {
      this.sendMessage(
        socket,
        "error",
        "You already participated in the table"
      );
      return;
    }
    const user = await authController.getUser(address);
    if (user) {
      if (user.balance.ebone < buyIn || buyIn < table.BuyIn) {
        this.sendMessage(
          socket,
          "error",
          `You need at least ${table.BuyIn}chips`
        );
        return;
      }
      user.balance.ebone -= buyIn;
      authController.updateUser(user);

      await table.takeSeat(
        {
          socket,
          address,
          avatar: user.avatar!,
          stack: table.type === "Turbo SNG" ? table.initBB * 50 : buyIn,
          betAmount: 0,
          totalBet: 0,
          status: "FOLD",
          cards: [] as number[],
          position: data.position,
          disconnect: false,
          leave: false,
          addchip: 0,
        },
        data.position
      );

      console.log(
        `${address} is taking seat at ${position} on table ${tableId}`
      );

      this.tableInfo(socket, { address, id: tableId });
    }
  };

  lobbyInfo = () => {
    let data = Object.values(this.rooms).map((room) =>
      room.infoForLobby(this.tables)
    );
    return data;
  };

  // table actions
  check = async (socket: Socket, data: any) => {
    this.tables[data.id].check();
  };

  fold = async (socket: Socket, data: any) => {
    this.tables[data.id].fold();
  };

  call = async (socket: Socket, data: any) => {
    this.tables[data.id].call();
  };

  raise = async (socket: Socket, data: any) => {
    this.tables[data.id].raise(data.amount);
  };

  allIn = async (socket: Socket, data: any) => {
    this.tables[data.id].allIn();
  };

  leaveTable = async (socket: Socket, data: any) => {
    const { id, address } = data;
    const status = this.tables[id].getStatus(address);
    if (status === "NOT_EXIST") {
      socket.leave("room-" + id);
    } else if (status !== "LEAVE") {
      const pos = this.tables[id].getPosition(address);
      if (this.tables[id].status === "WAIT") {
        socket.leave("room-" + id);
        this.tables[id].sitOut(pos);
      } else {
        console.log(id, pos);
        this.tables[id].leaveSeat(pos);
      }
    }
  };

  sendMessage = (socket: Socket, channel: string, data: any = {}) => {
    socket.emit(channel, data);
  };

  broadcastMessage = (channel: string, data: any = {}) => {
    this.io.emit(channel, data);
  };

  updateHighHand(data: any) {
    if (!this.hHands) {
      this.hHands = data.newHHand;
      this.hHandUsers = data.newWinners;
    } else {
      let temp: any[] = [];
      temp.push(this.hHands);
      temp.push(data.newHHand);
      let winners = Hand.winners(temp);
      if (winners.includes(data.newHHand)) {
        if (!winners.includes(this.hHands)) {
          this.hHands = data.newHHand;
          this.hHandUsers = data.newWinners;
        } else {
          this.hHandUsers = this.hHandUsers.concat(data.newWinners);
        }
      }
    }
    this.broadcastMessage("HighHand", {
      cards: this.hHands.cards,
      users: this.hHandUsers,
    });
  }

  connect = (socket: Socket, status: boolean) => {
    Object.keys(this.tables).forEach((key) => {
      let table = this.tables[key];
      if (status && socket.rooms.has("room-" + key)) {
        if (this.tables[key].numberOfPlayers() > 1) {
          this.tables[key].disconnectList.push(socket);
          socket.leave("room-" + key);
        } else {
        }
      }
      if (!status) this.tables[key].wasDisconnected(socket);
      let pos = table.getPlayerPosition(socket);
      if (pos >= 0) table.connect(pos, status);
    });
    this.broadcastMessage("lobbyInfo", this.lobbyInfo());
  };
}
