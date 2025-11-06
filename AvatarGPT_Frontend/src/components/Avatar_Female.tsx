// import { useAnimations, useGLTF } from "@react-three/drei";
// import { useFrame } from "@react-three/fiber";
// import { button, useControls } from "leva";
// import React, { useEffect, useRef, useState } from "react";
// import { Group, SkinnedMesh, AnimationAction, AnimationMixer } from "three";
// import { VISEMES } from "wawa-lipsync";
// import { lipsyncManager } from "../App";
// import * as THREE from "three";
// import { useChat } from "../hooks/useChat";
// import { useTranscribe } from "../hooks/useTranscribe";

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

// interface AvatarProps {
//   [key: string]: any;
// }

// const facialExpressions: FacialExpressions = {
//   default: {},
//   smile: {
//   "viseme_sil": 0.13,
//   "viseme_PP": 0.62,
//   "viseme_FF": 0.24,
//   "viseme_DD": 0.04,
//   "browInnerUp": 0.16999999999999982,
//   "eyeSquintLeft": 0.4000000000000007,
//   "eyeSquintRight": 0.44000000000000017,
//   "noseSneerLeft": 0.1700000727403596,
//   "noseSneerRight": 0.14000002836874043,
//   "mouthPressLeft": 0.6099999999999992,
//   "mouthPressRight": 0.4099999999999997
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
//     mouthFrownLeft: 1,
//     mouthFrownRight: 1,
//     mouthShrugLower: 0.78341,
//     browInnerUp: 0.452,
//     eyeSquintLeft: 0.72,
//     eyeSquintRight: 0.75,
//     eyeLookDownLeft: 0.5,
//     eyeLookDownRight: 0.5,
//     jawForward: 1,
//   },
//   surprised: {
//   "browInnerUp": 0.9999999999999994,
//   "eyeWideLeft": 0.4999999999999997,
//   "eyeWideRight": 0.51,
//   "jawOpen": 0.64,
//   "mouthFunnel": 0.19
// },
//   angry: {
//     browDownLeft: 1,
//     browDownRight: 1,
//     eyeSquintLeft: 1,
//     eyeSquintRight: 1,
//     jawForward: 1,

//     jawLeft: 1,
//     mouthShrugLower: 1,
//     noseSneerLeft: 1,
//     noseSneerRight: 0.42,
//     eyeLookDownLeft: 0.16,
//     eyeLookDownRight: 0.16,
//     cheekSquintLeft: 1,
//     cheekSquintRight: 1,
//     mouthClose: 0.23,
//     mouthFunnel: 0.63,
//     mouthDimpleRight: 1,
//   },
//   crazy: {
//   "browInnerUp": 0.8999999999196712,
//   "jawForward": 0.9999999999999791,
//   "noseSneerLeft": 0.5699999998977822,
//   "noseSneerRight": 0.5099999999085417,
//   "eyeLookDownLeft": 0.02,
//   "eyeLookInLeft": 1,
//   "eyeLookInRight": 1,
//   "jawOpen": 0.96184795737983,
//   "mouthDimpleLeft": 0.9618479573798168,
//   "mouthDimpleRight": 0.9618479573798168,
//   "mouthStretchLeft": 0.27893590764014703,
//   "mouthStretchRight": 0.28855438721394494,
//   "mouthSmileLeft": 0.5578718152802941,
//   "mouthSmileRight": 0.38473918295192694,
//   "tongueOut": 0.9618479573798168
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

// export function Avatar(props: AvatarProps) {
//   const gltf = useGLTF("/models/female_model.glb");
//   const { nodes, materials, scene } = gltf as any; // Type assertion for GLTF result

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

//   const { animations } = useGLTF("/models/female_animations_final.glb");

