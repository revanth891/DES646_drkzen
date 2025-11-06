// import { Loader, OrbitControls, useCamera } from "@react-three/drei";
// import { Canvas } from "@react-three/fiber";
// import { Leva } from "leva";
// import { Experience } from "./components/Experience";
// import { UI } from "./components/UI";
// import { ChatProvider } from "./hooks/useChat";
// import { Lipsync } from "wawa-lipsync";
// import { TranscribeProvider } from "./hooks/useTranscribe";
// import Spline from "@splinetool/react-spline";


// export const lipsyncManager = new Lipsync();

        
// function App() {
//     return (
//         <>
//             <Loader />
//             <Leva hidden/>
//             <ChatProvider>
//                 <TranscribeProvider>
//                     <UI />
//                     <Canvas
//                         shadows
//                         camera={{ fov: 50, near: 0.1, far: 100, position: [0, 0, 10] }}
//                     >
//                         <Experience />
//                         {/* Add OrbitControls with min and max zoom */}
//                         <ambientLight />
//                         {/* <OrbitControls
//                             enableZoom={true}
//                             minDistance={1.5}
//                             maxDistance={10}
//                             position={[0, 0, 2000]}
//                         /> */}
//                     </Canvas>
//                 </TranscribeProvider>
//             </ChatProvider>
//         </>
//     );
// }

// export default App;

// import { Loader } from "@react-three/drei";
// import { Canvas } from "@react-three/fiber";
// import { Leva } from "leva";
// import { Experience } from "./components/Experience";
// import { UI } from "./components/UI";
// import { ChatProvider } from "./hooks/useChat";
// import { Lipsync } from "wawa-lipsync";
// import { TranscribeProvider } from "./hooks/useTranscribe";
// import Spline from "@splinetool/react-spline";

// export const lipsyncManager = new Lipsync();

// function App() {
//   return (
//     <>
//       <Loader />
//       <Leva hidden />
//       <ChatProvider>
//         <TranscribeProvider>
//           <UI />

//           {/* 🌈 Spline scene that stays interactive */}
//           <div
//             style={{
//               width: "100vw",
//               height: "100vh",
//               position: "absolute",
//               top: 0,
//               left: 0,
//               zIndex: 0,
//               pointerEvents: "auto", // important!
//             }}
//           >
//             <Spline
//               scene="https://prod.spline.design/brVeEJTgiFzKpbGK/scene.splinecode"
//               style={{
//                 width: "100%",
//                 height: "100%",
//               }}
//             />
//           </div>

//           {/* 🎮 React Three Fiber canvas on top — with click-through enabled where possible */}
//           <div
//             style={{
//               width: "100vw",
//               height: "100vh",
//               position: "absolute",
//               top: 0,
//               left: 0,
//               zIndex: 0,
//               pointerEvents: "none", // disable events here...
//             }}
//           >
//             <Canvas
//               shadows
//               camera={{ fov: 50, near: 0.1, far: 100, position: [0, 0, 0] }}
//               style={{ pointerEvents: "none" }} // disable pointer events for the canvas
//             >
//               <Experience />
//               <ambientLight />
//             </Canvas>
//           </div>
//         </TranscribeProvider>
//       </ChatProvider>
//     </>
//   );
// }

// export default App;