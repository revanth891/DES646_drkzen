import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { button, useControls } from "leva";
import React, { useEffect, useRef, useState } from "react";
import { Group, SkinnedMesh, AnimationAction, AnimationMixer } from "three";

import * as THREE from "three";
import { useChat } from "../hooks/useChat";
import { useTranscribe } from "../hooks/useTranscribe";

// interface FacialExpression {
//   [key: string]: number;
// }

// interface FacialExpressions {
//   [expression: string]: FacialExpression;
// }

// interface LipsyncData {
//   mouthCues: Array<{
//     start: number;
//     end: number;
//     value: string;
//   }>;
// }



interface AvatarProps {
  [key: string]: any;
}

// const facialExpressions: FacialExpressions = {
//   default: {},
//   smile: {
//   "mouthSmile": 1
// },
//   funnyFace: {
//   "jawLeft": 0.6299999999201844,
//   "mouthPucker": 0.5299999999328535,
//   "noseSneerLeft": 0.9999999998733079,
//   "noseSneerRight": 0.3899999999505904,
//   "mouthLeft": 0.65,
//   "eyeLookUpLeft": 0.89,
//   "eyeLookUpRight": 0.87,
//   "cheekPuff": 1,
//   "mouthDimpleLeft": 0.81,
//   "mouthSmileRight": 0.3549973368431552
// },
//   sad: {
//   "viseme_O": 0.34,
//   "viseme_nn": 0.12,
//   "viseme_DD": 0.05,
//   "viseme_PP": 0.9500000000000001,
//   "eye_close": 0.48
// },
//   surprised: {
//   "viseme_aa": 1,
//   "eyesLookUp": 1,
//   "mouthSmile": 0.36
// },
//   angry: {
//   "viseme_FF": 0.62,
//   "eye_close": 0.24,
//   "mouthSmile": 0.36
// },
//   crazy: {
//   "viseme_aa": 0.56,
//   "viseme_FF": 0.62,
//   "viseme_DD": 0.05,
//   "eye_close": 0.24,
//   "eye closed.L": 0.99993896484375,
//   "eye closed.R": 0.99993896484375,
//   "eyesLookUp": 1,
//   "mouthSmile": 1
// },
// };

// const corresponding: { [key: string]: string } = {
//   A: "viseme_PP",
//   B: "viseme_kk",
//   C: "viseme_I",
//   D: "viseme_AA",
//   E: "viseme_O",
//   F: "viseme_U",
//   G: "viseme_FF",
//   H: "viseme_TH",
//   X: "viseme_PP",
// };

// let setupMode = false;

