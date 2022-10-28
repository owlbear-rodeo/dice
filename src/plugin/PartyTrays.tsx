import OBR, { Player } from "owlbear-rodeo-sdk";
import { useEffect, useMemo, useState } from "react";

import Dialog from "@mui/material/Dialog";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";

import CloseIcon from "@mui/icons-material/ChevronLeftRounded";

import { SlideTransition } from "../controls/SlideTransition";
import { PlayerTray } from "./PlayerTray";
import { PlayerTrayPreview } from "./PlayerTrayPreview";

export function PartyTrays({
  onPlayerCountChange,
}: {
  onPlayerCountChange: (count: number) => void;
}) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [focusedTray, setFocusTray] = useState<string | null>(null);

  useEffect(() => {
    OBR.party.getPlayers().then(setPlayers);
  }, []);
  useEffect(() => OBR.party.onChange(setPlayers), []);

  useEffect(() => {
    onPlayerCountChange(players.length);
  }, [players.length]);

  const focusedPlayer = useMemo(() => {
    if (focusedTray) {
      return players.find((player) => player.connectionId === focusedTray);
    } else {
      return;
    }
  }, [players, focusedTray]);

  if (players.length === 0) {
    return null;
  }

  return (
    <Stack gap={1}>
      {players.map((player) => (
        <PlayerTrayPreview
          key={player.connectionId}
          player={player}
          onSelect={() => setFocusTray(player.connectionId)}
        />
      ))}
      <Dialog
        open={Boolean(focusedPlayer)}
        onClose={() => setFocusTray(null)}
        fullScreen
        TransitionComponent={SlideTransition}
        hideBackdrop
        PaperProps={{
          sx: {
            bgcolor: "rgba(34, 38, 57, 0.9)",
          },
        }}
        // Keep mounted to allow the canvas to be ready
        // during the open animation
        keepMounted
      >
        <Stack
          pl="60px"
          position="relative"
          width="100%"
          height="100%"
          overflow="hidden"
        >
          <PlayerTray player={focusedPlayer} />
          <IconButton
            onClick={() => setFocusTray(null)}
            sx={{
              position: "absolute",
              left: 12,
              top: 12,
              height: "calc(100% - 24px)",
              borderRadius: 0.5,
            }}
          >
            <CloseIcon />
          </IconButton>
        </Stack>
      </Dialog>
    </Stack>
  );
}
