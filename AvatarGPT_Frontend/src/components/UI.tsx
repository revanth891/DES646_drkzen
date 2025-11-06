
// import { useRef, useState, useEffect } from "react";
// import { useChat } from "../hooks/useChat";
// import { useTranscribe } from "../hooks/useTranscribe";
// import {
//   ZoomIn,
//   ZoomOut,
//   RotateCcw,
//   User,
//   Palette,
//   Dog,
//   Camera,
//   MessageSquareText,
//   Mic,
//   Send,
//   Moon,
//   Sun,
// } from "lucide-react";

// export const UI = ({
//   hidden,
//   setSelectedModel,
// }: {
//   hidden?: boolean;
//   setSelectedModel: (m: string) => void;
// }) => {
//   const input = useRef<HTMLInputElement>(null);
//   const {
//     chat,
//     loading: chatLoading,
//     setCameraState: setChatCameraState,
//     message: chatMessage,
//   } = useChat();
//   const {
//     transcribe,
//     loading: transcribeLoading,
//     setCameraState: setTranscribeCameraState,
//     message: transcribeMessage,
//   } = useTranscribe();

//   const [mode, setMode] = useState<"text" | "voice">("text");
//   const [darkMode, setDarkMode] = useState(true);
//   const [isRecording, setIsRecording] = useState(false);
//   const [keyboardOffset, setKeyboardOffset] = useState(0);

//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//   const audioChunksRef = useRef<BlobPart[]>([]);

//   // Detect mobile keyboard height changes
//   useEffect(() => {
//     if (window.visualViewport) {
//       const handleResize = () => {
//         const viewport = window.visualViewport;
//         const heightDiff = window.innerHeight - viewport.height;
//         setKeyboardOffset(heightDiff > 0 ? heightDiff : 0);
//       };
//       window.visualViewport.addEventListener("resize", handleResize);
//       window.visualViewport.addEventListener("scroll", handleResize);
//       handleResize();
//       return () => {
//         window.visualViewport.removeEventListener("resize", handleResize);
//         window.visualViewport.removeEventListener("scroll", handleResize);
//       };
//     }
//   }, []);

//   // Default avatar
//   useEffect(() => {
//     setSelectedModel("stylized");
//   }, [setSelectedModel]);

//   const sendMessage = () => {
//     if (input.current && input.current.value.trim() !== "") {
//       chat(input.current.value);
//       input.current.value = "";
//     }
//   };

//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const mediaRecorder = new MediaRecorder(stream);
//       mediaRecorderRef.current = mediaRecorder;
//       audioChunksRef.current = [];

//       mediaRecorder.ondataavailable = (e) => {
//         if (e.data.size > 0) audioChunksRef.current.push(e.data);
//       };

//       mediaRecorder.onstop = async () => {
//         const audioBlob = new Blob(audioChunksRef.current, {
//           type: "audio/wav",
//         });
//         const audioFile = new File([audioBlob], "recording.wav", {
//           type: "audio/wav",
//         });
//         await transcribe(audioFile);
//         stream.getTracks().forEach((t) => t.stop());
//       };

//       mediaRecorder.start();
//       setIsRecording(true);
//     } catch {
//       alert("Microphone access denied or unavailable.");
//     }
//   };

//   const stopRecording = () => {
//     if (mediaRecorderRef.current && isRecording) {
//       mediaRecorderRef.current.stop();
//       setIsRecording(false);
//     }
//   };

//   const setCameraState = (state: "zoomed" | "default" | "zoomout") => {
//     setChatCameraState(state);
//     setTranscribeCameraState(state);
//   };

//   const loading = chatLoading || transcribeLoading;
//   const message = chatMessage || transcribeMessage;

//   const Button = ({
//     icon,
//     label,
//     onClick,
//   }: {
//     icon: JSX.Element;
//     label: string;
//     onClick: () => void;
//   }) => (
//     <button
//       onClick={onClick}
//       className={`group flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold 
//                  backdrop-blur-md border shadow-md transition-all duration-300 w-fit
//                  ${
//                    darkMode
//                      ? "text-white border-white/20 bg-white/10 hover:bg-white/20"
//                      : "text-black border-black/10 bg-black/5 hover:bg-black/10"
//                  }`}
//     >
//       <span className="transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6">
//         {icon}
//       </span>
//       <span
//         className="overflow-hidden max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 
//                    group-hover:ml-1 transition-all duration-300 whitespace-nowrap"
//       >
//         {label}
//       </span>
//     </button>
//   );

