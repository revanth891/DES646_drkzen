// import { useAnimations, useGLTF } from "@react-three/drei";
// import { useFrame } from "@react-three/fiber";
// import { button, useControls } from "leva";
// import React, { useEffect, useRef, useState } from "react";
// import * as THREE from "three";
// import { SkinnedMesh } from "three";
// import { useChat } from "../hooks/useChat";
// import { useTranscribe } from "../hooks/useTranscribe";
// import { VISEMES } from "wawa-lipsync";
// import { lipsyncManager } from "../App";

// interface AvatarProps {
//   [key: string]: any;
// }
// interface FacialExpression {
//   [key: string]: number;
// }

// interface FacialExpressions {
//   [expression: string]: FacialExpression;
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
//   const gltf = useGLTF("/models/model.glb");
  
//   const { nodes, materials, scene } = gltf as any;

//   const { message: chatMessage, onMessagePlayed: onChatMessagePlayed, chat } = useChat();
//   const { message: transcribeMessage, onMessagePlayed: onTranscribeMessagePlayed } = useTranscribe();

//   const message = chatMessage || transcribeMessage;
//   const onMessagePlayed = chatMessage ? onChatMessagePlayed : onTranscribeMessagePlayed;

//   const [audio, setAudio] = useState<HTMLAudioElement>();
//   const [animation, setAnimation] = useState("Idle");

//   const { animations } = useGLTF("/models/animations.glb");
//   const group = useRef<any>();
//   const { actions, mixer } = useAnimations(animations, group);

//   const [facialExpression, setFacialExpression] = useState("");
//   const [blink, setBlink] = useState(false);
//   const [winkLeft, setWinkLeft] = useState(false);
//   const [winkRight, setWinkRight] = useState(false);

//   // Debug morph target names
//   useEffect(() => {
//     scene.traverse((child) => {
//       if ((child as SkinnedMesh).isSkinnedMesh && child.morphTargetDictionary) {
//         console.log("Morph targets for", child.name, ":", Object.keys(child.morphTargetDictionary));
//       }
//     });
//   }, [scene]);

//   // On new message
//   useEffect(() => {
//     console.log("Incoming message:", message);
//     if (!message) {
//       setAnimation("Idle");
//       return;
//     }
//     setAnimation(message.animation);
//     setFacialExpression(message.facialExpression);

//     const audio = new Audio("data:audio/mp3;base64," + message.audio);
//     lipsyncManager.connectAudio(audio); // 🔥 Critical fix
//     audio.play();
//     setAudio(audio);
//     audio.onended = onMessagePlayed;
//   }, [message, onMessagePlayed]);

//   // Animate body
//   useEffect(() => {
//     actions[animation]
//       ?.reset()
//       .fadeIn(mixer.stats.actions.inUse === 0 ? 0 : 0.5)
//       .play();
//     return () => actions[animation]?.fadeOut(0.5);
//   }, [animation]);

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

//   // Frame-by-frame lipsync & expressions
//   useFrame(() => {
//     if (setupMode) return;

//     // Eye blink / wink
//     lerpMorphTarget("eyeBlinkLeft", blink || winkLeft ? 1 : 0, 0.5);
//     lerpMorphTarget("eyeBlinkRight", blink || winkRight ? 1 : 0, 0.5);

//     // Lipsync viseme updates
//     const viseme = lipsyncManager.viseme;
//     // console.log(viseme);
//     const state = lipsyncManager.state;
//     // console.log(state);

//     lerpMorphTarget(viseme, 0.6, state === "vowel" ? 0.2 : 0.4);
//     // console.log(VISEMES);
//     Object.values(VISEMES).forEach((v) => {
//       if (v !== viseme) lerpMorphTarget(v, 0, state === "vowel" ? 0.1 : 0.2);
//     });
//   });

//   // 🔁 Real-time lipsync audio processing loop
//   useEffect(() => {
//     let animationFrameId: number;

//     const analyzeAudio = () => {
//       lipsyncManager.processAudio();
//       animationFrameId = requestAnimationFrame(analyzeAudio);
//     };

