import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";

import Box from "@mui/material/Box";

import { DiceDialog } from "../controls/DiceDialog";
import { useDiceRollStore } from "../dice/store";
import { InteractiveDiceRoll } from "../dice/InteractiveDiceRoll";
import { DiceRollControls } from "../controls/DiceRollControls";
import { useDebugControls } from "../helpers/useDebugControls";
import environment from "../environment.hdr";
import { DiceSet } from "../types/DiceSet";
import { AudioListenerProvider } from "../audio/AudioListenerProvider";
import { Tray } from "./Tray";

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

  const { allowOrbit } = useDebugControls();

  return (
    <Box
      component="div"
      borderRadius={1}
      height="100vh"
      width="calc(100vh / 2)"
      overflow="hidden"
      position="relative"
    >
      <Canvas frameloop="demand">
        <Suspense fallback={null}>
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
        </Suspense>
      </Canvas>
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