//   return (
//     <div
//       className={`fixed top-0 left-0 w-screen h-screen z-10 pointer-events-none flex flex-col justify-between transition-all duration-500 ${
//         hidden ? "hidden" : ""
//       } ${darkMode ? "text-white" : "text-black"}`}
//     >
//       {/* Dark Mode Toggle */}
//       <div className="absolute top-3 right-3 sm:top-4 sm:right-4 pointer-events-auto">
//         <button
//           onClick={() => setDarkMode((prev) => !prev)}
//           className="gradient-border p-1.5 sm:p-2 rounded-full backdrop-blur-md shadow-md transition-all duration-300"
//         >
//           {darkMode ? (
//             <Sun size={18} className="sm:size-5 text-yellow-300" />
//           ) : (
//             <Moon size={18} className="sm:size-5 text-blue-500" />
//           )}
//         </button>
//       </div>

//       {/* LEFT SIDE BUTTONS */}
//       <div className="absolute top-4 sm:top-6 left-2 sm:left-4 flex flex-col gap-2 sm:gap-4 pointer-events-auto">
//         <div className={`gradient-border ${darkMode ? "dark-gradient" : ""}`}>
//           <div className="inner p-2 sm:p-3 flex flex-col gap-2 sm:gap-3">
//             <Button
//               icon={<ZoomIn size={16} className="sm:size-5" />}
//               label="Zoom In"
//               onClick={() => setCameraState("zoomed")}
//             />
//             <Button
//               icon={<RotateCcw size={16} className="sm:size-5" />}
//               label="Default"
//               onClick={() => setCameraState("default")}
//             />
//             <Button
//               icon={<ZoomOut size={16} className="sm:size-5" />}
//               label="Zoom Out"
//               onClick={() => setCameraState("zoomout")}
//             />
//           </div>
//         </div>

//         <div className={`gradient-border ${darkMode ? "dark-gradient" : ""}`}>
//           <div className="inner p-2 sm:p-3 flex flex-col gap-2 sm:gap-3">
//             <Button
//               icon={<User size={16} className="sm:size-5" />}
//               label="Female"
//               onClick={() => setSelectedModel("female")}
//             />
//             <Button
//               icon={<Palette size={16} className="sm:size-5" />}
//               label="Stylized"
//               onClick={() => setSelectedModel("stylized")}
//             />
//             <Button
//               icon={<Dog size={16} className="sm:size-5" />}
//               label="Shiba"
//               onClick={() => setSelectedModel("shiba")}
//             />
//             <Button
//               icon={<Camera size={16} className="sm:size-5" />}
//               label="Male"
//               onClick={() => setSelectedModel("wawa")}
//             />
//           </div>
//         </div>
//       </div>

//       {/* TOP CENTER MODE SWITCHER */}
//       <div className="p-3 sm:p-6 flex justify-center w-full pointer-events-auto">
//         <div className={`gradient-border ${darkMode ? "dark-gradient" : ""}`}>
//           <div className="inner flex gap-2 sm:gap-3 p-2 sm:p-3 rounded-full">
//             <Button
//               icon={<MessageSquareText size={14} className="sm:size-4" />}
//               label="Text"
//               onClick={() => setMode("text")}
//             />
//             <Button
//               icon={<Mic size={14} className="sm:size-4" />}
//               label="Voice"
//               onClick={() => setMode("voice")}
//             />
//           </div>
//         </div>
//       </div>

//       {/* BOTTOM CENTER INPUT */}
//       <div
//         className="fixed left-0 w-full flex justify-center px-3 sm:px-0 pointer-events-auto"
//         style={{ bottom: `${keyboardOffset > 0 ? keyboardOffset : 16}px` }}
//       >
//         {mode === "text" ? (
//           <div
//             className={`gradient-border w-half sm:min-w-[42rem] sm:max-w-[55rem] ${
//               darkMode ? "dark-gradient" : ""
//             }`}
//           >
//             <div className="inner flex rounded-full px-4 sm:px-6 py-2 sm:py-3 gap-2 sm:gap-3">
//               <input
//                 ref={input}
//                 className={`flex-1 bg-transparent outline-none placeholder:opacity-60 text-base sm:text-lg ${
//                   darkMode
//                     ? "text-white placeholder-white"
//                     : "text-black placeholder-black"
//                 }`}
//                 placeholder="Type your message..."
//                 onFocus={() => {
//                   input.current?.scrollIntoView({
//                     behavior: "smooth",
//                     block: "center",
//                   });
//                 }}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter" && !e.shiftKey) {
//                     e.preventDefault();
//                     sendMessage();
//                   }
//                 }}
//               />
//               <Button
//                 icon={<Send size={18} className="sm:size-5" />}
//                 label="Send"
//                 onClick={sendMessage}
//               />
//             </div>
//           </div>
//         ) : (
//           <div
//             className={`gradient-border ${darkMode ? "dark-gradient" : ""}`}
//           >
// {/*             { <div className="inner flex flex-col items-center gap-4 text-sm px-6 py-4">
//               <Button
//                 icon={<Mic size={24} />}
//                 label={isRecording ? "Stop" : "Record"}
//                 onClick={isRecording ? stopRecording : startRecording}
//               />
//               <div
//                 className={`text-center opacity-80 ${
//                   darkMode ? "text-white" : "text-black"
//                 }`}
//               >
//                 {isRecording
//                   ? "Recording... Tap to stop."
//                   : loading
//                   ? "Processing..."
//                   : "Tap to record your message."}
//               </div>
//             </div> } */}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };
























