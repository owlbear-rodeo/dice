import { Suspense, useState } from "react";
import {
  ContactShadows,
  Environment,
  PerspectiveCamera,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Player } from "owlbear-rodeo-sdk";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Fade from "@mui/material/Fade";
import Backdrop from "@mui/material/Backdrop";
import Tooltip from "@mui/material/Tooltip";

import HiddenIcon from "@mui/icons-material/VisibilityOffRounded";

import { Tray } from "../tray/Tray";
import environment from "../environment.hdr";
import { GradientOverlay } from "../controls/GradientOverlay";
import { DiceResults } from "../controls/DiceResults";
import { usePlayerDice } from "./usePlayerDice";
import { PlayerDice } from "./PlayerDice";

export function PlayerTray({
  player,
}: {
  player?: Player; // Make player optional to allow for preloading of the tray
}) {
  const { diceRoll, rollValues, finalValue } = usePlayerDice(player);

  const [resultsExpanded, setResultsExpanded] = useState(false);

  return (
    <Box component="div" position="relative" display="flex">
      <Box
        component="div"
        borderRadius={0.5}
        height="100vh"
        width="calc(100vh / 2)"
        overflow="hidden"
        position="relative"
      >
        <Canvas frameloop="demand">
          <Suspense fallback={null}>
            <ContactShadows
              resolution={256}
              scale={[1, 2]}
              position={[0, 0, 0]}
              blur={0.5}
              opacity={0.5}
              far={1}
              color="#222222"
            />
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
        {diceRoll?.hidden && (
          <Backdrop open sx={{ position: "absolute" }}>
            <Tooltip title="Hidden Roll">
              <HiddenIcon />
            </Tooltip>
          </Backdrop>
        )}
      </Box>
      <Fade in={finalValue !== null} unmountOnExit>
        <GradientOverlay top height={resultsExpanded ? 500 : undefined} />
      </Fade>
      <GradientOverlay />
      <Fade in={finalValue !== null} unmountOnExit>
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            pointerEvents: "none",
            padding: 3,
          }}
          component="div"
        >
          <Stack
            direction="row"
            justifyContent="center"
            width="100%"
            alignItems="start"
          >
            {diceRoll && rollValues && finalValue !== null && (
              <DiceResults
                diceRoll={diceRoll}
                rollValues={rollValues}
                expanded={resultsExpanded}
                onExpand={setResultsExpanded}
              />
            )}
          </Stack>
        </Box>
      </Fade>
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          pointerEvents: "none",
          padding: 3,
        }}
        component="div"
      >
        <Typography
          variant="h6"
          color="rgba(255, 255, 255, 0.7)"
          textAlign="center"
        >
          {player?.name}
        </Typography>
      </Box>
    </Box>
  );
}