//   const group = useRef();
//   const { actions, mixer } = useAnimations(animations, group);
//   const [animation, setAnimation] = useState(
//     animations.find((a) => a.name === "Idle") ? "Idle" : animations[0].name // Check if Idle animation exists otherwise use first animation
//   );
//   // useEffect(() => {
//   //   actions[animation]
//   //     .reset()
//   //     .fadeIn(mixer.stats.actions.inUse === 0 ? 0 : 0.5)
//   //     .play();
//   //   return () => actions[animation].fadeOut(0.5);
//   // }, [animation]);

//   useEffect(() => {
//     const action = actions[animation];
//     // if (!action) return;
  
//     action.reset().setEffectiveTimeScale(0.4).fadeIn(0.5).play();
  
//     return () => {
//       action.fadeOut(0.5);
//     };
//   }, [animation, actions]);
//   const lerpMorphTarget = (target: string, value: number, speed = 0.1) => {
//     scene.traverse((child: any) => {
//       if ((child as SkinnedMesh).isSkinnedMesh && (child as SkinnedMesh).morphTargetDictionary) {
//         const skinnedMesh = child as SkinnedMesh;
//         const index = nodes.AvatarHead.morphTargetDictionary?.[target];
//         if (
//           index === undefined ||
//           !nodes.AvatarHead.morphTargetInfluences ||
//           nodes.AvatarHead.morphTargetInfluences[index] === undefined
//         ) {
//           return;
//         }
//         nodes.AvatarHead.morphTargetInfluences[index] = THREE.MathUtils.lerp(
//           nodes.AvatarHead.morphTargetInfluences[index],
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
//     if (!setupMode && nodes.EyeLeft?.morphTargetDictionary) {
//       Object.keys(nodes.EyeLeft.morphTargetDictionary).forEach((key) => {
//         const mapping = facialExpressions[facialExpression];
//         if (key === "eyeBlinkLeft" || key === "eyeBlinkRight") {
//           return; // eyes wink/blink are handled separately
//         }
//         if (mapping && mapping[key]) {
//           lerpMorphTarget(key, mapping[key], 0.1);
//         } else {
//           lerpMorphTarget(key, 0, 0.1);
//         }
//       });
//     }

//     lerpMorphTarget("eyeBlinkLeft", blink || winkLeft ? 1 : 0, 0.5);
//     lerpMorphTarget("eyeBlinkRight", blink || winkRight ? 1 : 0, 0.5);

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
//           lerpMorphTarget(corresponding[mouthCue.value], 0.5, 0.2);
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
//       if (nodes.EyeLeft?.morphTargetDictionary) {
//         Object.keys(nodes.EyeLeft.morphTargetDictionary).forEach((key) => {
//           if (key === "eyeBlinkLeft" || key === "eyeBlinkRight") {
//             return; // eyes wink/blink are handled separately
//           }
//           const influence = nodes.EyeLeft.morphTargetInfluences?.[
//             nodes.EyeLeft.morphTargetDictionary?.[key] || 0
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
//     if (!nodes.AvatarHead?.morphTargetDictionary) return {};
    
//     return Object.assign(
//       {},
//       ...Object.keys(nodes.AvatarHead.morphTargetDictionary).map((key) => {
//         const initialValue = nodes.AvatarHead.morphTargetInfluences?.[
//           nodes.AvatarHead.morphTargetDictionary?.[key] || 0
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