// import { useRef, useState, useEffect } from "react";
// import { useChat } from "../hooks/useChat";
// import { useTranscribe } from "../hooks/useTranscribe";
// import {
//   ZoomIn,
//   ZoomOut,
//   RotateCcw,
//   User,
//   Palette,
//   Dog,
//   Camera,
//   MessageSquareText,
//   Mic,
//   Send,
//   Moon,
//   Sun,
// } from "lucide-react";
// import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";

// // Cool animated button with magnetic hover, rotating glow, shine sweep, ripple burst, and hover-label reveal
// const CoolButton = ({
//   icon,
//   label,
//   onClick,
//   darkMode,
// }: {
//   icon: JSX.Element;
//   label: string;
//   onClick: () => void;
//   darkMode: boolean;
// }) => {
//   const mx = useMotionValue(0);
//   const my = useMotionValue(0);
//   const sx = useSpring(mx, { stiffness: 300, damping: 20 });
//   const sy = useSpring(my, { stiffness: 300, damping: 20 });
//   const [burst, setBurst] = useState<{ x: number; y: number } | null>(null);

//   const onMouseMove = (e: React.MouseEvent) => {
//     const rect = e.currentTarget.getBoundingClientRect();
//     const x = e.clientX - rect.left - rect.width / 2;
//     const y = e.clientY - rect.top - rect.height / 2;
//     mx.set((x / rect.width) * 10);
//     my.set((y / rect.height) * 10);
//   };
//   const onMouseLeave = () => {
//     mx.set(0);
//     my.set(0);
//   };

//   return (
//     <motion.button
//       style={{ x: sx, y: sy }}
//       onMouseMove={onMouseMove}
//       onMouseLeave={onMouseLeave}
//       onClick={(e) => {
//         const rect = e.currentTarget.getBoundingClientRect();
//         setBurst({ x: e.clientX - rect.left, y: e.clientY - rect.top });
//         onClick();
//       }}
//       className={`relative group flex items-center gap-2 px-3 py-2 rounded-full font-semibold
//                   overflow-hidden transition-all duration-100 w-fit
//                   ${darkMode
//                     ? "text-white bg-gradient-to-r from-blue-500 to-cyan-400 shadow-[0_0_20px_rgba(0,150,255,0.4)] "
//                     : "text-white bg-gradient-to-r from-gray-900 via-gray-800 to-black shadow-[0_0_20px_rgba(138,43,226,0.6)] hover:from-indigo-700 hover:via-purple-800 transition-all duration-300 rounded-2xl p-3"
//                   }`}
//     >
//       {/* Rotating glow border */}
//       <motion.span
//         className="absolute inset-[-2px] rounded-full pointer-events-none"
//         animate={{ rotate: 360 }}
//         transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
//         style={{
//           background:
//             "conic-gradient(from 0deg, rgba(255,255,255,0), rgba(255,255,255,0.5), rgba(255,255,255,0))",
//           filter: "blur(4px)",
//         }}
//       />

//       {/* Shine sweep */}
//       <motion.span
//         className="absolute top-0 bottom-0 w-12 -skew-x-12 bg-white/30 blur-md"
//         initial={{ left: "-50%" }}
//         whileHover={{ left: "150%" }}
//         transition={{ duration: 0.8, ease: "easeInOut" }}
//       />

//       {/* Icon */}
//       <span className="transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6">
//         {icon}
//       </span>

//       {/* Label that appears on hover */}
//       <span
//         className="overflow-hidden max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 
//                    group-hover:ml-1 transition-all duration-300 whitespace-nowrap"
//       >
//         {label}
//       </span>

