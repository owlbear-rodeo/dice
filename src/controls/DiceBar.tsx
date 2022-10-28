import { useEffect, useMemo, useState } from "react";

import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";

import ExpandLess from "@mui/icons-material/ExpandLessRounded";

import { DiceSet } from "../types/DiceSet";
import Collapse from "@mui/material/Collapse";
import { useDiceRollStore } from "../dice/store";

const PreviewImage = styled("img")({
  width: "32px",
  height: "32px",
});

const Expand = styled(ExpandLess, {
  shouldForwardProp: (prop) => prop !== "expand",
})<{ expand: boolean }>(({ theme, expand }) => ({
  transform: `rotate(${expand ? "0deg" : "180deg"})`,
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

type DiceBarProps = {
  diceSets: DiceSet[];
  onOpen: (set: DiceSet) => void;
  expandable: boolean;
};

export function DiceBar({ diceSets, onOpen, expandable }: DiceBarProps) {
  const [expanded, setExapnded] = useState(false);
  const [lastSelectedSet, setLastSelectedSet] = useState(diceSets[0]);

  // Collapse bar when a roll has been made
  const roll = useDiceRollStore((state) => state.roll);
  useEffect(() => {
    setExapnded(false);
  }, [roll]);

  // Reorder dice sets if we need
  const sets = useMemo(() => {
    if (!expandable || expanded) {
      return diceSets;
    } else {
      // If collapsed reindex so the last selected dice is first
      const index = diceSets.findIndex((set) => set.id === lastSelectedSet.id);
      const sets: DiceSet[] = [];
      for (let i = 0; i < diceSets.length; i++) {
        sets.push(diceSets[(i + index) % diceSets.length]); //(i + index) % diceSets.length];
      }
      return sets;
    }
  }, [diceSets, lastSelectedSet, expandable, expanded]);

  return (
    <Stack gap={1} alignItems="center">
      <Collapse in={!expandable || expanded} collapsedSize={88}>
        <Stack gap={1} alignItems="center">
          {sets.map((diceSet) => (
            <IconButton
              key={diceSet.id}
              aria-label={diceSet.name}
              onClick={() => {
                onOpen(diceSet);
                if (!expandable || expanded) {
                  setLastSelectedSet(diceSet);
                }
              }}
              sx={{ padding: "4px" }}
            >
              <PreviewImage src={diceSet.previewImage} />
            </IconButton>
          ))}
        </Stack>
      </Collapse>
      {expandable && (
        <IconButton onClick={() => setExapnded((prev) => !prev)}>
          <Expand expand={expanded} />
        </IconButton>
      )}
    </Stack>
  );
}
