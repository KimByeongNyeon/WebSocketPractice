// src/components/Lobby.tsx
import React from "react";

import { useState } from "react";
import { GameState } from "../types";
import { joinGame, startGame } from "../utils/socket";

interface LobbyProps {
  gameState: GameState | null;
}

export default function Lobby({ gameState }: LobbyProps) {
  const [playerName, setPlayerName] = useState("");

  const handleJoinGame = () => {
    if (playerName.trim()) {
      joinGame(playerName);
      setPlayerName("");
    }
  };

  const handleStartGame = () => {
    startGame();
  };

  const canStartGame = (gameState?.players?.length || 0) >= 2;

  return (
    <div className="lobby">
      <h2 className="lobby-title">게임 로비</h2>

      <div className="join-form">
        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="이름을 입력하세요"
          className="name-input"
          onKeyDown={(e) => e.key === "Enter" && handleJoinGame()}
        />
        <button onClick={handleJoinGame} className="join-button">
          게임 참가
        </button>
      </div>

      {(gameState?.players?.length || 0) > 0 && (
        <div className="player-list">
          <h3>참가자 목록</h3>
          <ul>
            {gameState?.players?.map((player) => (
              <li key={player.id} className="player-list-item">
                {player.name}
              </li>
            ))}
          </ul>

          {canStartGame && (
            <button onClick={handleStartGame} className="start-button">
              게임 시작
            </button>
          )}

          {!canStartGame && gameState?.players?.length === 1 && <p className="waiting-message">다른 플레이어를 기다리는 중...</p>}
        </div>
      )}
    </div>
  );
}
