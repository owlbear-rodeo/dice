import { useMemo } from "react";
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
import { useTheme } from "@mui/material/styles";

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

  const { diceRoll, finalValue, finishedRolling, finishedRollTransforms } =
    usePlayerDice(player);

  const theme = useTheme();

  const z = useMemo(() => {
    if (finishedRollTransforms) {
      let center = 0;
      for (const transform of Object.values(finishedRollTransforms)) {
        center += transform.position.z;
        center /= 2;
      }
      return Math.min(0.5, Math.max(-0.5, center));
    } else {
      return 0;
    }
  }, [finishedRollTransforms]);

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
        <IconButton sx={{ borderRadius: 0.5, p: 0 }} onClick={() => onSelect()}>
          <Box
            component="div"
            borderRadius={0.5}
            height="48px"
            width="48px"
            overflow="hidden"
            position="relative"
            boxShadow={theme.shadows[5]}
          >
            <TraySuspense>
              <Canvas frameloop="demand" dpr={1}>
                <AudioListenerProvider volume={focused ? 0 : 0.25}>
                  <Environment files={environment} />
                  <Tray />
                  <PlayerDiceRoll player={player} />
                  <PerspectiveCamera
                    makeDefault
                    fov={13}
                    position={[0, 4.3, z]}
                    rotation={[-Math.PI / 2, 0, 0]}
                  />
                  {allowOrbit && <OrbitControls />}
                </AudioListenerProvider>
              </Canvas>
            </TraySuspense>
            <Box
              component="div"
              position="absolute"
              top="0"
              left="0"
              right="0"
              bottom="0"
              sx={{
                backgroundImage:
                  "linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))",
                ":hover": {
                  backgroundImage:
                    "linear-gradient(rgba(255, 255, 255, 0.10), rgba(255, 255, 255, 0.10))",
                },
              }}
            />
            {diceRoll?.hidden && (
              <Backdrop open sx={{ position: "absolute" }}>
                <HiddenIcon htmlColor="white" />
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
