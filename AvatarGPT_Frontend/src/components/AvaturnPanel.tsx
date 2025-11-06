// src/components/AvaturnPanel.tsx
import React, { useEffect } from "react";

interface AvaturnPanelProps {
  onAvatarExport: (glbUrl: string) => void;
}

declare global {
  interface Window {
    AvaturnSDK: any;
  }
}

const AvaturnPanel: React.FC<AvaturnPanelProps> = ({ onAvatarExport }) => {
  useEffect(() => {
    const loadScript = async () => {
      if (!window.AvaturnSDK) {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/@avaturn/sdk";
        script.async = true;
        script.onload = initAvaturn;
        document.body.appendChild(script);
      } else {
        initAvaturn();
      }
    };

    const initAvaturn = async () => {
      const container = document.getElementById("avaturn-sdk-container");
      const sdk = new window.AvaturnSDK();
      await sdk.init(container, { url: "https://demo.avaturn.dev" });

      sdk.on("export", (data: any) => {
        console.log("Avatar GLB URL:", data.url);
        onAvatarExport(data.url);
        container!.style.display = "none";
      });
    };

    loadScript();
  }, [onAvatarExport]);

  return (
    <div>
      <button onClick={() => (document.getElementById("avaturn-sdk-container")!.style.display = "block")}>
        Customize Avatar
      </button>
      <div
        id="avaturn-sdk-container"
        style={{
          display: "none",
          position: "absolute",
          top: 50,
          left: 50,
          width: "90vw",
          height: "90vh",
          zIndex: 1000,
          backgroundColor: "white",
        }}
      />
    </div>
  );
};

export default AvaturnPanel;