//     animationFrameId = requestAnimationFrame(analyzeAudio);

//     return () => cancelAnimationFrame(animationFrameId);
//   }, []);

//   // Blinking loop
//   useEffect(() => {
//     let blinkTimeout: any;
//     const nextBlink = () => {
//       blinkTimeout = setTimeout(() => {
//         setBlink(true);
//         setTimeout(() => {
//           setBlink(false);
//           nextBlink();
//         }, 200);
//       }, THREE.MathUtils.randInt(2000, 5000));
//     };
//     nextBlink();
//     return () => clearTimeout(blinkTimeout);
//   }, []);

//   // Debugging controls
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
//           const emotionValues: { [key: string]: number } = {};
//           if (nodes.EyeLeft?.morphTargetDictionary) {
//             Object.keys(nodes.EyeLeft.morphTargetDictionary).forEach((key) => {
//               if (key === "eyeBlinkLeft" || key === "eyeBlinkRight") {
//                 return; // eyes wink/blink are handled separately
//               }
//               const influence = nodes.EyeLeft.morphTargetInfluences?.[
//                 nodes.EyeLeft.morphTargetDictionary?.[key] || 0
//               ];
//               if (influence && influence > 0.01) {
//                 emotionValues[key] = influence;
//               }
//             });
//           }
//           console.log(JSON.stringify(emotionValues, null, 2));
//         }),
//   });
//   const [, set] = useControls("MorphTarget", () => {
//       if (!nodes.EyeLeft?.morphTargetDictionary) return {};
      
//       return Object.assign(
//         {},
//         ...Object.keys(nodes.EyeLeft.morphTargetDictionary).map((key) => {
//           const initialValue = nodes.EyeLeft.morphTargetInfluences?.[
//             nodes.EyeLeft.morphTargetDictionary?.[key] || 0
//           ] || 0;
          
//           return {
//             [key]: {
//               label: key,
//               value: 0,
//               min: initialValue,
//               max: 1,
//               onChange: (val: number) => {
//                 if (setupMode) {
//                   lerpMorphTarget(key, val, 1);
//                 }
//               },
//             },
//           };
//         })
//       );
//     });

//   return (
//     <group {...props} dispose={null} ref={group}>
//       <primitive object={nodes.Hips} />
//       <skinnedMesh
//         name="EyeLeft"
//         geometry={nodes.EyeLeft.geometry}
//         material={materials.Wolf3D_Eye}
//         skeleton={nodes.EyeLeft.skeleton}
//         morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary}
//         morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences}
//       />
//       <skinnedMesh
//         name="EyeRight"
//         geometry={nodes.EyeRight.geometry}
//         material={materials.Wolf3D_Eye}
//         skeleton={nodes.EyeRight.skeleton}
//         morphTargetDictionary={nodes.EyeRight.morphTargetDictionary}
//         morphTargetInfluences={nodes.EyeRight.morphTargetInfluences}
//       />
//       <skinnedMesh
//         name="Wolf3D_Head"
//         geometry={nodes.Wolf3D_Head.geometry}
//         material={materials.Wolf3D_Skin}
//         skeleton={nodes.Wolf3D_Head.skeleton}
//         morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary}
//         morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences}
//       />
//       <skinnedMesh
//         name="Wolf3D_Teeth"
//         geometry={nodes.Wolf3D_Teeth.geometry}
//         material={materials.Wolf3D_Teeth}
//         skeleton={nodes.Wolf3D_Teeth.skeleton}
//         morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary}
//         morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences}
//       />
//       <skinnedMesh
//         geometry={nodes.Wolf3D_Outfit_Top.geometry}
//         material={materials.Wolf3D_Outfit_Top}
//         skeleton={nodes.Wolf3D_Outfit_Top.skeleton}
//       />
//       <skinnedMesh
//         geometry={nodes.Wolf3D_Outfit_Bottom.geometry}
//         material={materials.Wolf3D_Outfit_Bottom}
//         skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton}
//       />
//       <skinnedMesh
//         geometry={nodes.Wolf3D_Outfit_Footwear.geometry}
//         material={materials.Wolf3D_Outfit_Footwear}
//         skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton}
//       />
//       <skinnedMesh
//         geometry={nodes.Wolf3D_Body.geometry}
//         material={materials.Wolf3D_Body}
//         skeleton={nodes.Wolf3D_Body.skeleton}
//       />
//     </group>
//   );
// }

