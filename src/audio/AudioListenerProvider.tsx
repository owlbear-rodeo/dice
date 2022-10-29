import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import React, { useContext, useEffect, useState } from "react";

const AudioListenerContext = React.createContext<
  THREE.AudioListener | undefined
>(undefined);

export function AudioListenerProvider({
  children,
  volume,
}: {
  children?: React.ReactNode;
  volume: number;
}) {
  const { camera } = useThree();
  const [listener] = useState(() => new THREE.AudioListener());

  useEffect(() => {
    listener.setMasterVolume(volume);
  }, [listener, volume]);

  useEffect(() => {
    camera.add(listener);
    return () => {
      camera.remove(listener);
    };
  }, [camera]);

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
