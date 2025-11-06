// src/components/Avatar.tsx
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
  modelUrl: string;
}

let setupMode = false;

export function Avatar({ modelUrl }: AvatarProps) {
  const { scene, nodes, materials } = useGLTF(modelUrl) as any;
  const { message: chatMessage, onMessagePlayed: onChatMessagePlayed, chat } = useChat();
  const { message: transcribeMessage, onMessagePlayed: onTranscribeMessagePlayed } = useTranscribe();

  const message = chatMessage || transcribeMessage;
  const onMessagePlayed = chatMessage ? onChatMessagePlayed : onTranscribeMessagePlayed;

  const [audio, setAudio] = useState<HTMLAudioElement>();
  const [animation, setAnimation] = useState("Idle");
  const { animations } = useGLTF("/models/animations_stylized.glb");
  const group = useRef<any>();
  const { actions, mixer } = useAnimations(animations, group);

  const [facialExpression, setFacialExpression] = useState("");
  const [blink, setBlink] = useState(false);
  const [winkLeft, setWinkLeft] = useState(false);
  const [winkRight, setWinkRight] = useState(false);

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as SkinnedMesh).isSkinnedMesh && child.morphTargetDictionary) {
        console.log("Morph targets for", child.name, ":", Object.keys(child.morphTargetDictionary));
      }
    });
  }, [scene]);

  useEffect(() => {
    if (!message) {
      setAnimation("Idle");
      return;
    }
    setAnimation(message.animation);
    setFacialExpression(message.facialExpression);

    const audio = new Audio("data:audio/mp3;base64," + message.audio);
    lipsyncManager.connectAudio(audio);
    audio.play();
    setAudio(audio);
    audio.onended = onMessagePlayed;
  }, [message, onMessagePlayed]);

  useEffect(() => {
    actions[animation]?.reset().fadeIn(0.5).play();
    return () => actions[animation]?.fadeOut(0.5);
  }, [animation]);

  const lerpMorphTarget = (target: string, value: number, speed = 0.1) => {
    scene.traverse((child: any) => {
      if (child.isSkinnedMesh && child.morphTargetDictionary) {
        const index = child.morphTargetDictionary[target];
        if (index !== undefined && child.morphTargetInfluences) {
          child.morphTargetInfluences[index] = THREE.MathUtils.lerp(
            child.morphTargetInfluences[index],
            value,
            speed
          );
        }
      }
    });
  };

  useFrame(() => {
    if (setupMode) return;

    lerpMorphTarget("eyeBlinkLeft", blink || winkLeft ? 1 : 0, 0.5);
    lerpMorphTarget("eyeBlinkRight", blink || winkRight ? 1 : 0, 0.5);

    const viseme = lipsyncManager.viseme;
    const state = lipsyncManager.state;

    lerpMorphTarget(viseme, 1, state === "vowel" ? 0.2 : 0.4);
    Object.values(VISEMES).forEach((v) => {
      if (v !== viseme) lerpMorphTarget(v, 0, state === "vowel" ? 0.1 : 0.2);
    });
  });

  useEffect(() => {
    let animationFrameId: number;
    const analyzeAudio = () => {
      lipsyncManager.processAudio();
      animationFrameId = requestAnimationFrame(analyzeAudio);
    };
    animationFrameId = requestAnimationFrame(analyzeAudio);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

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
    enableSetupMode: button(() => {
      setupMode = true;
    }),
    disableSetupMode: button(() => {
      setupMode = false;
    }),
  });

  return <primitive ref={group} object={scene} dispose={null} />;
}

useGLTF.preload("/models/animations.glb");