// useGLTF.preload("/models/model.glb");
// useGLTF.preload("/models/animations.glb");

































import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { button, useControls } from "leva";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { SkinnedMesh } from "three";
import { useChat } from "../hooks/useChat";
import { useTranscribe } from "../hooks/useTranscribe";
import { VISEMES } from "wawa-lipsync";
import { lipsyncManager } from "../App";

interface AvatarProps {
  [key: string]: any;
}
interface FacialExpression {
  [key: string]: number;
}

interface FacialExpressions {
  [expression: string]: FacialExpression;
}

const facialExpressions: FacialExpressions = {
  default: {},
  smile: {
    viseme_sil: 0.13,
    viseme_PP: 0.62,
    viseme_FF: 0.24,
    viseme_DD: 0.04,
    browInnerUp: 0.17,
    eyeSquintLeft: 0.4,
    eyeSquintRight: 0.44,
    noseSneerLeft: 0.17,
    noseSneerRight: 0.14,
    mouthPressLeft: 0.61,
    mouthPressRight: 0.41,
  },
  funnyFace: {
    jawLeft: 0.63,
    mouthPucker: 0.53,
    noseSneerLeft: 1,
    noseSneerRight: 0.39,
    mouthLeft: 0.65,
    eyeLookUpLeft: 0.89,
    eyeLookUpRight: 0.87,
    cheekPuff: 1,
    mouthDimpleLeft: 0.81,
    mouthSmileRight: 0.35,
  },
  sad: {
    mouthFrownLeft: 1,
    mouthFrownRight: 1,
    mouthShrugLower: 0.78,
    browInnerUp: 0.45,
    eyeSquintLeft: 0.72,
    eyeSquintRight: 0.75,
    eyeLookDownLeft: 0.5,
    eyeLookDownRight: 0.5,
    jawForward: 1,
  },
  surprised: {
    browInnerUp: 1,
    eyeWideLeft: 0.5,
    eyeWideRight: 0.51,
    jawOpen: 0.64,
    mouthFunnel: 0.19,
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
    browInnerUp: 0.9,
    jawForward: 1,
    noseSneerLeft: 0.57,
    noseSneerRight: 0.51,
    eyeLookDownLeft: 0.02,
    eyeLookInLeft: 1,
    eyeLookInRight: 1,
    jawOpen: 0.96,
    mouthDimpleLeft: 0.96,
    mouthDimpleRight: 0.96,
    mouthStretchLeft: 0.28,
    mouthStretchRight: 0.29,
    mouthSmileLeft: 0.56,
    mouthSmileRight: 0.38,
    tongueOut: 0.96,
  },
};

let setupMode = false;

