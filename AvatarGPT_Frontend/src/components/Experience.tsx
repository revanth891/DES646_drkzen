// import { Avatar } from "./Avatar_Female.tsx";
// // import { Avatar } from "./Avatar_Stylized.tsx";
// // import { Avatar } from "./Avatar_Stylized_New.tsx";
// // import { Avatar } from "./Avatar_Wawa.tsx";
// // import { Avatar } from "./Avatar_Shiba.tsx";
// // import { Avatar } from "./Avatar_Wawa Stylized.tsx";
// // import { Avatar } from "./Avatar.tsx";
// import {
//   CameraControls,
//   ContactShadows,
//   Environment,
//   Float,
//   Text,
// } from "@react-three/drei";
// import { Suspense, useEffect, useRef, useState } from "react";
// import { useChat } from "../hooks/useChat";
// import { useTranscribe } from "../hooks/useTranscribe";
// import * as THREE from "three";



// interface DotsProps {
//   [key: string]: any;
// }

// const Dots = (props: DotsProps) => {
//   const { loading: chatLoading } = useChat();
//   const { loading: transcribeLoading } = useTranscribe();
//   const loading = chatLoading || transcribeLoading;

//   const [loadingText, setLoadingText] = useState<string>("");

//   useEffect(() => {
//     if (loading) {
//       const interval = setInterval(() => {
//         setLoadingText((dots) => (dots.length >= 3 ? "." : dots + "."));
//       }, 500);
//       return () => clearInterval(interval);
//     } else {
//       setLoadingText("");
//     }
//   }, [loading]);

//   if (!loading) return null;

//   return (
//     <group {...props}>
//       <Float speed={2} floatIntensity={0.1} rotationIntensity={0}>
//         <Text
//           fontSize={0.12}
//           maxWidth={1}
//           anchorX="center"
//           anchorY="middle"
//           outlineColor="#000"
//           outlineWidth={0.002}
//           color="black"
//           position-y={0.2}
//         >
//           {loadingText}
//         </Text>
//       </Float>
//     </group>
//   );
// };

// export const Experience = () => {
//   const cameraControls = useRef<CameraControls | null>(null);
//   const { cameraState: chatCameraState } = useChat();
//   const { cameraState: transcribeCameraState } = useTranscribe();

//   const cameraState = chatCameraState || transcribeCameraState;

//   useEffect(() => {
//     if (!cameraControls.current) return;
//     // Keep camera at a fixed distance and centered on avatar
//     cameraControls.current.setLookAt(0, 1.2, 2.5, 0, 1.2, 0, true);
//   }, []);

//   useEffect(() => {
//     if (!cameraControls.current) return;

//     switch (cameraState) {
//       case "zoomed":
//         cameraControls.current.setLookAt(0, 1.2, 2.0, 0, 1.2, 0, true);
//         break;
//       case "default":
//         cameraControls.current.setLookAt(0, 1.2, 2.5, 0, 1.2, 0, true);
//         break;
//       case "zoomeout":
//         cameraControls.current.setLookAt(0, 1.2, 3.5, 0, 1.2, 0, true);
//         break;
//       default:
//         cameraControls.current.setLookAt(0, 1.2, 2.5, 0, 1.2, 0, true);
//         break;
//     }
//   }, [cameraState]);

//   return (
//     <>
//       <CameraControls
//   ref={cameraControls}
//   minDistance={2}
//   maxDistance={2}
//   dollySpeed={0}
//   truckSpeed={0}
//   // Prevent vertical rotation
//   maxPolarAngle={Math.PI / 2}
//   minPolarAngle={Math.PI / 2}
// />


//       <Environment preset="sunset" />

//       <spotLight
//         position={[2, 5, 2]}
//         angle={0.3}
//         penumbra={0.5}
//         intensity={1}
//         castShadow
//         shadow-mapSize-width={1024}
//         shadow-mapSize-height={1024}
//       />

//       <Suspense>
//         <Float speed={1.5} floatIntensity={0.1} rotationIntensity={0.1}>
//           <group scale={1.2} position={[0, 0, 0]}>
//             <Avatar />
//           </group>
//         </Float>
//       </Suspense>

