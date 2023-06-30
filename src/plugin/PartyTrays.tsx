import OBR, { Player } from "@owlbear-rodeo/sdk";
import { useEffect, useMemo, useRef, useState } from "react";

import Dialog from "@mui/material/Dialog";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";

import CloseIcon from "@mui/icons-material/ChevronLeftRounded";

import { SlideTransition } from "../controls/SlideTransition";
import { PlayerTray } from "./PlayerTray";
import { PlayerAvatar } from "./PlayerAvatar";

export function PartyTrays() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [focusedTray, setFocusTray] = useState<string | null>(null);

  useEffect(() => {
    OBR.party.getPlayers().then(setPlayers);
  }, []);
  useEffect(() => OBR.party.onChange(setPlayers), []);

  const focusedPlayer = useMemo(() => {
    if (focusedTray) {
      return players.find((player) => player.connectionId === focusedTray);
    } else {
      return;
    }
  }, [players, focusedTray]);

  const theme = useTheme();

  const dockRef = useRef<HTMLDivElement>(null);
  // Scroll dock with Y and X direction wheel events
  useEffect(() => {
    const scroll = dockRef.current;
    if (scroll) {
      const handleWheel = (event: WheelEvent) => {
        event.preventDefault();
        if (Math.abs(event.deltaY) !== 0) {
          scroll.scrollBy({ left: event.deltaY });
        }
        if (Math.abs(event.deltaX) !== 0) {
          scroll.scrollBy({ left: event.deltaX });
        }
      };
      scroll.addEventListener("wheel", handleWheel);
      return () => {
        scroll.removeEventListener("wheel", handleWheel);
      };
    }
  }, []);

  if (players.length === 0) {
    return null;
  }

  return (
    <>
      {players.map((player) => (
        <PlayerAvatar
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
            bgcolor:
              theme.palette.mode === "dark"
                ? "rgba(34, 38, 57, 0.9)"
                : "rgba(241, 243, 249, 0.9)",
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
    </>
  );
}
