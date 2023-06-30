import { Player } from "@owlbear-rodeo/sdk";

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import { useTheme } from "@mui/material/styles";

import { usePlayerDice } from "./usePlayerDice";

export function PlayerAvatar({
  player,
  onSelect,
}: {
  player: Player;
  onSelect: () => void;
}) {
  const { finalValue, finishedRolling } = usePlayerDice(player);

  const theme = useTheme();

  return (
    <Stack alignItems="center" my={0.5}>
      <Badge
        badgeContent={finishedRolling ? finalValue : null}
        showZero
        overlap="circular"
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        sx={{
          ".MuiBadge-badge": {
            bgcolor: "background.paper",
          },
          pointerEvents: "none",
        }}
        max={999}
      >
        <IconButton
          sx={{ borderRadius: "20px", p: 0, pointerEvents: "all" }}
          onClick={() => onSelect()}
        >
          <Avatar
            sx={{
              bgcolor: player.color,
              opacity: "0.5",
              boxShadow: theme.shadows[5],
              width: 32,
              height: 32,
            }}
          >
            {player.name[0]}
          </Avatar>
        </IconButton>
      </Badge>
      <Typography
        variant="caption"
        color="rgba(255, 255, 255, 0.7)"
        textAlign="center"
        width="40px"
        noWrap
      >
        {player.name}
      </Typography>
    </Stack>
  );
}
