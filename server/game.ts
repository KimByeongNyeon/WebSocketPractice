import { GameState, Player, Property } from "./types.js";

let gameState: GameState = {
  players: [],
  properties: [],
  currentPlayerIndex: 0,
  dice: [1, 1],
  gameStarted: false,
};

export function initGame(): void {
  gameState = {
    players: [],
    properties: initializeProperties(),
    currentPlayerIndex: 0,
    dice: [1, 1],
    gameStarted: true,
  };
}

function initializeProperties(): Property[] {
  return [
    { id: 0, name: "출발", type: "start", price: 0, owner: null, rent: 0 },
    { id: 1, name: "서울", type: "property", price: 100000, owner: null, rent: 10000 },
    { id: 2, name: "추가금", type: "tax", price: 0, owner: null, rent: 0 },
    { id: 3, name: "부산", type: "property", price: 120000, owner: null, rent: 12000 },
    { id: 4, name: "인천", type: "property", price: 150000, owner: null, rent: 15000 },
    { id: 5, name: "무인도", type: "jail", price: 0, owner: null, rent: 0 },
    { id: 6, name: "대전", type: "property", price: 180000, owner: null, rent: 18000 },
    { id: 7, name: "기회", type: "chance", price: 0, owner: null, rent: 0 },
    { id: 8, name: "대구", type: "property", price: 200000, owner: null, rent: 20000 },
    { id: 9, name: "광주", type: "property", price: 220000, owner: null, rent: 22000 },
    { id: 10, name: "무료주차", type: "parking", price: 0, owner: null, rent: 0 },
    { id: 11, name: "제주", type: "property", price: 250000, owner: null, rent: 25000 },
  ];
}

export function joinGame(playerId: string, name: string): { gameState: GameState; error?: string } {
  if (gameState.gameStarted) {
    return { gameState, error: "게임이 시작되었습니다." };
  }

  if (gameState.players.some((p) => p.id === playerId)) {
    return { gameState, error: "이미 게임에 참가했음" };
  }

  const player: Player = {
    id: playerId,
    name,
    position: 0,
    money: 500000,
    properties: [],
  };

  gameState.players.push(player);
  return { gameState };
}

export function startGame(): { gameState: GameState; error?: string } {
  if (gameState.players.length < 2) {
    return { gameState, error: "최소 2명의 게임 플레이어가 필요합니다." };
  }
  gameState.gameStarted = true;
  return { gameState };
}

export function rollDice(playerId: string): { gameState: GameState; error?: string } {
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];

  if (!currentPlayer || playerId !== currentPlayer.id) {
    return { gameState, error: "당신의 차례가 아닙니다." };
  }

  const dice1 = Math.floor(Math.random() * 6) + 1;
  const dice2 = Math.floor(Math.random() * 6) + 1;
  gameState.dice = [dice1, dice2];

  currentPlayer.position = (currentPlayer.position + dice1 + dice2) % gameState.properties.length;

  handlePlayerPostion(currentPlayer);

  return { gameState };
}

function handlePlayerPostion(player: Player): void {
  const property = gameState.properties[player.position];

  switch (property.type) {
    case "start":
      player.money += 50000;
      break;
    case "property":
      if (property.owner && property.owner !== player.id) {
        const owner = gameState.players.find((p) => p.id === property.owner);
        if (owner) {
          player.money -= property.rent;
          owner.money += property.rent;
        }
      }
      break;
    case "tax":
      player.money -= 50000;
      break;
    case "chance":
      const randomAmount = Math.floor(Math.random() * 100000) - 50000;
      player.money += randomAmount;
      break;
    case "jail":
      break;
    case "parking":
      break;
  }
}

export function buyProperty(playerId: string): { gameState: GameState; error?: string } {
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  if (!currentPlayer || playerId !== currentPlayer.id) {
    return { gameState, error: "당신의 차례가 아닙니다." };
  }
  const property = gameState.properties[currentPlayer.position];

  if (property.type !== "property" || property.owner !== null) {
    return { gameState, error: "이 땅은 구매할 수 없습니다." };
  }

  if (currentPlayer.money < property.price) {
    return { gameState, error: "돈이 부족합니다." };
  }

  currentPlayer.money -= property.price;
  property.owner = currentPlayer.id;
  currentPlayer.properties.push(property.id);

  return { gameState };
}

export function endTurn(playerId: string): { gameState: GameState; error?: string } {
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];

  if (!currentPlayer || playerId !== currentPlayer.id) {
    return { gameState, error: "당신의 차례가 아닙니다." };
  }

  gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;

  return { gameState };
}

export function handleDisconnect(playerId: string): GameState {
  const playerIndex = gameState.players.findIndex((p) => p.id === playerId);

  if (playerIndex !== -1) {
    gameState.players.splice(playerIndex, 1);

    gameState.properties.forEach((prop) => {
      if (prop.owner === playerId) {
        prop.owner = null;
      }
    });
    if (gameState.currentPlayerIndex >= gameState.players.length) {
      gameState.currentPlayerIndex = 0;
    }

    if (gameState.players.length <= 1 && gameState.gameStarted) {
      gameState.gameStarted = false;
    }
  }
  return gameState;
}
