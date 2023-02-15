import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";

import DiceSetsIcon from "@mui/icons-material/WidgetsRounded";

import { diceSets } from "../sets/diceSets";
import { DiceSet } from "../types/DiceSet";

const DiceSetImage = styled("img")({
  width: "100%",
  height: "100%",
});

export function DiceSetsDialog({
  onChange,
}: {
  onChange: (diceSet: DiceSet) => void;
}) {
  const [open, setOpen] = useState(false);

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  return (
    <>
      <Tooltip title="Dice Set" disableInteractive>
        <IconButton onClick={handleClickOpen} sx={{ width: "40px" }}>
          <DiceSetsIcon />
        </IconButton>
      </Tooltip>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Dice Set</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {diceSets.map((diceSet) => (
              <Grid item xs={4} md={8} key={diceSet.id}>
                <IconButton
                  onClick={() => {
                    onChange(diceSet);
                    handleClose();
                  }}
                >
                  <DiceSetImage
                    src={diceSet.previewImage}
                    alt={diceSet.name}
                    loading="lazy"
                  />
                </IconButton>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
}
