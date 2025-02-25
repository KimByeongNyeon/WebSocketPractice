// src/App.tsx
import React from "react";
import { useEffect, useState } from "react";
import { socket, onConnect, onDisconnect, onUpdateGameState, onError } from "./utils/socket";
import { GameState } from "./types";
import GameBoard from "./components/GameBoard";
import PlayerInfo from "./components/PlayerInfo";
import DiceControl from "./components/DiceControl";
import Lobby from "./components/Lobby";
import "./App.css";

function App() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playerId, setPlayerId] = useState<string>("");

  useEffect(() => {
    // 소켓 연결 및 이벤트
    socket.connect();
    // 구독
    const connectTimeout = setTimeout(() => {
      if (!isConnected) {
        setError("서버 연결 시간이 초과됨");
      }
    }, 5000);
    const unsubConnect = onConnect(() => {
      console.log("서버에 연결 됨");
      setIsConnected(true);
      // 소켓 연결 시 ID 저장
      setPlayerId(socket.id || "");
    });

    const unsubDisconnect = onDisconnect(() => {
      console.log("서버와 연결끊김:");
      setIsConnected(false);
    });
    const unsubUpdateGameState = onUpdateGameState((state) => {
      setGameState(state);
    });

    const unsubError = onError((message) => {
      setError(message);
      setTimeout(() => setError(null), 3000);
    });

    // 이미 연결되어 있는 경우 ID 설정
    if (socket.connected && socket.id) {
      setPlayerId(socket.id);
    }

    // 컴포넌트 언마운트 시 이벤트 구독 해제
    return () => {
      clearTimeout(connectTimeout);
      unsubConnect();
      unsubDisconnect();
      unsubUpdateGameState();
      unsubError();
      socket.disconnect();
    };
  }, []);

  // 플레이어 ID가 없거나 게임 상태가 없는 경우 게임 화면을 렌더링하지 않음
  const renderGameContent = isConnected && playerId && gameState;

  return (
    <div className="app-container">
      <h1 className="app-title">부루마블</h1>

      {!isConnected && <div className="connection-status">서버에 연결 중...</div>}

      {error && <div className="error-message">{error}</div>}

      {!renderGameContent ? (
        <div className="loading">게임을 로드하는 중...</div>
      ) : !gameState.gameStarted ? (
        <Lobby gameState={gameState} />
      ) : (
        <div className="game-container">
          <div className="game-board-container">
            <GameBoard gameState={gameState} playerId={playerId} />
          </div>

          <div className="game-controls-container">
            <PlayerInfo gameState={gameState} playerId={playerId} />
            <DiceControl gameState={gameState} playerId={playerId} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
