import { Player } from "owlbear-rodeo-sdk";
import { useRef } from "react";
import { Dice } from "../dice/Dice";
import { getDieFromDice } from "../helpers/getDieFromDice";
import { useDiceInteraction } from "./useDiceInteraction";
import { usePlayerDice } from "./usePlayerDice";

export function PlayerDice({ player }: { player?: Player }) {
  const { diceRoll, rollTransforms } = usePlayerDice(player);

  const parentRef = useRef<THREE.Group>(null);

  useDiceInteraction(player, parentRef.current);

  return (
    <group ref={parentRef}>
      {diceRoll &&
        getDieFromDice(diceRoll).map((die) => {
          const transform = rollTransforms?.[die.id];
          const p = transform?.position;
          const r = transform?.rotation;
          return (
            <Dice
              userData={{ dieId: die.id }}
              key={die.id}
              die={die}
              position={p ? [p.x, p.y, p.z] : [0, -100, 0]} // Put dice out of frame to start with
              quaternion={r && [r.x, r.y, r.z, r.w]}
            />
          );
        })}
    </group>
  );
}
