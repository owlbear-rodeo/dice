import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import Stack from "@mui/material/Stack";

import IncreaseIcon from "@mui/icons-material/AddCircleOutlineRounded";
import DecreaseIcon from "@mui/icons-material/RemoveCircleOutlineRounded";

import { DiceStyle } from "../types/DiceStyle";
import { DiceType } from "../types/DiceType";
import { DicePreview } from "../previews/DicePreview";

type DieCountProps = {
  count: number;
  diceStyle: DiceStyle;
  diceType: DiceType;
  onChange: (count: number) => void;
  onIncrease: () => void;
  onDecrease: () => void;
};

export function DieCount({
  count,
  diceStyle,
  diceType,
  onChange,
  onIncrease,
  onDecrease,
}: DieCountProps) {
  return (
    <ListItem disablePadding>
      <ListItemButton sx={{ cursor: "inherit" }}>
        <ListItemIcon sx={{ minWidth: "38px" }}>
          <DicePreview diceStyle={diceStyle} diceType={diceType} />
        </ListItemIcon>
        <ListItemText sx={{ marginRight: "88px" }}>
          <Input
            disableUnderline
            inputProps={{
              sx: {
                textAlign: "center",
              },
            }}
            value={`${count}`}
            onChange={(e) => {
              const newCount = parseInt(e.target.value);
              if (!isNaN(newCount)) {
                onChange(newCount);
              } else {
                onChange(0);
              }
            }}
            fullWidth
          />
        </ListItemText>
        <ListItemSecondaryAction>
          <Stack gap={1} direction="row">
            <IconButton
              aria-label="decrease count"
              disabled={count <= 0}
              onClick={() => onDecrease()}
            >
              <DecreaseIcon />
            </IconButton>
            <IconButton
              aria-label="increase count"
              onClick={() => onIncrease()}
            >
              <IncreaseIcon />
            </IconButton>
          </Stack>
        </ListItemSecondaryAction>
      </ListItemButton>
    </ListItem>
  );
}
