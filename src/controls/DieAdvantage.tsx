import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

type DieAdvantageProps = {
  advantage?: "ADVANTAGE" | "DISADVANTAGE" | null;
  onChange: (advantage: "ADVANTAGE" | "DISADVANTAGE" | null) => void;
};

export function DieAdvantage({ advantage, onChange }: DieAdvantageProps) {
  return (
    <ToggleButtonGroup
      color="primary"
      value={advantage}
      exclusive
      onChange={(_, value) => {
        onChange(value);
      }}
      aria-label="Advantage / Disadvantage"
      fullWidth
      sx={{
        borderRadius: 0,
        py: 1,
        ".MuiToggleButton-root": { borderRadius: 0 },
      }}
    >
      <ToggleButton
        value="DISADVANTAGE"
        sx={{ borderWidth: 0, borderRightWidth: 1 }}
      >
        Dis
      </ToggleButton>
      <ToggleButton value="ADVANTAGE" sx={{ border: 0 }}>
        Adv
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
