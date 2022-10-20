import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { Physics, Debug } from "@react-three/rapier";

import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

import { DiceDialog } from "./controls/DiceDialog";
import { DiceBar } from "./controls/DiceBar";
import { PhysicsTray } from "./tray/PhysicsTray";
import { useDiceRollStore } from "./dice/store";
import { DiceRollFrameloop } from "./dice/DiceRollFrameloop";
import { DiceRoll } from "./dice/DiceRoll";
import { DiceRollControls } from "./controls/DiceRollControls";
import { useDebugControls } from "./helpers/useDebugControls";
import environment from "./environment.hdr";
import { DiceSet } from "./types/DiceSet";
import { diceSets } from "./sets/diceSets";
import { AudioListenerProvider } from "./audio/AudioListenerProvider";

export function App() {
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogSet, setOpenDialogSet] = useState<DiceSet>(diceSets[0]);
  const startRoll = useDiceRollStore((state) => state.startRoll);

  const { allowOrbit, allowDebug } = useDebugControls();

  return (
    <Container disableGutters maxWidth="sm">
      <Stack sx={{ height: "100vh" }}>
        <DiceBar
          diceSets={diceSets}
          onOpen={(set) => {
            setOpenDialogSet(set);
            setOpenDialog(true);
          }}
        />
        <Box
          component="div"
          borderRadius={1}
          width="100%"
          height="100%"
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
                <DiceRollFrameloop />
                <Physics colliders={false} timeStep="vary">
                  {allowDebug && <Debug />}
                  <DiceRoll />
                  <PhysicsTray />
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
        </Box>
      </Stack>
      <DiceDialog
        diceSet={openDialogSet}
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onRoll={(roll) => {
          setOpenDialog(false);
          startRoll(roll);
        }}
      />
    </Container>
  );
}
