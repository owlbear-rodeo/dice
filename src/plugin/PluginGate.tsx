import OBR from "@owlbear-rodeo/sdk";
import React, { useEffect, useState } from "react";
import { isEmbeded } from "../helpers/isEmbeded";

/**
 * Only render the children when we're within a plugin
 * and that plugin is ready.
 */
export function PluginGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (isEmbeded()) {
      OBR.onReady(() => setReady(true));
    }
  }, []);

  if (ready) {
    return <>{children}</>;
  } else {
    return null;
  }
}
