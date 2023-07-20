import { Suspense } from "react";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

export function TraySuspense({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <Backdrop open sx={{ position: "absolute", zIndex: 1 }}>
          <CircularProgress size="3rem" />
        </Backdrop>
      }
    >
      {children}
    </Suspense>
  );
}
