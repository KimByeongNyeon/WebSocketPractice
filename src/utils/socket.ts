import { io, Socket } from "socket.io-client";
import { GameState } from "../types";

// 디버깅을 위한 localStorage 설정
localStorage.debug = "socket.io-client:*";

const URL = import.meta.env.VITE_SERVER_URL || window.location.origin;
export const socket: Socket = io(URL, {
  path: "/socket.io/",
  transports: ["polling", "websocket"],
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 60000,
  forceNew: true,
});

// 연결 이벤트에 더 자세한 로깅 추가
socket.on("connect", () => {
  console.log("서버에 연결됨!", socket.id);
  console.log("현재 transport:", socket.io.engine.transport.name);
});

socket.on("connect_error", (err) => {
  console.error("연결 에러:", err.message);
});

socket.io.on("error", (err) => {
  console.error("Transport 에러:", err);
});

socket.io.on("reconnect_attempt", (attempt) => {
  console.log(`재연결 시도 #${attempt}`);
});

socket.io.on("reconnect", () => {
  console.log("재연결 성공!");
});

socket.io.on("reconnect_failed", () => {
  console.error("재연결 실패: 최대 시도 횟수 초과");
});

type SocketCallback<T = GameState> = (data: T) => void;

export function joinGame(name: string): void {
  socket.emit("joinGame", name);
}

export function startGame(): void {
  socket.emit("startGame");
}

export function rollDice(): void {
  socket.emit("rollDice");
}

export function buyProperty(): void {
  socket.emit("buyProperty");
}

export function endTurn(): void {
  socket.emit("endTurn");
}

export function onUpdateGameState(callback: SocketCallback): () => void {
  socket.on("updateGameState", callback);
  return () => {
    socket.off("updateGameState", callback);
  };
}

// gameError 이벤트 구독 (error 이벤트 이름 변경)
export function onError(callback: SocketCallback<string>): () => void {
  socket.on("gameError", callback);
  return () => {
    socket.off("gameError", callback);
  };
}

// 게임 시작 이벤트 구독
export function onGameStarted(callback: () => void): () => void {
  socket.on("gameStarted", callback);
  return () => {
    socket.off("gameStarted", callback);
  };
}

// 연결 상태 확인을 위한 이벤트 구독
export function onConnect(callback: () => void): () => void {
  socket.on("connect", callback);
  return () => {
    socket.off("connect", callback);
  };
}

// 연결 끊김 이벤트 구독
export function onDisconnect(callback: () => void): () => void {
  socket.on("disconnect", callback);
  return () => {
    socket.off("disconnect", callback);
  };
}
