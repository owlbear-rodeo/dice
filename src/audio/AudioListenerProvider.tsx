import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import React, { useContext, useEffect, useState } from "react";

const AudioListenerContext = React.createContext<
  THREE.AudioListener | undefined | null
>(undefined);

export function AudioListenerProvider({
  children,
  volume,
}: {
  children?: React.ReactNode;
  volume: number;
}) {
  const { camera } = useThree();
  const [listener, setListener] = useState<THREE.AudioListener | null>(null);

  useEffect(() => {
    if (listener === null) {
      const createListener = () => {
        setListener(new THREE.AudioListener());
        window.removeEventListener("click", createListener);
      };
      window.addEventListener("click", createListener);
      return () => {
        window.removeEventListener("click", createListener);
      };
    }
  }, [listener]);

  useEffect(() => {
    if (listener) {
      listener.setMasterVolume(volume);
    }
  }, [listener, volume]);

  useEffect(() => {
    if (listener) {
      camera.add(listener);
      return () => {
        camera.remove(listener);
      };
    }
  }, [camera, listener]);

  return (
    <AudioListenerContext.Provider value={listener}>
      {children}
    </AudioListenerContext.Provider>
  );
}

export function useAudioListener() {
  const context = useContext(AudioListenerContext);
  if (context === undefined) {
    throw new Error(
      "useAudioListener must be used within a AudioListenerProvider"
    );
  }
  return context;
}

AudioListenerProvider.defaultProps = {
  volume: 1,
};
