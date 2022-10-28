import { Suspense } from "react";
import { Environment, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Player } from "owlbear-rodeo-sdk";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import Backdrop from "@mui/material/Backdrop";

import HiddenIcon from "@mui/icons-material/VisibilityOffRounded";

import environment from "../environment.hdr";
import IconButton from "@mui/material/IconButton";
import { usePlayerDice } from "./usePlayerDice";
import { PlayerDice } from "./PlayerDice";
import { AudioListenerProvider } from "../audio/AudioListenerProvider";
import { Physics } from "@react-three/rapier";
import { PhysicsTray } from "../tray/PhysicsTray";

export function PlayerTrayPreview({
  player,
  onSelect,
}: {
  player: Player;
  onSelect: () => void;
}) {
  const { diceRoll, finalValue } = usePlayerDice(player);

  return (
    <Stack alignItems="center">
      <Badge
        badgeContent={finalValue}
        showZero
        overlap="circular"
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        sx={{
          ".MuiBadge-badge": {
            bgcolor: "background.paper",
          },
        }}
        max={999}
      >
        <IconButton
          sx={{ borderRadius: 0.5, p: 0.25 }}
          onClick={() => onSelect()}
        >
          <Box
            component="div"
            borderRadius={0.5}
            height="76px"
            width="36px"
            overflow="hidden"
            position="relative"
          >
            <Canvas frameloop="demand">
              <Suspense fallback={null}>
                <AudioListenerProvider>
                  <Environment files={environment} />
                  <Physics colliders={false}>
                    <PhysicsTray />
                    <PlayerDice player={player} />
                  </Physics>
                  <PerspectiveCamera
                    makeDefault
                    fov={28}
                    position={[0, 4.3, 0]}
                    rotation={[-Math.PI / 2, 0, 0]}
                  />
                </AudioListenerProvider>
              </Suspense>
            </Canvas>
            {diceRoll?.hidden && (
              <Backdrop open sx={{ position: "absolute" }}>
                <HiddenIcon />
              </Backdrop>
            )}
          </Box>
        </IconButton>
      </Badge>
      <Typography
        variant="caption"
        color="rgba(255, 255, 255, 0.7)"
        textAlign="center"
        width="100%"
        noWrap
      >
        {player.name}
      </Typography>
    </Stack>
  );
}
