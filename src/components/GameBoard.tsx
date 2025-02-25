// src/components/GameBoard.tsx
import React from "react";

import { GameState } from "../types";
import PropertyCell from "./PropertyCell";

interface GameBoardProps {
  gameState: GameState;
  playerId: string;
}

export default function GameBoard({ gameState, playerId }: GameBoardProps) {
  // 보드 레이아웃 계산
  // 12개 속성을 정사각형 보드에 배치
  const properties = [...gameState.properties];

  // 보드 레이아웃: 각 변에 3개씩 배치
  const topRow = properties.slice(0, 4);
  const rightCol = properties.slice(4, 7);
  const bottomRow = properties.slice(7, 11).reverse();
  const leftCol = [properties[11]];

  return (
    <div className="game-board">
      <div className="board-grid">
        {/* 상단 행 */}
        <div className="top-row">
          {topRow.map((property) => (
            <PropertyCell key={property.id} property={property} gameState={gameState} playerId={playerId} />
          ))}
        </div>

        {/* 중간 행 (왼쪽 열 + 중앙 + 오른쪽 열) */}
        <div className="middle-row">
          <div className="left-col">
            {leftCol.map((property) => (
              <PropertyCell key={property.id} property={property} gameState={gameState} playerId={playerId} />
            ))}
          </div>

          <div className="center-area">
            <div className="board-title">부루마블</div>
          </div>

          <div className="right-col">
            {rightCol.map((property) => (
              <PropertyCell key={property.id} property={property} gameState={gameState} playerId={playerId} />
            ))}
          </div>
        </div>

        {/* 하단 행 */}
        <div className="bottom-row">
          {bottomRow.map((property) => (
            <PropertyCell key={property.id} property={property} gameState={gameState} playerId={playerId} />
          ))}
        </div>
      </div>
    </div>
  );
}
