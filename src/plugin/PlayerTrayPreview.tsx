import { Suspense } from "react";
import { Environment, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Player } from "owlbear-rodeo-sdk";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";

import { Tray } from "../tray/Tray";
import environment from "../environment.hdr";
import IconButton from "@mui/material/IconButton";
import { usePlayerDice } from "./usePlayerDice";
import { PlayerDice } from "./PlayerDice";

export function PlayerTrayPreview({
  player,
  onSelect,
}: {
  player: Player;
  onSelect: () => void;
}) {
  const { finalValue } = usePlayerDice(player);

  return (
    <Stack>
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
            height="80px"
            width="40px"
            overflow="hidden"
            position="relative"
          >
            <Canvas frameloop="demand">
              <Suspense fallback={null}>
                <Environment files={environment} />
                <Tray />
                <PlayerDice player={player} />
                <PerspectiveCamera
                  makeDefault
                  fov={28}
                  position={[0, 4.3, 0]}
                  rotation={[-Math.PI / 2, 0, 0]}
                />
              </Suspense>
            </Canvas>
          </Box>
        </IconButton>
      </Badge>
      <Typography
        variant="caption"
        color="rgba(255, 255, 255, 0.7)"
        textAlign="center"
      >
        {player.name}
      </Typography>
    </Stack>
  );
}
