import { useEffect, useMemo, useState } from "react";

import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";

import ExpandLess from "@mui/icons-material/ExpandLessRounded";

import { DiceSet } from "../types/DiceSet";
import Collapse from "@mui/material/Collapse";
import { useDiceRollStore } from "../dice/store";
import { diceSets } from "../sets/diceSets";
import { useDiceControlsStore } from "./store";

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
  expandable: boolean;
};

export function DiceBar({ expandable }: DiceBarProps) {
  const diceSet = useDiceControlsStore((state) => state.diceSet);
  const changeDiceSet = useDiceControlsStore((state) => state.changeDiceSet);
  const [expanded, setExpanded] = useState(false);
  const [lastSelectedSet, setLastSelectedSet] = useState(diceSets[0]);

  // Collapse bar when a roll has been made
  useEffect(() => {
    if (expanded) {
      // Subscribe straight to the roll store
      return useDiceRollStore.subscribe(() => {
        setExpanded(false);
      });
    }
  }, [expanded]);

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
          {sets.map((set) => (
            <IconButton
              key={set.id}
              aria-label={set.name}
              onClick={() => {
                changeDiceSet(set);
                if (!expandable || expanded) {
                  setLastSelectedSet(set);
                }
              }}
              sx={{
                padding: "4px",
                backgroundColor:
                  diceSet.id === set.id
                    ? "rgba(255, 255, 255, 0.16)"
                    : undefined,
              }}
            >
              <PreviewImage src={set.previewImage} />
            </IconButton>
          ))}
        </Stack>
      </Collapse>
      {expandable && (
        <IconButton onClick={() => setExpanded((prev) => !prev)}>
          <Expand expand={expanded} />
        </IconButton>
      )}
    </Stack>
  );
}
