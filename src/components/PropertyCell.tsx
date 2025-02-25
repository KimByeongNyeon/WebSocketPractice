import React from "react";
import { GameState, PLAYER_COLORS } from "../types";

interface PropertyCellProps {
  property: GameState["properties"][0];
  gameState: GameState;
  playerId: string;
}

export default function PropertyCell({ property, gameState, playerId }: PropertyCellProps) {
  const playersHere = gameState.players.filter((player) => player.position === property.id);

  let cellClass = "property-cell";
  switch (property.type) {
    case "start":
      cellClass += " start-cell";
      break;
    case "tax":
      cellClass += " tax-cell";
      break;
    case "chance":
      cellClass += " jail-cell";
      break;
    case "parking":
      cellClass += " parking-cell";
      break;
  }

  const getPlayerColor = (playerId: string) => {
    const playerIndex = gameState.players.findIndex((p) => p.id === playerId);
    return PLAYER_COLORS[playerIndex % PLAYER_COLORS.length];
  };
  return (
    <div className={cellClass}>
      <div className="property-name">{property.name}</div>

      {property.type === "property" && (
        <div className="property-details">
          <div className="property-price">{property.price.toLocaleString()}원</div>
          {property.owner && <div className="owner-indicator" style={{ backgroundColor: getPlayerColor(property.owner) }} />}
        </div>
      )}

      {playersHere.length > 0 && (
        <div className="players-container">
          {playersHere.map((player) => (
            <div key={player.id} className="player-marker" style={{ backgroundColor: getPlayerColor(player.id) }} title={player.name} />
          ))}
        </div>
      )}
    </div>
  );
}
