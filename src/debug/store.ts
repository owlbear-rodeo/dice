import create from "zustand";

interface DebugState {
  allowOrbit: boolean;
  allowPhysicsDebug: boolean;
}

export const useDebugStore = create<DebugState>()(() => ({
  allowOrbit: false,
  allowPhysicsDebug: false,
}));

function onKeyDown(event: KeyboardEvent) {
  if (event.altKey && event.ctrlKey && event.shiftKey) {
    if (event.code === "KeyD") {
      useDebugStore.setState((state) => ({
        ...state,
        allowPhysicsDebug: !state.allowPhysicsDebug,
      }));
    } else if (event.code === "KeyC") {
      useDebugStore.setState((state) => ({
        ...state,
        allowOrbit: !state.allowOrbit,
      }));
    }
  }
}

document.body.addEventListener("keydown", onKeyDown);
