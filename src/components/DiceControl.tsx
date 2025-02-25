import React from "react";

import { rollDice, buyProperty, endTurn } from "../utils/socket";
import { GameState } from "../types";

interface DiceControlProps {
  gameState: GameState;
  playerId: string;
}

export default function DiceControl({ gameState, playerId }: DiceControlProps) {
  const isMyTurn = gameState.players[gameState.currentPlayerIndex]?.id === playerId;

  const handleRollDice = () => {
    rollDice();
  };

  const handleBuyProperty = () => {
    buyProperty();
  };

  const handleEndTurn = () => {
    endTurn();
  };

  const currentProperty = gameState.properties[gameState.players[gameState.currentPlayerIndex]?.position || 0];
  const canBuyProperty = currentProperty?.type === "property" && currentProperty?.owner === null;

  return (
    <div className="dice-control">
      <div className="dice-container">
        <h3>주사위</h3>
        <div className="dice-display">
          <div className="dice">{gameState.dice[0]}</div>
          <div className="dice">{gameState.dice[1]}</div>
        </div>
        <div className="dice-sum">합계: {gameState.dice[0] + gameState.dice[1]}</div>
      </div>

      {isMyTurn ? (
        <div className="actions">
          <button onClick={handleRollDice} className="action-button roll">
            주사위 굴리기
          </button>

          <button onClick={handleBuyProperty} className={`action-button buy ${!canBuyProperty ? "disabled" : ""}`} disabled={!canBuyProperty}>
            땅 구매하기
          </button>

          <button onClick={handleEndTurn} className="action-button end">
            턴 넘기기
          </button>
        </div>
      ) : (
        <div className="waiting-message">다른 플레이어의 차례입니다.</div>
      )}
    </div>
  );
}
