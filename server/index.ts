import express from "express";
import http from "http";
import { Server } from "socket.io";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { buyProperty, endTurn, handleDisconnect, initGame, joinGame, rollDice, startGame } from "./game.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  path: "/socket.io/",
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["polling", "websocket"],
  pingTimeout: 60000, // 기본값 20000
  pingInterval: 25000, // 기본값 10000
  allowUpgrades: true,
});

io.engine.on("connection_error", (err) => {
  console.log("연결 에러 발생:", err.req?.url, err.code, err.message, err.context);
});

// 더 자세한 디버깅을 위한 로그 추가
io.engine.on("connection", (socket) => {
  console.log(`엔진 연결됨: ${socket.id}, transport: ${socket.transport.name}`);
});

app.use(express.static(path.join(__dirname, "../dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

io.on("connection", (socket) => {
  console.log("유저 접속", socket.id);

  socket.on("joinGame", (name: string) => {
    const { gameState, error } = joinGame(socket.id, name);

    if (error) {
      socket.emit("gameError", error); // 이름 변경: error -> gameError
      return;
    }

    io.emit("updateGameState", gameState);
  });

  socket.on("startGame", () => {
    const { gameState, error } = startGame();
    if (error) {
      socket.emit("gameError", error); // 이름 변경: error -> gameError
      return;
    }

    io.emit("updateGameState", gameState);
    io.emit("gameStarted");
  });

  socket.on("rollDice", () => {
    const { gameState, error } = rollDice(socket.id);
    if (error) {
      socket.emit("gameError", error); // 이름 변경: error -> gameError
      return;
    }

    io.emit("updateGameState", gameState);
  });

  socket.on("buyProperty", () => {
    const { gameState, error } = buyProperty(socket.id);
    if (error) {
      socket.emit("gameError", error); // 이름 변경: error -> gameError
      return;
    }
    io.emit("updateGameState", gameState);
  });

  socket.on("endTurn", () => {
    const { gameState, error } = endTurn(socket.id);
    if (error) {
      socket.emit("gameError", error); // 이름 변경: error -> gameError
      return;
    }
    io.emit("updateGameState", gameState);
  });

  socket.on("disconnect", (reason) => {
    console.log("연결 끊김", socket.id, "이유:", reason);
    const gameState = handleDisconnect(socket.id);
    io.emit("updateGameState", gameState);
  });
});

initGame();

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`서버가 지금 ${PORT}번에서 실행 중입니다.`);
});
