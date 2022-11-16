import { Canvas } from "@react-three/fiber";
import {
  Environment,
  OrbitControls,
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
        <Canvas frameloop="demand">
          <AudioListenerProvider>
            <Environment files={environment} />
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
