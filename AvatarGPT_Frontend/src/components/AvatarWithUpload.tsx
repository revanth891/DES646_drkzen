// src/components/AvatarWithUpload.tsx
import { Canvas } from "@react-three/fiber";
import React, { useEffect, useState } from "react";
import { Avatar } from "./Avatar";
import AvaturnPanel from "./AvaturnPanel";

export default function AvatarWithUpload() {
  const [modelUrl, setModelUrl] = useState("/models/model.glb"); // default avatar

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <AvaturnPanel onAvatarExport={(url) => setModelUrl(url)} />
      <Canvas camera={{ position: [0, 1.5, 2.5], fov: 35 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Avatar modelUrl={modelUrl} />
      </Canvas>
    </div>
  );
}
