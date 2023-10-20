import React from "react";
import socketio from "socket.io-client";
import env from "config";

// const mainsocket = socketio.connect("https://poker.ddog.club/");
// const crashsocket = socketio.connect("https://poker.ddog.club/crash");
const pokersocket = socketio.connect(env.socket);

export { pokersocket };
export const SocketContext = React.createContext();