//       {/* Click burst */}
//       {/* <AnimatePresence>
//         {burst && (
//           <motion.span
//             key={Date.now()}
//             initial={{ scale: 0, opacity: 0.5, x: burst.x, y: burst.y }}
//             animate={{ scale:   30, opacity: 0.2 }}
//             transition={{ duration: 0.6, ease: "easeOut" }}
//             className="absolute rounded-full bg-white/60 pointer-events-none"
//             style={{
//               width: 10,
//               height: 10,
//               translateX: "-50%",
//               translateY: "-50%",
//             }}
//             onAnimationComplete={() => setBurst(null)}
//           />
//         )}
//       </AnimatePresence> */}

//       <AnimatePresence>
//   {burst && (
//     <motion.span
//       key={Date.now()}
//       initial={{ scale: 0.8, opacity: 0 }}
//       animate={{ scale: [0.8, 1.4, 1], opacity: [0.6, 0.8, 0] }}
//       exit={{ opacity: 0 }}
//       transition={{
//         duration: 0.4,
//         ease: [0.4, 0, 0.2, 1], // cubic-bezier for natural ease
//       }}
//       className="absolute rounded-full pointer-events-none"
//       style={{
//         width: 40,
//         height: 40,
//         left: burst.x,
//         top: burst.y,
//         translateX: "-50%",
//         translateY: "-50%",
//         background: "radial-gradient(circle, rgba(255,255,255,0.9), rgba(255,255,255,0))",
//         boxShadow: "0 0 20px rgba(255,255,255,0.6)",
//       }}
//       onAnimationComplete={() => setBurst(null)}
//     />
//   )}
// </AnimatePresence>

//     </motion.button>
//   );
// };

// export const UI = ({
//   hidden,
//   setSelectedModel,
// }: {
//   hidden?: boolean;
//   setSelectedModel: (m: string) => void;
// }) => {
//   const input = useRef<HTMLInputElement>(null);
//   const {
//     chat,
//     loading: chatLoading,
//     setCameraState: setChatCameraState,
//     message: chatMessage,
//   } = useChat();
//   const {
//     transcribe,
//     loading: transcribeLoading,
//     setCameraState: setTranscribeCameraState,
//     message: transcribeMessage,
//   } = useTranscribe();

//   const [mode, setMode] = useState<"text" | "voice">("text");
//   const [darkMode, setDarkMode] = useState(true);
//   const [isRecording, setIsRecording] = useState(false);
//   const [keyboardOffset, setKeyboardOffset] = useState(0);

//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//   const audioChunksRef = useRef<BlobPart[]>([]);

//   useEffect(() => {
//     if (window.visualViewport) {
//       const handleResize = () => {
//         const viewport = window.visualViewport;
//         const heightDiff = window.innerHeight - viewport.height;
//         setKeyboardOffset(heightDiff > 0 ? heightDiff : 0);
//       };
//       window.visualViewport.addEventListener("resize", handleResize);
//       window.visualViewport.addEventListener("scroll", handleResize);
//       handleResize();
//       return () => {
//         window.visualViewport.removeEventListener("resize", handleResize);
//         window.visualViewport.removeEventListener("scroll", handleResize);
//       };
//     }
//   }, []);

//   useEffect(() => {
//     setSelectedModel("stylized");
//   }, [setSelectedModel]);

//   const sendMessage = () => {
//     if (input.current && input.current.value.trim() !== "") {
//       chat(input.current.value);
//       input.current.value = "";
//     }
//   };

//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const mediaRecorder = new MediaRecorder(stream);
//       mediaRecorderRef.current = mediaRecorder;
//       audioChunksRef.current = [];

//       mediaRecorder.ondataavailable = (e) => {
//         if (e.data.size > 0) audioChunksRef.current.push(e.data);
//       };

//       mediaRecorder.onstop = async () => {
//         const audioBlob = new Blob(audioChunksRef.current, {
//           type: "audio/wav",
//         });
//         const audioFile = new File([audioBlob], "recording.wav", {
//           type: "audio/wav",
//         });
//         await transcribe(audioFile);
//         stream.getTracks().forEach((t) => t.stop());
//       };

//       mediaRecorder.start();
//       setIsRecording(true);
//     } catch {
//       alert("Microphone access denied or unavailable.");
//     }
//   };

//   const stopRecording = () => {
//     if (mediaRecorderRef.current && isRecording) {
//       mediaRecorderRef.current.stop();
//       setIsRecording(false);
//     }
//   };

//   const setCameraState = (state: "zoomed" | "default" | "zoomout") => {
//     setChatCameraState(state);
//     setTranscribeCameraState(state);
//   };

//   const loading = chatLoading || transcribeLoading;
//   const message = chatMessage || transcribeMessage;

