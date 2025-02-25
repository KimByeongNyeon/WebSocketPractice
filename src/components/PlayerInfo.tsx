// src/components/PlayerInfo.tsx
import React from "react";

import { GameState, PLAYER_COLORS } from "../types";

interface PlayerInfoProps {
  gameState: GameState;
  playerId: string;
}

export default function PlayerInfo({ gameState, playerId }: PlayerInfoProps) {
  const currentPlayer = gameState.players.find((p) => p.id === playerId);

  if (!currentPlayer) {
    return null;
  }

  const myProperties = gameState.properties.filter((prop) => prop.owner === playerId);

  // 플레이어 색상 얻기
  const getPlayerColor = (id: string) => {
    const playerIndex = gameState.players.findIndex((p) => p.id === id);
    return PLAYER_COLORS[playerIndex % PLAYER_COLORS.length];
  };

  return (
    <div className="player-info-container">
      <div className="player-header">
        <h2>{currentPlayer.name}</h2>
        <div className="player-position">위치: {gameState.properties[currentPlayer.position].name}</div>
        <div className="player-money">자금: {currentPlayer.money.toLocaleString()}원</div>
      </div>

      <div className="properties-section">
        <h3>내 소유 부동산</h3>
        {myProperties.length === 0 ? (
          <p className="no-properties">소유한 부동산이 없습니다.</p>
        ) : (
          <ul className="properties-list">
            {myProperties.map((prop) => (
              <li key={prop.id} className="property-item">
                <span className="property-name">{prop.name}</span>
                <span className="property-value">{prop.price.toLocaleString()}원</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="all-players-section">
        <h3>플레이어 목록</h3>
        <ul className="all-players-list">
          {gameState.players.map((player) => (
            <li key={player.id} className={`player-item ${player.id === gameState.players[gameState.currentPlayerIndex].id ? "current-player" : ""}`}>
              <div className="player-item-content">
                <div className="player-color-indicator" style={{ backgroundColor: getPlayerColor(player.id) }} />
                <span className="player-name">{player.name}</span>
                <span className="player-money-small">{player.money.toLocaleString()}원</span>
              </div>
              {player.id === gameState.players[gameState.currentPlayerIndex].id && <span className="turn-indicator">현재 차례</span>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
