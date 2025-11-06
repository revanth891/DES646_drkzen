
// import { useState, useEffect } from "react";
// import { Loader } from "@react-three/drei";
// import { Leva } from "leva";
// import { Canvas } from "@react-three/fiber";
// import { Experience } from "./components/Experience";
// import { UI } from "./components/UI";
// import { ChatProvider } from "./hooks/useChat";
// import { TranscribeProvider } from "./hooks/useTranscribe";
// import Spline from "@splinetool/react-spline";
// import { Lipsync } from "wawa-lipsync";
// import { ChatOverlay } from "./components/ChatOverlay";

// export const lipsyncManager = new Lipsync();

// function App() {
//   const [selectedModel, setSelectedModel] = useState<"female" | "stylized" | "shiba" | "wawa">("female");
//   const [isLaptop, setIsLaptop] = useState(true);

//   // ✅ Detect screen size for responsive layout
//   useEffect(() => {
//     const checkSize = () => setIsLaptop(window.innerWidth >= 1024);
//     checkSize();
//     window.addEventListener("resize", checkSize);
//     return () => window.removeEventListener("resize", checkSize);
//   }, []);

//   return (
//     <>
//       <Loader />
//       <Leva hidden />
//       <ChatProvider>
//         <TranscribeProvider>
//           {/* UI with model switcher */}
//           <UI setSelectedModel={setSelectedModel} />

//           {isLaptop ? (
//             // 💻 Laptop/Desktop Layout → Spline + Right-side Canvas
//             <>
//               {/* 1. Fullscreen Spline background */}
//               <div
//                 style={{
//                   position: "fixed",
//                   top: 0,
//                   left: 0,
//                   width: "100vw",
//                   height: "100vh",
//                   zIndex: 0,
//                   pointerEvents: "auto",
//                 }}
//               >
//                 <Spline scene="https://prod.spline.design/brVeEJTgiFzKpbGK/scene.splinecode" />
//               </div>

//               {/* 2. Canvas on right side */}
//               <div
//                 style={{
//                   position: "fixed",
//                   top: 0,
//                   left: 0,
//                   width: "100vw",
//                   height: "100vh",
//                   zIndex: 1,
//                   pointerEvents: "none",
//                 }}
//               >
//                 <div
//                   style={{
//                     position: "absolute",
//                     left: "70vw",
//                     top: 0,
//                     width: "30vw",
//                     height: "100vh",
//                     pointerEvents: "auto",
//                   }}
//                 >
//                   <Canvas
//                     shadows
//                     camera={{ fov: 50, near: 0.1, far: 100, position: [0, 0, 10] }}
//                     style={{ background: "transparent" }}
//                   >
//                     <Experience selectedModel={selectedModel} />
//                   </Canvas>
//                   <ChatOverlay />
//                 </div>
//               </div>
//             </>
//           ) : (
//             // 📱 Mobile Layout → Fullscreen Canvas, No Spline
//             <div
//               style={{
//                 position: "fixed",
//                 top: 0,
//                 left: 0,
//                 width: "100vw",
//                 height: "100vh",
//                 zIndex: 0,
//                 pointerEvents: "auto",
//               }}
//             >
//               <Canvas
//                 shadows
//                 camera={{ fov: 50, near: 0.1, far: 100, position: [0, 0, 10] }}
//                 style={{ background: "transparent" }}
//               >
//                 <Experience selectedModel={selectedModel} />
//               </Canvas>
//               <ChatOverlay />
//             </div>
//           )}
//         </TranscribeProvider>
//       </ChatProvider>
//     </>
//   );
// }

// export default App;












import { useState, useEffect } from "react";
import { Loader } from "@react-three/drei";
import { Leva } from "leva";
import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { UI } from "./components/UI";
import { ChatProvider } from "./hooks/useChat";
import { TranscribeProvider } from "./hooks/useTranscribe";
import Spline from "@splinetool/react-spline";
import { Lipsync } from "wawa-lipsync";
import { ChatOverlay } from "./components/ChatOverlay";
import { EmotionDisplay } from "./components/EmotionDisplay";

// 🔊 Lipsync Manager
export const lipsyncManager = new Lipsync();

function App() {
  const [selectedModel, setSelectedModel] = useState<
    "female" | "stylized" | "shiba" | "wawa"
  >("female");

  const [isLaptop, setIsLaptop] = useState(true);

  // ✅ Detect screen size for responsive layout
  useEffect(() => {
    const checkSize = () => setIsLaptop(window.innerWidth >= 1024);
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  // 🔄 Keep Alive Ping for Render
  useEffect(() => {
    const URL = "https://avatargpt-backend.onrender.com/";
    const INTERVAL = 1000 * 60 * 4; // every 4 minutes

    async function ping() {
      try {
        const res = await fetch(URL);
        console.log(
          `[${new Date().toISOString()}] Pinged ${URL} - status ${res.status}`
        );
      } catch (err) {
        console.error(
          `[${new Date().toISOString()}] Error pinging:`,
          (err as Error).message
        );
      }
    }

    ping(); // run once at startup
    const id = setInterval(ping, INTERVAL);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <Loader />
      <Leva hidden />
      <ChatProvider>
        <TranscribeProvider>
          {/* 🎛 UI with model switcher */}
          <UI setSelectedModel={setSelectedModel} />

          {/* Emotion Detection Display */}
          <EmotionDisplay />

          {isLaptop ? (
            // 💻 Laptop/Desktop Layout → Spline + Right-side Canvas
            <>
              {/* 1. Fullscreen Spline background */}
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100vw",
                  height: "100vh",
                  zIndex: 0,
                  pointerEvents: "auto",
                }}
              >
                <Spline scene="https://prod.spline.design/brVeEJTgiFzKpbGK/scene.splinecode" />
              </div>

              {/* 2. Canvas on right side */}
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100vw",
                  height: "100vh",
                  zIndex: 1,
                  pointerEvents: "none",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: "70vw",
                    top: 0,
                    width: "30vw",
                    height: "100vh",
                    pointerEvents: "auto",
                  }}
                >
                  <Canvas
                    shadows
                    camera={{
                      fov: 50,
                      near: 0.1,
                      far: 100,
                      position: [0, 0, 10],
                    }}
                    style={{ background: "transparent" }}
                  >
                    <Experience selectedModel={selectedModel} />
                  </Canvas>
                  <ChatOverlay />
                </div>
              </div>
            </>
          ) : (
            // 📱 Mobile Layout → Fullscreen Canvas, No Spline
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                zIndex: 0,
                pointerEvents: "auto",
              }}
            >
              <Canvas
                shadows
                camera={{
                  fov: 50,
                  near: 0.1,
                  far: 100,
                  position: [0, 0, 10],
                }}
                style={{ background: "transparent" }}
              >
                <Experience selectedModel={selectedModel} />
              </Canvas>
              <ChatOverlay />
            </div>
          )}
        </TranscribeProvider>
      </ChatProvider>
    </>
  );
}

export default App;