//   return (
//     <div
//       className={`fixed top-0 left-0 w-screen h-screen z-10 pointer-events-none flex flex-col justify-between transition-all duration-500 ${
//         hidden ? "hidden" : ""
//       } ${darkMode ? "text-white" : "text-black"}`}
//     >
//       {/* Dark Mode Toggle */}
//       <div className="absolute top-3 right-3 sm:top-4 sm:right-4 pointer-events-auto">
//   <div className={`gradient-border ${darkMode ? "dark-gradient" : ""}`}>
//     <div className="inner p-1.5 sm:p-2 rounded-full flex items-center justify-center">
//       <button
//         onClick={() => setDarkMode((prev) => !prev)}
//         className="flex items-center justify-center w-8 h-8 sm:w-5 sm:h-5 rounded-full transition-all duration-300"
//       >
//         {darkMode ? (
//           <Sun
//             size={18}
//             className="text-yellow-300 drop-shadow-[0_0_6px_rgba(255,215,0,0.7)]"
//           />
//         ) : (
//           <Moon
//             size={18}
//             className="text-blue-400 drop-shadow-[0_0_6px_rgba(100,149,237,0.6)]"
//           />
//         )}
//       </button>
//     </div>
//   </div>
// </div>


//       {/* LEFT SIDE BUTTONS */}
//       <div className="absolute top-4 sm:top-6 left-2 sm:left-4 flex flex-col gap-2 sm:gap-4 pointer-events-auto">
//         <div className={`gradient-border ${darkMode ? "dark-gradient" : ""}`}>
//           <div className="inner p-2 sm:p-3 flex flex-col gap-2 sm:gap-3">
//             <CoolButton icon={<ZoomIn size={16} />} label="Zoom In" onClick={() => setCameraState("zoomed")} darkMode={darkMode} />
//             <CoolButton icon={<RotateCcw size={16} />} label="Default" onClick={() => setCameraState("default")} darkMode={darkMode} />
//             <CoolButton icon={<ZoomOut size={16} />} label="Zoom Out" onClick={() => setCameraState("zoomout")} darkMode={darkMode} />
//           </div>
//         </div>
//         <div className={`gradient-border ${darkMode ? "dark-gradient" : ""}`}>
//           <div className="inner p-2 sm:p-3 flex flex-col gap-2 sm:gap-3">
//             <CoolButton icon={<User size={16} />} label="Female" onClick={() => setSelectedModel("female")} darkMode={darkMode} />
//             <CoolButton icon={<Palette size={16} />} label="Stylized" onClick={() => setSelectedModel("stylized")} darkMode={darkMode} />
//             <CoolButton icon={<Dog size={16} />} label="Shiba" onClick={() => setSelectedModel("shiba")} darkMode={darkMode} />
//             <CoolButton icon={<Camera size={16} />} label="Male" onClick={() => setSelectedModel("wawa")} darkMode={darkMode} />
//           </div>
//         </div>
//       </div>

//       {/* TOP CENTER MODE SWITCHER */}
//       <div className="p-3 sm:p-6 flex justify-center w-full pointer-events-auto">
//         <div className={`gradient-border ${darkMode ? "dark-gradient" : ""}`}>
//           <div className="inner flex gap-2 sm:gap-3 p-2 sm:p-3 rounded-full">
//             <CoolButton icon={<MessageSquareText size={14} />} label="Text" onClick={() => setMode("text")} darkMode={darkMode} />
//             <CoolButton icon={<Mic size={14} />} label="Voice" onClick={() => setMode("voice")} darkMode={darkMode} />
//           </div>
//         </div>
//       </div>

