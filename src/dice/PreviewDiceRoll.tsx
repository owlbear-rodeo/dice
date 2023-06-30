import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";

import { getDiceToRoll, useDiceControlsStore } from "../controls/store";
import { DiceType } from "../types/DiceType";
import { getDieFromDice } from "../helpers/getDieFromDice";
import { DiceRoll } from "../types/DiceRoll";
import { Dice } from "./Dice";
import { DiceThrower } from "../helpers/DiceThrower";
import { DiceVector3 } from "../types/DiceVector3";
import { DiceQuaternion } from "../types/DiceQuaternion";
import { Die } from "../types/Die";
import { useAudioListener } from "../audio/AudioListenerProvider";
import { getNextBuffer } from "../audio/getAudioBuffer";
import { random } from "../helpers/random";
import { WeightClass } from "../types/WeightClass";

export function PreviewDiceRoll() {
  const counts = useDiceControlsStore((state) => state.diceCounts);
  const advantage = useDiceControlsStore((state) => state.diceAdvantage);
  const diceById = useDiceControlsStore((state) => state.diceById);
  const defaultDiceCounts = useDiceControlsStore(
    (state) => state.defaultDiceCounts
  );

  const diceRoll = useMemo<DiceRoll>(() => {
    return { dice: getDiceToRoll(counts, advantage, diceById) };
  }, [counts, advantage, diceById]);

  const dice = useMemo(() => getDieFromDice(diceRoll), [diceRoll]);

  const [diceThrower] = useState(() => new DiceThrower());
  const isDefault = useMemo(
    () =>
      Object.entries(defaultDiceCounts).every(
        ([type, count]) => counts[type as DiceType] === count
      ),
    [counts, defaultDiceCounts]
  );
  useEffect(() => {
    if (isDefault) {
      diceThrower.clearHistory();
    }
  }, [isDefault, diceThrower]);

  // Track how long the roll button is pressed
  // so we can increase the animation speed
  const rollPressTime = useDiceControlsStore(
    (state) => state.diceRollPressTime
  );

  const groupRef = useRef<THREE.Group>(null);
  const listener = useAudioListener();

  const diceWeight = useMemo<WeightClass>(() => {
    if (dice.length > 0 && dice[0].style === "IRON") {
      return "HEAVY";
    } else {
      return "MEDIUM";
    }
  }, [dice]);

  // Play a roll sound when the dice button is in focus
  useEffect(() => {
    const group = groupRef.current;
    if (group && rollPressTime) {
      let sound: THREE.PositionalAudio | undefined = undefined;
      // Wait 300 ms so that the shake sound only plays after holding focus
      // on the roll button
      const timeout = setTimeout(() => {
        const buffer = getNextBuffer(diceWeight, "SHAKE");
        if (buffer && listener) {
          sound = new THREE.PositionalAudio(listener);
          sound.setBuffer(buffer);
          sound.setRefDistance(3);
          const volume =
            diceWeight === "HEAVY" ? random(0.9, 1.1) : random(0.5, 0.6);
          sound.setVolume(volume);
          const playback =
            diceWeight === "HEAVY" ? random(0.9, 1.1) : random(0.7, 0.9);
          sound.setPlaybackRate(playback);
          sound.play();
          sound.setLoop(true);
          group.add(sound);
        }
      }, 300);
      return () => {
        clearTimeout(timeout);
        if (sound) {
          sound.stop();
          group.remove(sound);
        }
      };
    }
  }, [rollPressTime, listener, diceWeight]);

  return (
    <group ref={groupRef} position={[0, -0.8, 0]}>
      {dice.map((die, index) => {
        const dieThrow = diceThrower.getDiceThrow(index);
        const p = dieThrow.position;
        const r = dieThrow.rotation;
        return (
          <AnimatedDice
            key={index}
            die={die}
            p={p}
            r={r}
            rollPressTime={rollPressTime}
          />
        );
      })}
    </group>
  );
}

function AnimatedDice({
  die,
  p,
  r,
  rollPressTime,
}: {
  die: Die;
  p: DiceVector3;
  r: DiceQuaternion;
  rollPressTime: number | null;
}) {
  const { invalidate } = useThree();

  const groupRef = useRef<THREE.Group>(null);
  const diceRef = useRef<THREE.Group>(null);

  const [seed] = useState(() => Math.random());

  const animationTimeRef = useRef(0);
  useFrame((_, delta) => {
    const group = groupRef.current;
    const dice = diceRef.current;
    if (dice && group) {
      // Calculate speed up
      let speedAlpha = 0;
      if (rollPressTime) {
        const activeTimeSeconds = (performance.now() - rollPressTime) / 1000;
        speedAlpha = Math.min(activeTimeSeconds / 5, 1);
      }
      // Advance animation time
      const timeSpeed = lerp(1, 3, speedAlpha);
      animationTimeRef.current += delta * timeSpeed;
      const t = animationTimeRef.current;

      // Offset waves
      const offset = seed * 5;

      // Apply animation
      const rotAmplitude = lerp(1 / 50, 1 / 35, speedAlpha);
      const rotWave = Math.sin(t * 20 + offset);
      dice.rotation.y = rotWave * rotAmplitude * Math.PI;
      const posAmplitude = lerp(1 / 100, 1 / 80, speedAlpha);
      const posWave = Math.cos(t * 10 + offset);
      group.position.z = posWave * posAmplitude;
      if (dice.scale.x < 1) {
        dice.scale.setScalar(Math.min(dice.scale.x + delta * 5, 1));
      }

      invalidate();
    }
  });

  return (
    <group ref={diceRef} position={[p.x, p.y, p.z]} scale={0}>
      <group ref={groupRef}>
        <Dice
          userData={{ dieId: die.id }}
          die={die}
          quaternion={[r.x, r.y, r.z, r.w]}
        />
      </group>
    </group>
  );
}

function lerp(from: number, to: number, alpha: number): number {
  return from * (1 - alpha) + to * alpha;
}
