import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { Physics, Debug } from "@react-three/rapier";

import Box from "@mui/material/Box";

import { DiceDialog } from "../controls/DiceDialog";
import { PhysicsTray } from "./PhysicsTray";
import { useDiceRollStore } from "../dice/store";
import { DiceRollFrameloop } from "../dice/DiceRollFrameloop";
import { DiceRoll } from "../dice/DiceRoll";
import { DiceRollControls } from "../controls/DiceRollControls";
import { useDebugControls } from "../helpers/useDebugControls";
import environment from "../environment.hdr";
import { DiceSet } from "../types/DiceSet";
import { AudioListenerProvider } from "../audio/AudioListenerProvider";

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

  const { allowOrbit, allowDebug } = useDebugControls();

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
            <Physics colliders={false}>
              {allowDebug && <Debug />}
              <PhysicsTray />
              <DiceRoll />
            </Physics>
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