//       {/* BOTTOM CENTER INPUT */}
//       <div
//         className="fixed left-0 w-full flex justify-center px-5 sm:px-0 pointer-events-auto"
//         style={{ bottom: `${keyboardOffset > 0 ? keyboardOffset : 16}px` }}
//       >
//         {mode === "text" ? (
//           <div
//             className={`gradient-border w-half sm:min-w-[35rem] sm:max-w-[55rem] ${
//               darkMode ? "dark-gradient" : ""
//             }`}
//           >
//             <div className="inner flex rounded-full px-4 sm:px-6 py-2 sm:py-3 gap-2 sm:gap-3">
//               <input
//                 ref={input}
//                 className={`flex-1 bg-transparent outline-none placeholder:opacity-60 text-base sm:text-lg ${
//                   darkMode
//                     ? "text-white placeholder-white"
//                     : "text-white placeholder-white"
//                 }`}
//                 placeholder="Type your message..."
//                 onFocus={() => {
//                   input.current?.scrollIntoView({
//                     behavior: "smooth",
//                     block: "center",
//                   });
//                 }}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter" && !e.shiftKey) {
//                     e.preventDefault();
//                     sendMessage();
//                   }
//                 }}
//               />
//               <CoolButton icon={<Send size={18} />} label="Send" onClick={sendMessage} darkMode={darkMode} />
//             </div>
//           </div>
//         ) : (
//           <div className={`gradient-border ${darkMode ? "dark-gradient" : ""}`}>
//             <div className="inner flex flex-col items-center gap-4 text-sm px-6 py-4">
//               {/* Animated Mic Button */}
//               <div
//                 className="relative flex items-center justify-center cursor-pointer"
//                 onClick={isRecording ? stopRecording : startRecording}
//               >
//                 {isRecording && (
//                   <>
//                     <span className="absolute w-16 h-16 rounded-full bg-rosePink/30 animate-ping"></span>
//                     <span className="absolute w-24 h-24 rounded-full bg-rosePink/20 animate-pulse"></span>
//                   </>
//                 )}
//                 <button
//                   className={`relative z-10 flex items-center justify-center w-14 h-14 rounded-full border-2 shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl
//                     ${
//                       isRecording
//                         ? "animate-pulseRecord bg-gradient-to-r from-rosePink via-lavender to-aquaBlue bg-[length:200%_200%] animate-gradientGlow border-pink-300"
//                         : darkMode
//                         ? "bg-white/10 border-white/30 hover:bg-white/20"
//                         : "bg-black/5 border-black/10 hover:bg-black/10"
//                     }`}
//                 >
//                   <Mic
//                     size={24}
//                     className={`transition-transform duration-300 ${
//                       isRecording
//                         ? "text-white scale-110"
//                         : darkMode
//                         ? "text-white"
//                         : "text-black"
//                     }`}
//                   />
//                 </button>
//               </div>
//               <div
//                 className={`text-center opacity-80 ${
//                   darkMode ? "text-white" : "text-black"
//                 }`}
//               >
//                 {isRecording
//                   ? "Recording... Tap to stop."
//                   : loading
//                   ? "Processing..."
//                   : "Tap to record your message."}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };



















import { useRef, useState, useEffect } from "react";
import { useChat } from "../hooks/useChat";
import { useTranscribe } from "../hooks/useTranscribe";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  User,
  Palette,
  Dog,
  Camera,
  MessageSquareText,
  Mic,
  Send,
  Moon,
  Sun,
  User2Icon,
  UserX2Icon,
  UserCircle2,
} from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";

// Cool animated button with magnetic hover, rotating glow, shine sweep, ripple burst, and hover-label reveal
const CoolButton = ({
  icon,
  label,
  onClick,
  darkMode,
}: {
  icon: JSX.Element;
  label: string;
  onClick: () => void;
  darkMode: boolean;
}) => {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 300, damping: 20 });
  const sy = useSpring(my, { stiffness: 300, damping: 20 });
  const [burst, setBurst] = useState<{ x: number; y: number } | null>(null);

  const onMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mx.set((x / rect.width) * 10);
    my.set((y / rect.height) * 10);
  };
  const onMouseLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.button
      style={{ x: sx, y: sy }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setBurst({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        onClick();
      }}
      className={`relative group flex items-center gap-2 px-3 py-2 rounded-full font-semibold
                  overflow-hidden transition-all duration-100 w-fit
                  ${darkMode
                    ? "text-white bg-gradient-to-r from-blue-500 to-cyan-400 shadow-[0_0_20px_rgba(0,150,255,0.4)] "
                    : "text-white bg-gradient-to-r from-gray-900 via-gray-800 to-black shadow-[0_0_20px_rgba(138,43,226,0.6)] hover:from-indigo-700 hover:via-purple-800 transition-all duration-300 rounded-2xl p-3"
                  }`}
    >
      {/* Rotating glow border */}
      <motion.span
        className="absolute inset-[-2px] rounded-full pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        style={{
          background:
            "conic-gradient(from 0deg, rgba(255,255,255,0), rgba(255,255,255,0.5), rgba(255,255,255,0))",
          filter: "blur(4px)",
        }}
      />

      {/* Shine sweep */}
      <motion.span
        className="absolute top-0 bottom-0 w-12 -skew-x-12 bg-white/30 blur-md"
        initial={{ left: "-50%" }}
        whileHover={{ left: "150%" }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />

      {/* Icon */}
      <span className="transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6">
        {icon}
      </span>

      {/* Label that appears on hover */}
      <span
        className="overflow-hidden max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 
                   group-hover:ml-1 transition-all duration-300 whitespace-nowrap"
      >
        {label}
      </span>

      {/* Click burst */}
      {/* <AnimatePresence>
        {burst && (
          <motion.span
            key={Date.now()}
            initial={{ scale: 0, opacity: 0.5, x: burst.x, y: burst.y }}
            animate={{ scale:   30, opacity: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute rounded-full bg-white/60 pointer-events-none"
            style={{
              width: 10,
              height: 10,
              translateX: "-50%",
              translateY: "-50%",
            }}
            onAnimationComplete={() => setBurst(null)}
          />
        )}
      </AnimatePresence> */}

      <AnimatePresence>
  {burst && (
    <motion.span
      key={Date.now()}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: [0.8, 1.4, 1], opacity: [0.6, 0.8, 0] }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1], // cubic-bezier for natural ease
      }}
      className="absolute rounded-full pointer-events-none"
      style={{
        width: 40,
        height: 40,
        left: burst.x,
        top: burst.y,
        translateX: "-50%",
        translateY: "-50%",
        background: "radial-gradient(circle, rgba(255,255,255,0.9), rgba(255,255,255,0))",
        boxShadow: "0 0 20px rgba(255,255,255,0.6)",
      }}
      onAnimationComplete={() => setBurst(null)}
    />
  )}