//       <Suspense fallback={null}>
//         <Dots position={[0, 2.1, 0]} />
//       </Suspense>

//       <ContactShadows
//         position={[0, 0, 0]}
//         opacity={0.6}
//         scale={5}
//         blur={2.5}
//         far={1}
//       />
//     </>
//   );
// };






import { Suspense, useEffect, useRef } from "react";
import { useChat } from "../hooks/useChat";
import { useTranscribe } from "../hooks/useTranscribe";
import * as THREE from "three";
import {
  CameraControls,
  ContactShadows,
  Environment,
  Float,
} from "@react-three/drei";

// Import all avatars
import { Avatar as Avatar_Female } from "./Avatar_Female.tsx";
import { Avatar as Avatar_Stylized } from "./Avatar_Wawa Stylized.tsx";
import { Avatar as Avatar_Shiba } from "./Avatar_Shiba.tsx";
import { Avatar as Avatar_Wawa } from "./Avatar_Wawa.tsx";

// Map avatar keys to components
const avatarMap: Record<string, React.FC> = {
  stylized: Avatar_Stylized,
  female: Avatar_Female,
  shiba: Avatar_Shiba,
  wawa: Avatar_Wawa,
};

// Predefined camera positions (position + target)
const cameraPositions: Record<
  "default" | "zoomed" | "zoomout" | "sideLeft" | "side" | "closeUp",
  { position: [number, number, number]; target: [number, number, number] }
> = {
  default: { position: [0, 1.2, 2.5], target: [0, 1.2, 0] },
  zoomed: { position: [0, 1.7, 1.2], target: [0, 1.7, 0] },
  zoomout: { position: [0, 1.2, 3.5], target: [0, 1.2, 0] },
  sideLeft: { position: [-1.5, 1.3, 2.5], target: [0, 1.2, 0] },
  side: { position: [1.5, 1.3, 2.5], target: [0, 1.2, 0] },
  closeUp: { position: [0, 1.5, 1.2], target: [0, 1.4, 0] },
};

export const Experience = ({
  selectedModel,
  cameraState: externalCameraState,
}: {
  selectedModel: string;
  cameraState?: keyof typeof cameraPositions;
}) => {
  const cameraControls = useRef<CameraControls | null>(null);

  const { cameraState: chatCameraState } = useChat();
  const { cameraState: transcribeCameraState } = useTranscribe();

  const activeCameraState =
    externalCameraState || chatCameraState || transcribeCameraState || "default";

  // Pick avatar component
  const AvatarComponent = avatarMap[selectedModel] || Avatar_Stylized;

  // Initial setup
  useEffect(() => {
    if (!cameraControls.current) return;
    const { position, target } = cameraPositions.default;
    cameraControls.current.setLookAt(
      ...position,
      ...target,
      true
    );
  }, []);

  // Smooth camera transitions
  useEffect(() => {
    if (!cameraControls.current) return;
    const state = cameraPositions[activeCameraState as keyof typeof cameraPositions];
    if (!state) return;

    cameraControls.current.setLookAt(
      ...state.position,
      ...state.target,
      true
    );
  }, [activeCameraState]);

  return (
    <>
      {/* Camera Controls */}
      <CameraControls
        ref={cameraControls}
        minDistance={1}
        maxDistance={5}
        dollySpeed={0}
        truckSpeed={0}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
        smoothTime={0.8} // smoother transitions
      />

      {/* Lighting & Env */}
      <Environment preset="sunset" />
      <spotLight
        position={[2, 5, 2]}
        angle={0.3}
        penumbra={0.5}
        intensity={1}
        castShadow
      />

      {/* Avatar */}
      <Suspense>
        <Float speed={1.5} floatIntensity={0.1} rotationIntensity={0.1}>
          <group scale={1.2} position={[0, 0, 0]}>
            <AvatarComponent />
          </group>
        </Float>
      </Suspense>

      {/* Shadows */}
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

