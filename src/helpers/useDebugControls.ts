import { useEffect, useState } from "react";

export function useDebugControls() {
  const [allowOrbit, setAllowOrbit] = useState(false);
  const [allowDebug, setAllowDebug] = useState(false);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.altKey && event.ctrlKey && event.shiftKey) {
        if (event.code === "KeyD") {
          setAllowDebug((prev) => !prev);
        } else if (event.code === "KeyC") {
          setAllowOrbit((prev) => !prev);
        }
      }
    }

    document.body.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return { allowDebug, allowOrbit };
}
