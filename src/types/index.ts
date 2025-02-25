// src/types/index.ts
export interface Player {
  id: string;
  name: string;
  position: number;
  money: number;
  properties: number[];
}

export interface Property {
  id: number;
  name: string;
  type: "start" | "property" | "tax" | "chance" | "jail" | "parking";
  price: number;
  owner: string | null;
  rent: number;
}

export interface GameState {
  players: Player[];
  properties: Property[];
  currentPlayerIndex: number;
  dice: [number, number];
  gameStarted: boolean;
}

// 플레이어 색상 관리를 위한 상수
export const PLAYER_COLORS = [
  "#4285f4", // 파랑
  "#ea4335", // 빨강
  "#fbbc05", // 노랑
  "#34a853", // 초록
  "#9c27b0", // 보라
  "#ff6d01", // 주황
  "#0097a7", // 청록
  "#795548", // 갈색
];