//   return (
//     <group {...props} dispose={null} ref={group}>
//       <group rotation={[Math.PI / 2 , 0, 0]}>
//         <skinnedMesh
//           geometry={nodes.AvatarBody.geometry}
//           material={materials.AvatarBody}
//           skeleton={nodes.AvatarBody.skeleton}
//         />
//         <skinnedMesh
//           name="AvatarEyelashes"
//           geometry={nodes.AvatarEyelashes.geometry}
//           material={materials.AvatarEyelashes}
//           skeleton={nodes.AvatarEyelashes.skeleton}
//           morphTargetDictionary={nodes.AvatarEyelashes.morphTargetDictionary}
//           morphTargetInfluences={nodes.AvatarEyelashes.morphTargetInfluences}
//         />
//         <skinnedMesh
//           name="AvatarHead"
//           geometry={nodes.AvatarHead.geometry}
//           material={materials.AvatarHead}
//           skeleton={nodes.AvatarHead.skeleton}
//           morphTargetDictionary={nodes.AvatarHead.morphTargetDictionary}
//           morphTargetInfluences={nodes.AvatarHead.morphTargetInfluences}
//         />
//         <skinnedMesh
//           geometry={nodes.AvatarLeftEyeball.geometry}
//           material={materials.AvatarLeftEyeball}
//           skeleton={nodes.AvatarLeftEyeball.skeleton}
//         />
//         <skinnedMesh
//           geometry={nodes.AvatarRightEyeball.geometry}
//           material={materials.AvatarRightEyeball}
//           skeleton={nodes.AvatarRightEyeball.skeleton}
//         />
//         <skinnedMesh
//           name="AvatarTeethLower"
//           geometry={nodes.AvatarTeethLower.geometry}
//           material={materials.AvatarTeethLower}
//           skeleton={nodes.AvatarTeethLower.skeleton}
//           morphTargetDictionary={nodes.AvatarTeethLower.morphTargetDictionary}
//           morphTargetInfluences={nodes.AvatarTeethLower.morphTargetInfluences}
//         />
//         <skinnedMesh
//           geometry={nodes.AvatarTeethUpper.geometry}
//           material={materials.AvatarTeethUpper}
//           skeleton={nodes.AvatarTeethUpper.skeleton}
//         />
//         <skinnedMesh
//           geometry={nodes.earring.geometry}
//           material={materials.earring}
//           skeleton={nodes.earring.skeleton}
//         />
//         <skinnedMesh
//           geometry={nodes.haircut.geometry}
//           material={materials.haircut}
//           skeleton={nodes.haircut.skeleton}
//         />
//         <skinnedMesh
//           geometry={nodes.outfit.geometry}
//           material={materials.outfit}
//           skeleton={nodes.outfit.skeleton}
//         />
//         <primitive object={nodes.Hips} />
//       </group>
//     </group>
//   )
// }


// useGLTF.preload("/models/model.glb");
// useGLTF.preload("/models/animations.glb");



























import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { button, useControls } from "leva";
import React, { useEffect, useRef, useState } from "react";
import { Group, SkinnedMesh, AnimationAction, AnimationMixer } from "three";
import { VISEMES } from "wawa-lipsync";
import { lipsyncManager } from "../App";
import * as THREE from "three";
import { useChat } from "../hooks/useChat";
import { useTranscribe } from "../hooks/useTranscribe";

interface FacialExpression {
  [key: string]: number;
}

interface FacialExpressions {
  [expression: string]: FacialExpression;
}

interface LipsyncData {
  mouthCues: Array<{
    start: number;
    end: number;
    value: string;
  }>;
}

interface AvatarProps {
  [key: string]: any;
}