export function Avatar(props: AvatarProps) {
  const gltf = useGLTF("/models/shiba.glb");
  const { nodes, materials, scene } = gltf as any; // Type assertion for GLTF result

//   const { message: chatMessage, onMessagePlayed: onChatMessagePlayed, chat } = useChat();
//   const { message: transcribeMessage, onMessagePlayed: onTranscribeMessagePlayed } = useTranscribe();

//   // Use chat message as primary, fallback to transcribe message
//   const message = chatMessage || transcribeMessage;
//   const onMessagePlayed = chatMessage ? onChatMessagePlayed : onTranscribeMessagePlayed;

//   const [lipsync, setLipsync] = useState<LipsyncData | undefined>();

//   useEffect(() => {
//     console.log(message);
//     if (!message) {
//       setAnimation("Idle");
//       return;
//     }
//     setAnimation(message.animation);
//     setFacialExpression(message.facialExpression);
//     setLipsync(message.lipsync);
//     const audio = new Audio("data:audio/mp3;base64," + message.audio);
//     audio.play();
//     setAudio(audio);
//     audio.onended = onMessagePlayed;
//   }, [message, onMessagePlayed]);

//   const { animations } = useGLTF("/models/animations_Naoki.glb");

//   const group = useRef();
//   const { actions, mixer } = useAnimations(animations, group);
//   const [animation, setAnimation] = useState(
//     animations.find((a) => a.name === "Idle") ? "Idle" : animations[0].name // Check if Idle animation exists otherwise use first animation
//   );
// useEffect(() => {
//   const action = actions[animation];
//   // if (!action) return;

//   action.reset().fadeIn(0.5).play();

//   return () => {
//     action.fadeOut(0.5);
//   };
// }, [animation, actions]);

//   const lerpMorphTarget = (target: string, value: number, speed = 0.1) => {
//     scene.traverse((child: any) => {
//       if ((child as SkinnedMesh).isSkinnedMesh && (child as SkinnedMesh).morphTargetDictionary) {
//         const skinnedMesh = child as SkinnedMesh;
//         const index = skinnedMesh.morphTargetDictionary?.[target];
//         if (
//           index === undefined ||
//           !skinnedMesh.morphTargetInfluences ||
//           skinnedMesh.morphTargetInfluences[index] === undefined
//         ) {
//           return;
//         }
//         skinnedMesh.morphTargetInfluences[index] = THREE.MathUtils.lerp(
//           skinnedMesh.morphTargetInfluences[index],
//           value,
//           speed
//         );

//         if (!setupMode) {
//           try {
//             set({
//               [target]: value,
//             });
//           } catch (e) {
//             // Ignore errors in non-setup mode
//           }
//         }
//       }
//     });
//   };

//   const [blink, setBlink] = useState(false);
//   const [winkLeft, setWinkLeft] = useState(false);
//   const [winkRight, setWinkRight] = useState(false);
//   const [facialExpression, setFacialExpression] = useState("");
//   const [audio, setAudio] = useState<HTMLAudioElement | undefined>();

//   useFrame(() => {
//     if (!setupMode && nodes.Head?.morphTargetDictionary) {
//       Object.keys(nodes.Head.morphTargetDictionary).forEach((key) => {
//         const mapping = facialExpressions[facialExpression];
//         if (key === "eye closed.L" || key === "eye closed.R") {
//           return; // eyes wink/blink are handled separately
//         }
//         if (mapping && mapping[key]) {
//           lerpMorphTarget(key, mapping[key], 0.1);
//         } else {
//           lerpMorphTarget(key, 0, 0.1);
//         }
//       });
//     }

//     lerpMorphTarget("eye closed.L", blink || winkLeft ? 1 : 0, 0.5);
//     lerpMorphTarget("eye closed.R", blink || winkRight ? 1 : 0, 0.5);

//     // LIPSYNC
//     if (setupMode) {
//       return;
//     }

//     const appliedMorphTargets: string[] = [];
//     if (message && lipsync && audio) {
//       const currentAudioTime = audio.currentTime;
//       for (let i = 0; i < lipsync.mouthCues.length; i++) {
//         const mouthCue = lipsync.mouthCues[i];
//         if (
//           currentAudioTime >= mouthCue.start &&
//           currentAudioTime <= mouthCue.end
//         ) {
//           appliedMorphTargets.push(corresponding[mouthCue.value]);
//           lerpMorphTarget(corresponding[mouthCue.value], 1, 0.2);
//           break;
//         }
//       }
//     }

//     Object.values(corresponding).forEach((value) => {
//       if (appliedMorphTargets.includes(value)) {
//         return;
//       }
//       lerpMorphTarget(value, 0, 0.1);
//     });
//   });

//   useControls("FacialExpressions", {
//     chat: button(() => chat("Hello!")),
//     winkLeft: button(() => {
//       setWinkLeft(true);
//       setTimeout(() => setWinkLeft(false), 300);
//     }),
//     winkRight: button(() => {
//       setWinkRight(true);
//       setTimeout(() => setWinkRight(false), 300);
//     }),
//     animation: {
//       value: animation,
//       options: animations.map((a) => a.name),
//       onChange: (value) => setAnimation(value),
//     },
//     facialExpression: {
//       options: Object.keys(facialExpressions),
//       onChange: (value) => setFacialExpression(value),
//     },
//     enableSetupMode: button(() => {
//       setupMode = true;
//     }),
//     disableSetupMode: button(() => {
//       setupMode = false;
//     }),
//     logMorphTargetValues: button(() => {
//       const emotionValues: { [key: string]: number } = {};
//       if (nodes.Head?.morphTargetDictionary) {
//         Object.keys(nodes.Head.morphTargetDictionary).forEach((key) => {
//           if (key === "eyeBlinkLeft" || key === "eyeBlinkRight") {
//             return; // eyes wink/blink are handled separately
//           }
//           const influence = nodes.Head.morphTargetInfluences?.[
//             nodes.Head.morphTargetDictionary?.[key] || 0
//           ];
//           if (influence && influence > 0.01) {
//             emotionValues[key] = influence;
//           }
//         });
//       }
//       console.log(JSON.stringify(emotionValues, null, 2));
//     }),
//   });

//   const [, set] = useControls("MorphTarget", () => {
//     if (!nodes.Head.morphTargetDictionary) return {};
    
//     return Object.assign(
//       {},
//       ...Object.keys(nodes.Head.morphTargetDictionary).map((key) => {
//         const initialValue = nodes.Head.morphTargetInfluences?.[
//           nodes.Head.morphTargetDictionary?.[key] || 0
//         ] || 0;
        
//         return {
//           [key]: {
//             label: key,
//             value: 0,
//             min: initialValue,
//             max: 1,
//             onChange: (val: number) => {
//               if (setupMode) {
//                 lerpMorphTarget(key, val, 1);
//               }
//             },
//           },
//         };
//       })
//     );
//   });

//   useEffect(() => {
//     let blinkTimeout: number;
//     const nextBlink = () => {
//       blinkTimeout = window.setTimeout(() => {
//         setBlink(true);
//         window.setTimeout(() => {
//           setBlink(false);
//           nextBlink();
//         }, 200);
//       }, THREE.MathUtils.randInt(1000, 5000));
//     };
//     nextBlink();
//     return () => window.clearTimeout(blinkTimeout);
//   }, []);

  return (
    <group {...props} scale={0.5} position={[0,1,0]} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Box002_default_0.geometry}
        material={materials['default']}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Group18985_default_0.geometry}
        material={materials['default']}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Object001_default_0.geometry}
        material={materials['default']}
        rotation={[-Math.PI / 2, 0, 0]}
        
      />
    </group>
  )
}


useGLTF.preload("/models/shiba.glb");
// useGLTF.preload("/models/animations_Naoki.glb");
