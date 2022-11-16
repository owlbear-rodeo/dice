import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  OrbitControls,
  PerformanceMonitor,
  PerspectiveCamera,
} from "@react-three/drei";

import Box from "@mui/material/Box";

import { DiceDialog } from "../controls/DiceDialog";
import { useDiceRollStore } from "../dice/store";
import { InteractiveDiceRoll } from "../dice/InteractiveDiceRoll";
import { DiceRollControls } from "../controls/DiceRollControls";
import environment from "../environment.hdr";
import { DiceSet } from "../types/DiceSet";
import { AudioListenerProvider } from "../audio/AudioListenerProvider";
import { Tray } from "./Tray";
import { useDebugStore } from "../debug/store";
import { TraySuspense } from "./TraySuspense";

/** Dice tray that controls the dice roll store */
export function InteractiveTray({
  dialogOpen,
  onDialogClose,
  dialogSet,
}: {
  dialogOpen: boolean;
  onDialogClose: () => void;
  dialogSet: DiceSet;
}) {
  const startRoll = useDiceRollStore((state) => state.startRoll);

  const allowOrbit = useDebugStore((state) => state.allowOrbit);

  const [dpr, setDpr] = useState(1);

  return (
    <Box
      component="div"
      borderRadius={1}
      height="100vh"
      width="calc(100vh / 2)"
      overflow="hidden"
      position="relative"
    >
      <TraySuspense>
        <Canvas frameloop="demand" dpr={dpr}>
          <PerformanceMonitor
            // Dynamically adjust display pixel ratio (render scale) as the performance changes
            onChange={({ factor }) =>
              setDpr(Math.round((0.5 + 1.5 * factor) * 10) / 10)
            }
          >
            <AudioListenerProvider>
              <Environment files={environment} />
              <ContactShadows
                resolution={256}
                scale={[1, 2]}
                position={[0, 0, 0]}
                blur={0.5}
                opacity={0.5}
                far={1}
                color="#222222"
              />
              <Tray />
              <InteractiveDiceRoll />
              <PerspectiveCamera
                makeDefault
                fov={28}
                position={[0, 4.3, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
              />
              {allowOrbit && <OrbitControls />}
            </AudioListenerProvider>
          </PerformanceMonitor>
        </Canvas>
      </TraySuspense>
      <DiceRollControls />
      <DiceDialog
        diceSet={dialogSet}
        open={dialogOpen}
        onClose={() => onDialogClose()}
        onRoll={(roll) => {
          onDialogClose();
          startRoll(roll);
        }}
      />
    </Box>
  );
}
