import Stack from "@mui/material/Stack";
import OBR, { Player } from "owlbear-rodeo-sdk";
import { useEffect, useState } from "react";
import { PlayerTray } from "./PlayerTray";

export function PartyTrays() {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    OBR.party.getPlayers().then(setPlayers);
  }, []);
  useEffect(() => OBR.party.onChange(setPlayers), []);

  return (
    <Stack gap={1}>
      {players.map((player) => (
        <PlayerTray key={player.connectionId} player={player} />
      ))}
    </Stack>
  );
}
