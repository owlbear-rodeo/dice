import { Suspense, useMemo } from "react";
import { Environment, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Player } from "owlbear-rodeo-sdk";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";

import { Tray } from "../tray/Tray";
import environment from "../environment.hdr";
import { getPluginId } from "./getPluginId";
import { DiceRoll } from "../types/DiceRoll";
import { getCombinedDiceValue } from "../helpers/getCombinedDiceValue";
import { DiceTransform } from "../types/DiceTransform";
import { getDieFromDice } from "../helpers/getDieFromDice";
import { Dice } from "../dice/Dice";

export function PlayerTray({
  player,
  fullSize,
}: {
  player: Player;
  fullSize?: boolean;
}) {
  const diceRoll = useMemo(() => {
    return player.metadata[getPluginId("roll")] as DiceRoll | undefined;
  }, [player]);

  const rollValues = useMemo(() => {
    return player.metadata[getPluginId("rollValues")] as
      | Record<string, number>
      | undefined;
  }, [player]);

  const rollTransforms = useMemo(() => {
    return player.metadata[getPluginId("rollTransforms")] as
      | Record<string, DiceTransform>
      | undefined;
  }, [player]);

  const finalValue = useMemo(() => {
    if (diceRoll && rollValues) {
      return getCombinedDiceValue(diceRoll, rollValues);
    } else {
      return null;
    }
  }, [diceRoll, rollValues]);

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
      >
        <Box
          component="div"
          borderRadius={0.5}
          height={fullSize ? "100vh" : "80px"}
          width={fullSize ? "calc(100vh / 2)" : "40px"}
          overflow="hidden"
          position="relative"
        >
          <Canvas frameloop="demand">
            <Suspense fallback={null}>
              <Environment files={environment} />
              <Tray />
              {diceRoll &&
                rollTransforms &&
                getDieFromDice(diceRoll).map((die) => {
                  const transform = rollTransforms[die.id];
                  if (transform) {
                    const p = transform.position;
                    const r = transform.rotation;
                    return (
                      <Dice
                        key={die.id}
                        die={die}
                        position={[p.x, p.y, p.z]}
                        quaternion={[r.x, r.y, r.z, r.w]}
                      />
                    );
                  } else {
                    return null;
                  }
                })}
              <PerspectiveCamera
                makeDefault
                fov={28}
                position={[0, 4.3, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
              />
            </Suspense>
          </Canvas>
        </Box>
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
