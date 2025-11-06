
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
  "mouthSmile": 1
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
  "viseme_O": 0.34,
  "viseme_nn": 0.12,
  "viseme_DD": 0.05,
  "viseme_PP": 0.9500000000000001,
  "eye_close": 0.48
},
  surprised: {
  "viseme_aa": 1,
  "eyesLookUp": 1,
  "mouthSmile": 0.36
},
  angry: {
  "viseme_FF": 0.62,
  "eye_close": 0.24,
  "mouthSmile": 0.36
},
  crazy: {
  "viseme_aa": 0.56,
  "viseme_FF": 0.62,
  "viseme_DD": 0.05,
  "eye_close": 0.24,
  "eye closed.L": 0.99993896484375,
  "eye closed.R": 0.99993896484375,
  "eyesLookUp": 1,
  "mouthSmile": 1
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
  const gltf = useGLTF("/models/model9.glb");
  
  const { nodes, materials, scene } = gltf as any;

  const { message: chatMessage, onMessagePlayed: onChatMessagePlayed, chat } = useChat();
  const { message: transcribeMessage, onMessagePlayed: onTranscribeMessagePlayed } = useTranscribe();

  const message = chatMessage || transcribeMessage;
  const onMessagePlayed = chatMessage ? onChatMessagePlayed : onTranscribeMessagePlayed;

  const [audio, setAudio] = useState<HTMLAudioElement>();
  const [animation, setAnimation] = useState("Idle");

  const { animations } = useGLTF("/models/animations_Naoki.glb");
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

  
  // // Animate body
  // useEffect(() => {
  //   actions[animation]
  //     ?.reset()
  //     .fadeIn(mixer.stats.actions.inUse === 0 ? 0 : 0.5)
  //     .play();
  //   return () => actions[animation]?.fadeOut(0.5);
  // }, [animation]);

useEffect(() => {
  const action = actions[animation];
  // if (!action) return;

  action.reset().fadeIn(0.5).play();

  return () => {
    action.fadeOut(0.5);
  };
}, [animation, actions]);
  
  const lerpMorphTarget = (target: string, value: number, speed = 0.1) => {
    scene.traverse((child: any) => {
      if ((child as SkinnedMesh).isSkinnedMesh && (child as SkinnedMesh).morphTargetDictionary) {
        const skinnedMesh = child as SkinnedMesh;
        const index = nodes.Head.morphTargetDictionary?.[target];
        if (
          index === undefined ||
          !nodes.Head.morphTargetInfluences ||
          nodes.Head.morphTargetInfluences[index] === undefined
        ) {
          return;
        }
        nodes.Head.morphTargetInfluences[index] = THREE.MathUtils.lerp(
          nodes.Head.morphTargetInfluences[index],
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

  // Frame-by-frame lipsync & expressions
  // useFrame(() => {
  //   if (setupMode) return;

  //   // Eye blink / wink
  //   lerpMorphTarget("eye closed.L", blink || winkLeft ? 1 : 0, 0.15);
  //   lerpMorphTarget("eye closed.R", blink || winkRight ? 1 : 0, 0.15);

  //   // Lipsync viseme updates
  //   const viseme = lipsyncManager.viseme;
  //   // console.log(viseme);
  //   const state = lipsyncManager.state;
  //   // console.log(state);

  //   lerpMorphTarget(viseme, 0.6, state === "vowel" ? 0.2 : 0.4);
  //   // console.log(VISEMES);
  //   Object.values(VISEMES).forEach((v) => {
  //     if (v !== viseme) lerpMorphTarget(v, 0, state === "vowel" ? 0.1 : 0.2);
  //   });
  // });



  useFrame(() => {
    lerpMorphTarget("eye closed.L", blink || winkLeft ? 1 : 0, 0.5);
    lerpMorphTarget("eye closed.R", blink || winkRight ? 1 : 0, 0.5);

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
          if (nodes.Head?.morphTargetDictionary) {
            Object.keys(nodes.Head.morphTargetDictionary).forEach((key) => {
              if (key === "eye closed.L" || key === "eye closed.R") {
                return; // eyes wink/blink are handled separately
              }
              const influence = nodes.Head.morphTargetInfluences?.[
                nodes.Head.morphTargetDictionary?.[key] || 0
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
      if (!nodes.Head?.morphTargetDictionary) return {};
      
      return Object.assign(
        {},
        ...Object.keys(nodes.Head.morphTargetDictionary).map((key) => {
          const initialValue = nodes.Head.morphTargetInfluences?.[
            nodes.Head.morphTargetDictionary?.[key] || 0
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

  return (
    <group {...props} scale={1.006} dispose={null} ref={group}>
      <skinnedMesh
        geometry={nodes.Body.geometry}
        material={materials.clothes}
        skeleton={nodes.Body.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Hands.geometry}
        material={materials['MAT-skin']}
        skeleton={nodes.Hands.skeleton}
      />
      <skinnedMesh
        name="Head"
        geometry={nodes.Head.geometry}
        material={materials['MAT-skin']}
        skeleton={nodes.Head.skeleton}
        morphTargetDictionary={nodes.Head.morphTargetDictionary}
        morphTargetInfluences={nodes.Head.morphTargetInfluences}
      />
      <primitive object={nodes.mixamorig2Hips} />
      <skinnedMesh
        geometry={nodes.Glasses_1.geometry}
        material={materials.daz__A06}
        skeleton={nodes.Glasses_1.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Glasses_2.geometry}
        material={materials.daz__B05}
        skeleton={nodes.Glasses_2.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Glasses_3.geometry}
        material={materials.daz__E04}
        skeleton={nodes.Glasses_3.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Glasses_4.geometry}
        material={materials.daz__E08}
        skeleton={nodes.Glasses_4.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Glasses_5.geometry}
        material={materials.daz__F05}
        skeleton={nodes.Glasses_5.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Glasses_6.geometry}
        material={materials.daz__I05}
        skeleton={nodes.Glasses_6.skeleton}
      />
    </group>
  )
}


useGLTF.preload("/models/model9.glb");
useGLTF.preload("/models/animations_Naoki.glb");
