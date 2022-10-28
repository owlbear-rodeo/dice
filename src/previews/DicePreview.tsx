import { styled } from "@mui/material/styles";

import { DiceStyle } from "../types/DiceStyle";
import { DiceType } from "../types/DiceType";

import * as galaxyPreviews from "./galaxy";
import * as gemstonePreviews from "./gemstone";
import * as glassPreviews from "./glass";
import * as ironPreviews from "./iron";
import * as nebulaPreviews from "./nebula";
import * as sunrisePreviews from "./sunrise";
import * as sunsetPreviews from "./sunset";
import * as walnutPreviews from "./walnut";

const previews: Record<DiceStyle, Record<DiceType, string>> = {
  GALAXY: galaxyPreviews,
  GEMSTONE: gemstonePreviews,
  GLASS: glassPreviews,
  IRON: ironPreviews,
  NEBULA: nebulaPreviews,
  SUNRISE: sunrisePreviews,
  SUNSET: sunsetPreviews,
  WALNUT: walnutPreviews,
};

interface PreviewImageProps {
  small?: boolean;
}

const PreviewImage = styled("img", {
  shouldForwardProp: (prop) => prop !== "small",
})<PreviewImageProps>(({ small }) => ({
  width: small ? "28px" : "38px",
  height: small ? "28px" : "38px",
}));

type DiePreviewProps = {
  diceType: DiceType;
  diceStyle: DiceStyle;
  small?: boolean;
};

export function DicePreview({ diceType, diceStyle, small }: DiePreviewProps) {
  return (
    <PreviewImage
      src={previews[diceStyle][diceType]}
      alt={`${diceStyle} ${diceType} preview`}
      small={small}
    />
  );
}