export function Avatar(props: AvatarProps) {
  const gltf = useGLTF("/models/model.glb");
  const { nodes, materials, scene } = gltf as any;

  const { message: chatMessage, onMessagePlayed: onChatMessagePlayed, chat } = useChat();
  const { message: transcribeMessage, onMessagePlayed: onTranscribeMessagePlayed } = useTranscribe();

  const message = chatMessage || transcribeMessage;
  const onMessagePlayed = chatMessage ? onChatMessagePlayed : onTranscribeMessagePlayed;

  const [audio, setAudio] = useState<HTMLAudioElement>();
  const [animation, setAnimation] = useState("Idle");

  const { animations } = useGLTF("/models/animations.glb");
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

  // Debug morph targets
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as SkinnedMesh).isSkinnedMesh && child.morphTargetDictionary) {
        console.log("Morph targets for", child.name, ":", Object.keys(child.morphTargetDictionary));
      }
    });
  }, [scene]);

  // Handle incoming messages + audio
  useEffect(() => {
    if (!message) {
      setAnimation("Idle");
      return;
    }

    setAnimation(message.animation);
    setFacialExpression(message.facialExpression);

    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    const newAudio = new Audio("data:audio/mp3;base64," + message.audio);
    lipsyncManager.connectAudio(newAudio);

    newAudio.onended = () => {
      onMessagePlayed?.();
    };

    newAudio.play().catch((err) => console.warn("Audio play failed:", err));

    setAudio(newAudio);

    return () => {
      newAudio.pause();
      newAudio.currentTime = 0;
    };
  }, [message?.audio]);

  // Animate body
  useEffect(() => {
    actions[animation]?.reset().fadeIn(mixer.stats.actions.inUse === 0 ? 0 : 0.5).play();
    return () => actions[animation]?.fadeOut(0.5);
  }, [animation]);

  const lerpMorphTarget = (target: string, value: number, speed = 0.1) => {
    scene.traverse((child: any) => {
      if (child.isSkinnedMesh && child.morphTargetDictionary) {
        const index = child.morphTargetDictionary[target];
        if (
          index === undefined ||
          child.morphTargetInfluences[index] === undefined
        ) {
          return;
        }
        child.morphTargetInfluences[index] = THREE.MathUtils.lerp(
          child.morphTargetInfluences[index],
          value,
          speed
        );

        if (!setupMode) {
          try {
            set({ [target]: value });
          } catch (e) {}
        }
      }
    });
  };

  // Frame-by-frame lipsync & expressions
  useFrame(() => {
    lerpMorphTarget("eyeBlinkLeft", blink || winkLeft ? 1 : 0, 0.5);
    lerpMorphTarget("eyeBlinkRight", blink || winkRight ? 1 : 0, 0.5);

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
      }, THREE.MathUtils.randInt(2000, 5000));
    };
    nextBlink();
    return () => clearTimeout(blinkTimeout);
  }, []);

  // Debugging controls
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
          if (key === "eyeBlinkLeft" || key === "eyeBlinkRight") return;
          const influence =
            nodes.EyeLeft.morphTargetInfluences?.[
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
    if (!nodes.EyeLeft?.morphTargetDictionary) return {};
    return Object.assign(
      {},
      ...Object.keys(nodes.EyeLeft.morphTargetDictionary).map((key) => {
        const initialValue =
          nodes.EyeLeft.morphTargetInfluences?.[
            nodes.EyeLeft.morphTargetDictionary?.[key] || 0
          ] || 0;
        return {
          [key]: {
            label: key,
            value: 0,
            min: initialValue,
            max: 1,
            onChange: (val: number) => {
              if (setupMode) lerpMorphTarget(key, val, 1);
            },
          },
        };
      })
    );
  });

  return (
    <group {...props} dispose={null} ref={group}>
      <primitive object={nodes.Hips} />
      <skinnedMesh
        name="EyeLeft"
        geometry={nodes.EyeLeft.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeLeft.skeleton}
        morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences}
      />
      <skinnedMesh
        name="EyeRight"
        geometry={nodes.EyeRight.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeRight.skeleton}
        morphTargetDictionary={nodes.EyeRight.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeRight.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Head"
        geometry={nodes.Wolf3D_Head.geometry}
        material={materials.Wolf3D_Skin}
        skeleton={nodes.Wolf3D_Head.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Teeth"
        geometry={nodes.Wolf3D_Teeth.geometry}
        material={materials.Wolf3D_Teeth}
        skeleton={nodes.Wolf3D_Teeth.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Top.geometry}
        material={materials.Wolf3D_Outfit_Top}
        skeleton={nodes.Wolf3D_Outfit_Top.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Bottom.geometry}
        material={materials.Wolf3D_Outfit_Bottom}
        skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Footwear.geometry}
        material={materials.Wolf3D_Outfit_Footwear}
        skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Body.geometry}
        material={materials.Wolf3D_Body}
        skeleton={nodes.Wolf3D_Body.skeleton}
      />
    </group>
  );
}

useGLTF.preload("/models/model.glb");
useGLTF.preload("/models/animations.glb");
