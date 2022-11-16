import {
  Environment,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Player } from "@owlbear-rodeo/sdk";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import Backdrop from "@mui/material/Backdrop";
import IconButton from "@mui/material/IconButton";

import HiddenIcon from "@mui/icons-material/VisibilityOffRounded";

import environment from "../environment.hdr";
import { usePlayerDice } from "./usePlayerDice";
import { PlayerDiceRoll } from "./PlayerDiceRoll";
import { AudioListenerProvider } from "../audio/AudioListenerProvider";
import { Tray } from "../tray/Tray";
import { useDebugStore } from "../debug/store";
import { TraySuspense } from "../tray/TraySuspense";

export function PlayerTrayPreview({
  player,
  onSelect,
  focused,
}: {
  player: Player;
  onSelect: () => void;
  focused: boolean;
}) {
  const allowOrbit = useDebugStore((state) => state.allowOrbit);

  const { diceRoll, finalValue, finishedRolling } = usePlayerDice(player);

  return (
    <Stack alignItems="center">
      <Badge
        badgeContent={finishedRolling ? finalValue : null}
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
            <TraySuspense>
              <Canvas frameloop="demand">
                <AudioListenerProvider volume={focused ? 0 : 0.25}>
                  <Environment files={environment} />
                  <Tray />
                  <PlayerDiceRoll player={player} />
                  <PerspectiveCamera
                    makeDefault
                    fov={28}
                    position={[0, 4.3, 0]}
                    rotation={[-Math.PI / 2, 0, 0]}
                  />
                  {allowOrbit && <OrbitControls />}
                </AudioListenerProvider>
              </Canvas>
            </TraySuspense>
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
