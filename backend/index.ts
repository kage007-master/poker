import SocketIO from "socket.io";
import http from "http";
import express from "express";
import cors from "cors";
import path from "path";

import PokerService from "./src/sockets/pokerService";
import { connectDatabase } from "./src/config/db";
import routes from "./src/routes";

class App {
  private server: http.Server;
  private port: number;
  private io: SocketIO.Server;
  private crashSocket: any;
  private pokerSocket: any;
  private pokerService!: PokerService;

  constructor(port: number) {
    this.port = port;

    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(routes);
    app.use(express.static(path.join(__dirname, "public")));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "public", "index.html"));
    });

    this.server = new http.Server(app);

    this.io = new SocketIO.Server(this.server, {
      cors: { methods: ["GET", "POST"] },
    });

    this.crashSocket = this.io.of("/crash");
    this.pokerSocket = this.io.of("/poker");

    connectDatabase().then(() => {
      this.run();
    });
  }

  public run() {
    this.server.listen(this.port);
    console.log(`Server listening on port ${this.port}`);
    this.pokerService = new PokerService(this.pokerSocket);
  }
}

new App(Number(4002));