const facialExpressions: FacialExpressions = {
  default: {},
  smile: {
  "viseme_sil": 0.13,
  "viseme_PP": 0.62,
  "viseme_FF": 0.24,
  "viseme_DD": 0.04,
  "browInnerUp": 0.16999999999999982,
  "eyeSquintLeft": 0.4000000000000007,
  "eyeSquintRight": 0.44000000000000017,
  "noseSneerLeft": 0.1700000727403596,
  "noseSneerRight": 0.14000002836874043,
  "mouthPressLeft": 0.6099999999999992,
  "mouthPressRight": 0.4099999999999997
},
  funnyFace: {
  "jawLeft": 0.6299999999201844,
  "mouthPucker": 0.5299999999328535,
  "noseSneerLeft": 0.9999999998733079,
  "noseSneerRight": 0.3899999999505904,
  "mouthLeft": 0.65,
  "eyeLookUpLeft": 0.89,
  "eyeLookUpRight": 0.87,
  "cheekPuff": 1,
  "mouthDimpleLeft": 0.81,
  "mouthSmileRight": 0.3549973368431552
},
  sad: {
    mouthFrownLeft: 1,
    mouthFrownRight: 1,
    mouthShrugLower: 0.78341,
    browInnerUp: 0.452,
    eyeSquintLeft: 0.72,
    eyeSquintRight: 0.75,
    eyeLookDownLeft: 0.5,
    eyeLookDownRight: 0.5,
    jawForward: 1,
  },
  surprised: {
  "browInnerUp": 0.9999999999999994,
  "eyeWideLeft": 0.4999999999999997,
  "eyeWideRight": 0.51,
  "jawOpen": 0.64,
  "mouthFunnel": 0.19
},
  angry: {
    browDownLeft: 1,
    browDownRight: 1,
    eyeSquintLeft: 1,
    eyeSquintRight: 1,
    jawForward: 1,

    jawLeft: 1,
    mouthShrugLower: 1,
    noseSneerLeft: 1,
    noseSneerRight: 0.42,
    eyeLookDownLeft: 0.16,
    eyeLookDownRight: 0.16,
    cheekSquintLeft: 1,
    cheekSquintRight: 1,
    mouthClose: 0.23,
    mouthFunnel: 0.63,
    mouthDimpleRight: 1,
  },
  crazy: {
  "browInnerUp": 0.8999999999196712,
  "jawForward": 0.9999999999999791,
  "noseSneerLeft": 0.5699999998977822,
  "noseSneerRight": 0.5099999999085417,
  "eyeLookDownLeft": 0.02,
  "eyeLookInLeft": 1,
  "eyeLookInRight": 1,
  "jawOpen": 0.96184795737983,
  "mouthDimpleLeft": 0.9618479573798168,
  "mouthDimpleRight": 0.9618479573798168,
  "mouthStretchLeft": 0.27893590764014703,
  "mouthStretchRight": 0.28855438721394494,
  "mouthSmileLeft": 0.5578718152802941,
  "mouthSmileRight": 0.38473918295192694,
  "tongueOut": 0.9618479573798168
},
};

const corresponding: { [key: string]: string } = {
  A: "viseme_PP",
  B: "viseme_kk",
  C: "viseme_I",
  D: "viseme_AA",
  E: "viseme_O",
  F: "viseme_U",
  G: "viseme_FF",
  H: "viseme_TH",
  X: "viseme_PP",
};

let setupMode = false;