</AnimatePresence>

    </motion.button>
  );
};

export const UI = ({
  hidden,
  setSelectedModel,
}: {
  hidden?: boolean;
  setSelectedModel: (m: string) => void;
}) => {
  const input = useRef<HTMLInputElement>(null);
  const {
    chat,
    loading: chatLoading,
    setCameraState: setChatCameraState,
    message: chatMessage,
  } = useChat();
  const {
    transcribe,
    loading: transcribeLoading,
    setCameraState: setTranscribeCameraState,
    message: transcribeMessage,
  } = useTranscribe();

  const [mode, setMode] = useState<"text" | "voice">("text");
  const [darkMode, setDarkMode] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);

  useEffect(() => {
    if (window.visualViewport) {
      const handleResize = () => {
        const viewport = window.visualViewport;
        const heightDiff = window.innerHeight - viewport.height;
        setKeyboardOffset(heightDiff > 0 ? heightDiff : 0);
      };
      window.visualViewport.addEventListener("resize", handleResize);
      window.visualViewport.addEventListener("scroll", handleResize);
      handleResize();
      return () => {
        window.visualViewport.removeEventListener("resize", handleResize);
        window.visualViewport.removeEventListener("scroll", handleResize);
      };
    }
  }, []);

  useEffect(() => {
    setSelectedModel("stylized");
  }, [setSelectedModel]);

  const sendMessage = () => {
    if (input.current && input.current.value.trim() !== "") {
      chat(input.current.value);
      input.current.value = "";
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        const audioFile = new File([audioBlob], "recording.wav", {
          type: "audio/wav",
        });
        await transcribe(audioFile);
        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch {
      alert("Microphone access denied or unavailable.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const setCameraState = (state: "zoomed" | "default" | "zoomout") => {
    setChatCameraState(state);
    setTranscribeCameraState(state);
  };

  const loading = chatLoading || transcribeLoading;
  const message = chatMessage || transcribeMessage;

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen z-10 pointer-events-none flex flex-col justify-between transition-all duration-500 ${
        hidden ? "hidden" : ""
      } ${darkMode ? "text-white" : "text-black"}`}
    >
      {/* Dark Mode Toggle */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 pointer-events-auto">
  <div className={`gradient-border ${darkMode ? "dark-gradient" : ""}`}>
    <div className="inner p-1.5 sm:p-2 rounded-full flex items-center justify-center">
      <button
        onClick={() => setDarkMode((prev) => !prev)}
        className="flex items-center justify-center w-8 h-8 sm:w-5 sm:h-5 rounded-full transition-all duration-300"
      >
        {darkMode ? (
          <Sun
            size={18}
            className="text-yellow-300 drop-shadow-[0_0_6px_rgba(255,215,0,0.7)]"
          />
        ) : (
          <Moon
            size={18}
            className="text-blue-400 drop-shadow-[0_0_6px_rgba(100,149,237,0.6)]"
          />
        )}
      </button>
    </div>
  </div>
</div>


      {/* LEFT SIDE BUTTONS */}
       <div className="absolute top-4 sm:top-6 left-2 sm:left-4 flex flex-col gap-2 sm:gap-4 pointer-events-auto">
         <div className={`gradient-border ${darkMode ? "dark-gradient" : ""}`}>
           <div className="inner p-2 sm:p-3 flex flex-col gap-2 sm:gap-3">
             <CoolButton
              icon={<ZoomIn size={16} className="sm:size-5" />}
              label="Zoom In"
              onClick={() => setCameraState("zoomed")}
              darkMode={darkMode}
            />
            <CoolButton
              icon={<RotateCcw size={16} className="sm:size-5" />}
              label="Default"
              onClick={() => setCameraState("default")}
              darkMode={darkMode}
            />
            <CoolButton
              icon={<ZoomOut size={16} className="sm:size-5" />}
              label="Zoom Out"
              onClick={() => setCameraState("zoomout")}
              darkMode={darkMode}
            />
          </div>
        </div>

        <div className={`gradient-border ${darkMode ? "dark-gradient" : ""}`}>
          <div className="inner p-2 sm:p-3 flex flex-col gap-2 sm:gap-3">
            <CoolButton
              icon={<User2Icon size={16} className="sm:size-5" />}
              label="Female"
              onClick={() => setSelectedModel("female")}
              darkMode={darkMode}
            />
            <CoolButton
              icon={<Palette size={16} className="sm:size-5" />}
              label="Stylized"
              onClick={() => setSelectedModel("stylized")}
              darkMode={darkMode}
            />
            <CoolButton
              icon={<Dog size={16} className="sm:size-5" />}
              label="Shiba"
              onClick={() => setSelectedModel("shiba")}
              darkMode={darkMode}
            />
            <CoolButton
              icon={<User size={16} className="sm:size-5" />}
              label="Male"
              onClick={() => setSelectedModel("wawa")}
              darkMode={darkMode}
            />
          </div>
        </div>
      </div>

      {/* TOP CENTER MODE SWITCHER */}
      <div className="p-3 sm:p-6 flex justify-center w-full pointer-events-auto">
        <div className={`gradient-border ${darkMode ? "dark-gradient" : ""}`}>
          <div className="inner flex gap-2 sm:gap-3 p-2 sm:p-3 rounded-full">
            <CoolButton icon={<MessageSquareText size={14} />} label="Text" onClick={() => setMode("text")} darkMode={darkMode} />
            <CoolButton icon={<Mic size={14} />} label="Voice" onClick={() => setMode("voice")} darkMode={darkMode} />
          </div>
        </div>
      </div>

      {/* BOTTOM CENTER INPUT */}
      <div
        className="fixed left-0 w-full flex justify-center px-0 sm:px-0 pointer-events-auto"
        style={{ bottom: `${keyboardOffset > 0 ? keyboardOffset : 16}px` }}
      >
        {mode === "text" ? (
          <div
            className={`gradient-border w-half sm:min-w-[30rem] sm:max-w-[55rem] ${
              darkMode ? "dark-gradient" : ""
            }`}
          >
            <div className="inner flex rounded-full px-4 sm:px-6 py-2 sm:py-3 gap-2 sm:gap-3">
              <input
                ref={input}
                className={`flex-1 bg-transparent outline-none placeholder:opacity-60 text-base sm:text-lg ${
                  darkMode
                    ? "text-white placeholder-white"
                    : "text-white placeholder-white"
                }`}
                placeholder="Type your message..."
                onFocus={() => {
                  input.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <CoolButton icon={<Send size={18} />} label="Send" onClick={sendMessage} darkMode={darkMode} />
            </div>
          </div>
        ) : (
          <div className={`gradient-border ${darkMode ? "dark-gradient" : ""}`}>
            <div className="inner flex flex-col items-center gap-4 text-sm px-6 py-4">
              {/* Animated Mic Button */}
              <div
                className="relative flex items-center justify-center cursor-pointer"
                onClick={isRecording ? stopRecording : startRecording}
              >
                {isRecording && (
                  <>
                    <span className="absolute w-16 h-16 rounded-full bg-rosePink/30 animate-ping"></span>
                    <span className="absolute w-24 h-24 rounded-full bg-rosePink/20 animate-pulse"></span>
                  </>
                )}
                <button
                  className={`relative z-10 flex items-center justify-center w-14 h-14 rounded-full border-2 shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl
                    ${
                      isRecording
                        ? "animate-pulseRecord bg-gradient-to-r from-rosePink via-lavender to-aquaBlue bg-[length:200%_200%] animate-gradientGlow border-pink-300"
                        : darkMode
                        ? "bg-white/10 border-white/30 hover:bg-white/20"
                        : "bg-black/5 border-black/10 hover:bg-black/10"
                    }`}
                >
                  <Mic
                    size={24}
                    className={`transition-transform duration-300 ${
                      isRecording
                        ? "text-white scale-110"
                        : darkMode
                        ? "text-white"
                        : "text-black"
                    }`}
                  />
                </button>
              </div>
              <div
                className={`text-center opacity-80 ${
                  darkMode ? "text-white" : "text-black"
                }`}
              >
                {isRecording
                  ? "Recording... Tap to stop."
                  : loading
                  ? "Processing..."
                  : "Tap to record your message."}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};







