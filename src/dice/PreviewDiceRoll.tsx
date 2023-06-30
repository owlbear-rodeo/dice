import { useEffect, useMemo, useRef, useState } from "react";
import { getDiceToRoll, useDiceControlsStore } from "../controls/store";
import { DiceType } from "../types/DiceType";
import { getDieFromDice } from "../helpers/getDieFromDice";
import { DiceRoll } from "../types/DiceRoll";
import { Dice } from "./Dice";
import { DiceThrower } from "../helpers/DiceThrower";
import { DiceVector3 } from "../types/DiceVector3";
import { DiceQuaternion } from "../types/DiceQuaternion";

import { useFrame, useThree } from "@react-three/fiber";
import { Die } from "../types/Die";

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

  // When the dice roll button is focused
  // start a timer to increase the animation speed
  const [rollFocusTime, setRollFocusTime] = useState<number | null>(null);
  useEffect(() => {
    let target: HTMLElement | undefined = undefined;
    const handleFocus = (e: FocusEvent) => {
      if (
        e.target instanceof HTMLElement &&
        e.target.id.startsWith("dice-roll-button")
      ) {
        target = e.target;
        setRollFocusTime(performance.now());
        target.addEventListener("blur", handleBlur);
      }
    };

    const handleBlur = () => {
      setRollFocusTime(null);
      target?.removeEventListener("blur", handleBlur);
    };

    document.addEventListener("focusin", handleFocus);
    return () => {
      document.removeEventListener("focusin", handleFocus);
      target?.removeEventListener("blur", handleBlur);
    };
  }, []);

  return (
    <group position={[0, -1, 0]}>
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
            rollFocusTime={rollFocusTime}
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
  rollFocusTime,
}: {
  die: Die;
  p: DiceVector3;
  r: DiceQuaternion;
  rollFocusTime: number | null;
}) {
  const { invalidate } = useThree();

  const groupRef = useRef<THREE.Group>(null);
  const diceRef = useRef<THREE.Group>(null);

  const [seed] = useState(() => Math.random());

  let tRef = useRef(0);
  useFrame((_, delta) => {
    const group = groupRef.current;
    const dice = diceRef.current;
    if (dice && group) {
      let speedAlpha = 0;
      if (rollFocusTime) {
        const activeTimeSeconds = (performance.now() - rollFocusTime) / 1000;
        speedAlpha = Math.min(activeTimeSeconds / 5, 1);
      }
      const timeSpeed = lerp(1, 3, speedAlpha);
      tRef.current += delta * timeSpeed;
      const t = tRef.current;

      // Offset waves
      const offset = seed * 5;

      const rotAmplitude = lerp(50, 35, speedAlpha);
      dice.rotation.y = (Math.sin(t * 20 + offset) / rotAmplitude) * Math.PI;

      const posAmplitude = lerp(100, 80, speedAlpha);
      group.position.z = Math.cos(t * 10 + offset) / posAmplitude;

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