export function Avatar(props: AvatarProps) {
  const gltf = useGLTF("/models/female_model.glb");
  
  const { nodes, materials, scene } = gltf as any;

  const { message: chatMessage, onMessagePlayed: onChatMessagePlayed, chat } = useChat();
  const { message: transcribeMessage, onMessagePlayed: onTranscribeMessagePlayed } = useTranscribe();

  const message = chatMessage || transcribeMessage;
  const onMessagePlayed = chatMessage ? onChatMessagePlayed : onTranscribeMessagePlayed;

  const [audio, setAudio] = useState<HTMLAudioElement>();
  const [animation, setAnimation] = useState("Idle");

  const { animations } = useGLTF("/models/female_animations_final.glb");
  const group = useRef<any>();
  const { actions, mixer } = useAnimations(animations, group);

  const [facialExpression, setFacialExpression] = useState("");
  const [blink, setBlink] = useState(false);
  const [winkLeft, setWinkLeft] = useState(false);
  const [winkRight, setWinkRight] = useState(false);


  const { smoothMovements } = useControls("Avatar", {
    smoothMovements: {
      value: true,
      label: "Smooth Movements",
    },
  });
  
  // Debug morph target names
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as SkinnedMesh).isSkinnedMesh && child.morphTargetDictionary) {
        console.log("Morph targets for", child.name, ":", Object.keys(child.morphTargetDictionary));
      }
    });
  }, [scene]);

  // On new message
  // useEffect(() => {
  //   console.log("Incoming message:", message);
  //   if (!message) {
  //     setAnimation("Idle");
  //     return;
  //   }
  //   setAnimation(message.animation);
  //   setFacialExpression(message.facialExpression);

  //   const audio = new Audio("data:audio/mp3;base64," + message.audio);
  //   lipsyncManager.connectAudio(audio); 
  //   audio.play();
  //   setAudio(audio);
  //   audio.onended = onMessagePlayed;
  // }, [message, onMessagePlayed]);




  useEffect(() => {
  if (!message) {
    setAnimation("Idle");
    return;
  }

  setAnimation(message.animation);
  setFacialExpression(message.facialExpression);

  // cleanup previous audio if still playing
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }

  // create fresh audio
  const newAudio = new Audio("data:audio/mp3;base64," + message.audio);
  lipsyncManager.connectAudio(newAudio);

  newAudio.onended = () => {
    onMessagePlayed?.();
  };

  // play safely
  newAudio.play().catch((err) => {
    console.warn("Audio play failed:", err);
  });

  setAudio(newAudio);

  return () => {
    // cleanup if effect re-runs (StrictMode dev runs twice)
    newAudio.pause();
    newAudio.currentTime = 0;
  };
}, [message?.audio]); // 👈 only re-run when audio string changes

  // useEffect(() => {
  //   actions[animation]
  //     .reset()
  //     .fadeIn(mixer.stats.actions.inUse === 0 ? 0 : 0.5)
  //     .play();
  //   return () => actions[animation].fadeOut(0.5);
  // }, [animation]);

  useEffect(() => {
    const action = actions[animation];
    // if (!action) return;
  
    action.reset().setEffectiveTimeScale(0.4).fadeIn(0.5).play();
  
    return () => {
      action.fadeOut(0.5);
    };
  }, [animation, actions]);
  const lerpMorphTarget = (target: string, value: number, speed = 0.1) => {
    scene.traverse((child: any) => {
      if ((child as SkinnedMesh).isSkinnedMesh && (child as SkinnedMesh).morphTargetDictionary) {
        const skinnedMesh = child as SkinnedMesh;
        const index = nodes.AvatarHead.morphTargetDictionary?.[target];
        if (
          index === undefined ||
          !nodes.AvatarHead.morphTargetInfluences ||
          nodes.AvatarHead.morphTargetInfluences[index] === undefined
        ) {
          return;
        }
        nodes.AvatarHead.morphTargetInfluences[index] = THREE.MathUtils.lerp(
          nodes.AvatarHead.morphTargetInfluences[index],
          value,
          speed
        );

        if (!setupMode) {
          try {
            set({
              [target]: value,
            });
          } catch (e) {
            // Ignore errors in non-setup mode
          }
        }
      }
    });
  };

  // useFrame(() => {
  //   if (!setupMode && nodes.EyeLeft?.morphTargetDictionary) {
  //     Object.keys(nodes.EyeLeft.morphTargetDictionary).forEach((key) => {
  //       const mapping = facialExpressions[facialExpression];
  //       if (key === "eyeBlinkLeft" || key === "eyeBlinkRight") {
  //         return; // eyes wink/blink are handled separately
  //       }
  //       if (mapping && mapping[key]) {
  //         lerpMorphTarget(key, mapping[key], 0.1);
  //       } else {
  //         lerpMorphTarget(key, 0, 0.1);
  //       }
  //     });
  //   }

  //   lerpMorphTarget("eyeBlinkLeft", blink || winkLeft ? 1 : 0, 0.5);
  //   lerpMorphTarget("eyeBlinkRight", blink || winkRight ? 1 : 0, 0.5);

  //   // LIPSYNC
  //   if (setupMode) {
  //     return;
  //   }

  //   const appliedMorphTargets: string[] = [];
  //   if (message && lipsync && audio) {
  //     const currentAudioTime = audio.currentTime;
  //     for (let i = 0; i < lipsync.mouthCues.length; i++) {
  //       const mouthCue = lipsync.mouthCues[i];
  //       if (
  //         currentAudioTime >= mouthCue.start &&
  //         currentAudioTime <= mouthCue.end
  //       ) {
  //         appliedMorphTargets.push(corresponding[mouthCue.value]);
  //         lerpMorphTarget(corresponding[mouthCue.value], 0.5, 0.2);
  //         break;
  //       }
  //     }
  //   }

  //   Object.values(corresponding).forEach((value) => {
  //     if (appliedMorphTargets.includes(value)) {
  //       return;
  //     }
  //     lerpMorphTarget(value, 0, 0.1);
  //   });
  // });


  useFrame(() => {
    lerpMorphTarget("eyeBlinkLeft", blink || winkLeft ? 1 : 0, 0.15);
    lerpMorphTarget("eyeBlinkRight", blink || winkRight ? 1 : 0, 0.15);

    // LIPSYNC
    if (setupMode) {
      return;
    }

    const viseme = lipsyncManager.viseme;
    const state = lipsyncManager.state;
    lerpMorphTarget(
      viseme,
      0.5,
      smoothMovements ? (state === "vowel" ? 0.2 : 0.4) : 1
    );

    Object.values(VISEMES).forEach((value) => {
      if (viseme === value) {
        return;
      }
      lerpMorphTarget(
        value,
        0,
        smoothMovements ? (state === "vowel" ? 0.1 : 0.2) : 1
      );
    });
  });

    // 🔁 Real-time lipsync audio processing loop
  useEffect(() => {
    let animationFrameId: number;

    const analyzeAudio = () => {
      lipsyncManager.processAudio();
      animationFrameId = requestAnimationFrame(analyzeAudio);
    };

    animationFrameId = requestAnimationFrame(analyzeAudio);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Blinking loop
  useEffect(() => {
    let blinkTimeout: any;
    const nextBlink = () => {
      blinkTimeout = setTimeout(() => {
        setBlink(true);
        setTimeout(() => {
          setBlink(false);
          nextBlink();
        }, 200);
      }, THREE.MathUtils.randInt(1000, 5000));
    };
    nextBlink();
    return () => clearTimeout(blinkTimeout);
  }, []);



  useControls("FacialExpressions", {
    chat: button(() => chat("Hello!")),
    winkLeft: button(() => {
      setWinkLeft(true);
      setTimeout(() => setWinkLeft(false), 300);
    }),
    winkRight: button(() => {
      setWinkRight(true);
      setTimeout(() => setWinkRight(false), 300);
    }),
    animation: {
      value: animation,
      options: animations.map((a) => a.name),
      onChange: (value) => setAnimation(value),
    },
    facialExpression: {
      options: Object.keys(facialExpressions),
      onChange: (value) => setFacialExpression(value),
    },
    enableSetupMode: button(() => {
      setupMode = true;
    }),
    disableSetupMode: button(() => {
      setupMode = false;
    }),
    logMorphTargetValues: button(() => {
      const emotionValues: { [key: string]: number } = {};
      if (nodes.EyeLeft?.morphTargetDictionary) {
        Object.keys(nodes.EyeLeft.morphTargetDictionary).forEach((key) => {
          if (key === "eyeBlinkLeft" || key === "eyeBlinkRight") {
            return; // eyes wink/blink are handled separately
          }
          const influence = nodes.EyeLeft.morphTargetInfluences?.[
            nodes.EyeLeft.morphTargetDictionary?.[key] || 0
          ];
          if (influence && influence > 0.01) {
            emotionValues[key] = influence;
          }
        });
      }
      console.log(JSON.stringify(emotionValues, null, 2));
    }),
  });

  const [, set] = useControls("MorphTarget", () => {
    if (!nodes.AvatarHead?.morphTargetDictionary) return {};
    
    return Object.assign(
      {},
      ...Object.keys(nodes.AvatarHead.morphTargetDictionary).map((key) => {
        const initialValue = nodes.AvatarHead.morphTargetInfluences?.[
          nodes.AvatarHead.morphTargetDictionary?.[key] || 0
        ] || 0;
        
        return {
          [key]: {
            label: key,
            value: 0,
            min: initialValue,
            max: 1,
            onChange: (val: number) => {
              if (setupMode) {
                lerpMorphTarget(key, val, 1);
              }
            },
          },
        };
      })
    );
  });

  useEffect(() => {
    let blinkTimeout: number;
    const nextBlink = () => {
      blinkTimeout = window.setTimeout(() => {
        setBlink(true);
        window.setTimeout(() => {
          setBlink(false);
          nextBlink();
        }, 200);
      }, THREE.MathUtils.randInt(1000, 5000));
    };
    nextBlink();
    return () => window.clearTimeout(blinkTimeout);
  }, []);

  return (
    <group {...props} dispose={null} ref={group}>
      <group rotation={[Math.PI / 2 , 0, 0]}>
        <skinnedMesh
          geometry={nodes.AvatarBody.geometry}
          material={materials.AvatarBody}
          skeleton={nodes.AvatarBody.skeleton}
        />
        <skinnedMesh
          name="AvatarEyelashes"
          geometry={nodes.AvatarEyelashes.geometry}
          material={materials.AvatarEyelashes}
          skeleton={nodes.AvatarEyelashes.skeleton}
          morphTargetDictionary={nodes.AvatarEyelashes.morphTargetDictionary}
          morphTargetInfluences={nodes.AvatarEyelashes.morphTargetInfluences}
        />
        <skinnedMesh
          name="AvatarHead"
          geometry={nodes.AvatarHead.geometry}
          material={materials.AvatarHead}
          skeleton={nodes.AvatarHead.skeleton}
          morphTargetDictionary={nodes.AvatarHead.morphTargetDictionary}
          morphTargetInfluences={nodes.AvatarHead.morphTargetInfluences}
        />
        <skinnedMesh
          geometry={nodes.AvatarLeftEyeball.geometry}
          material={materials.AvatarLeftEyeball}
          skeleton={nodes.AvatarLeftEyeball.skeleton}
        />
        <skinnedMesh
          geometry={nodes.AvatarRightEyeball.geometry}
          material={materials.AvatarRightEyeball}
          skeleton={nodes.AvatarRightEyeball.skeleton}
        />
        <skinnedMesh
          name="AvatarTeethLower"
          geometry={nodes.AvatarTeethLower.geometry}
          material={materials.AvatarTeethLower}
          skeleton={nodes.AvatarTeethLower.skeleton}
          morphTargetDictionary={nodes.AvatarTeethLower.morphTargetDictionary}
          morphTargetInfluences={nodes.AvatarTeethLower.morphTargetInfluences}
        />
        <skinnedMesh
          geometry={nodes.AvatarTeethUpper.geometry}
          material={materials.AvatarTeethUpper}
          skeleton={nodes.AvatarTeethUpper.skeleton}
        />
        <skinnedMesh
          geometry={nodes.earring.geometry}
          material={materials.earring}
          skeleton={nodes.earring.skeleton}
        />
        <skinnedMesh
          geometry={nodes.haircut.geometry}
          material={materials.haircut}
          skeleton={nodes.haircut.skeleton}
        />
        <skinnedMesh
          geometry={nodes.outfit.geometry}
          material={materials.outfit}
          skeleton={nodes.outfit.skeleton}
        />
        <primitive object={nodes.Hips} />
      </group>
    </group>
  )
}


useGLTF.preload("/models/model.glb");
useGLTF.preload("/models/animations.glb");
