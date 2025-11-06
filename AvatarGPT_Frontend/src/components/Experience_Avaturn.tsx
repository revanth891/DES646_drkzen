import { Avatar } from "./Avaturn_Integrated.tsx";
// src/components/Experience.tsx
import {
  CameraControls,
  ContactShadows,
  Environment,
  Float,
  Text,
} from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import { useChat } from "../hooks/useChat";
import { useTranscribe } from "../hooks/useTranscribe";
import * as THREE from "three";

interface DotsProps {
  [key: string]: any;
}

const Dots = (props: DotsProps) => {
  const { loading: chatLoading } = useChat();
  const { loading: transcribeLoading } = useTranscribe();
  const loading = chatLoading || transcribeLoading;

  const [loadingText, setLoadingText] = useState<string>("");

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingText((dots) => (dots.length >= 3 ? "." : dots + "."));
      }, 500);
      return () => clearInterval(interval);
    } else {
      setLoadingText("");
    }
  }, [loading]);

  if (!loading) return null;

  return (
    <group {...props}>
      <Float speed={2} floatIntensity={0.1} rotationIntensity={0}>
        <Text
          fontSize={0.12}
          maxWidth={1}
          anchorX="center"
          anchorY="middle"
          outlineColor="#000"
          outlineWidth={0.002}
          color="black"
          position-y={0.2}
        >
          {loadingText}
        </Text>
      </Float>
    </group>
  );
};

interface ExperienceProps {
  modelUrl: string;
}

export const Experience = ({ modelUrl }: ExperienceProps) => {
  const cameraControls = useRef<CameraControls | null>(null);
  const { cameraState: chatCameraState } = useChat();
  const { cameraState: transcribeCameraState } = useTranscribe();

  const cameraState = chatCameraState || transcribeCameraState;

  useEffect(() => {
    if (!cameraControls.current) return;
    cameraControls.current.setLookAt(0, 1.2, 2.5, 0, 1.2, 0, true);
  }, []);

  useEffect(() => {
    if (!cameraControls.current) return;

    switch (cameraState) {
      case "zoomed":
        cameraControls.current.setLookAt(0, 1.2, 2.0, 0, 1.2, 0, true);
        break;
      case "default":
        cameraControls.current.setLookAt(0, 1.2, 2.5, 0, 1.2, 0, true);
        break;
      case "zoomeout":
        cameraControls.current.setLookAt(0, 1.2, 3.5, 0, 1.2, 0, true);
        break;
      default:
        cameraControls.current.setLookAt(0, 1.2, 2.5, 0, 1.2, 0, true);
        break;
    }
  }, [cameraState]);

  return (
    <>
      <CameraControls
        ref={cameraControls}
        minDistance={2}
        maxDistance={2}
        dollySpeed={0}
        truckSpeed={0}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
      />

      <Environment preset="sunset" />

      <spotLight
        position={[2, 5, 2]}
        angle={0.3}
        penumbra={0.5}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      <Suspense>
        <Float speed={1.5} floatIntensity={0.1} rotationIntensity={0.1}>
          <group scale={1.2} position={[0, 0, 0]}>
            <Avatar modelUrl={modelUrl} />
          </group>
        </Float>
      </Suspense>

      <Suspense fallback={null}>
        <Dots position={[0, 2.1, 0]} />
      </Suspense>

      <ContactShadows
        position={[0, 0, 0]}
        opacity={0.6}
        scale={5}
        blur={2.5}
        far={1}
      />
    </>
  );
};
