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

import { DicePreview } from "../previews/DicePreview";
import { Die } from "../types/Die";

type DieCountProps = {
  count: number;
  die: Die;
  onChange: (id: string, count: number) => void;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
};

export function DieCount({
  count,
  die,
  onChange,
  onIncrease,
  onDecrease,
}: DieCountProps) {
  return (
    <ListItem disablePadding>
      <ListItemButton sx={{ cursor: "inherit" }}>
        <ListItemIcon sx={{ minWidth: "38px" }}>
          <DicePreview diceStyle={die.style} diceType={die.type} />
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
                onChange(die.id, newCount);
              } else {
                onChange(die.id, 0);
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
              onClick={() => onDecrease(die.id)}
            >
              <DecreaseIcon />
            </IconButton>
            <IconButton
              aria-label="increase count"
              onClick={() => onIncrease(die.id)}
            >
              <IncreaseIcon />
            </IconButton>
          </Stack>
        </ListItemSecondaryAction>
      </ListItemButton>
    </ListItem>
  );
}
