import socketio from "socket.io-client";
import React from "react";

const mainsocket = socketio.connect("https://poker.ddog.club/");
const crashsocket = socketio.connect("https://poker.ddog.club/crash");
const pokersocket = socketio.connect("https://poker.ddog.club/poker");

export { mainsocket, crashsocket, pokersocket };
export const SocketContext = React.createContext();
