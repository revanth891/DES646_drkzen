import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

// const backendUrl = "http://localhost:3000"; use this if run locally
const backendUrl = "https://des646-drkzen.onrender.com/";
// const backendUrl = "https://vulture-assuring-mammoth.ngrok-free.app";


interface Message {
  animation: string;
  facialExpression: string;
  lipsync: {
    mouthCues: Array<{
      start: number;
      end: number;
      value: string;
    }>;
  };
  audio: string;
  text: string;
}

interface EmotionData {
  emotion: string;
  confidence: number;
  polarity: number;
  subjectivity: number;
  vader_scores: {
    neg: number;
    neu: number;
    pos: number;
    compound: number;
  };
}

interface ChatContextType {
  chat: (message: string) => Promise<void>;
  message: Message | null; // currently playing
  messages: Message[];     // full history
  onMessagePlayed: () => void;
  loading: boolean;
  cameraState: "zoomed" | "default" | "zoomeout";
  setCameraState: (state: "zoomed" | "default" | "zoomeout") => void;
  emotionData: EmotionData | null;
}

interface ChatProviderProps {
  children: ReactNode;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: ChatProviderProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [playQueue, setPlayQueue] = useState<Message[]>([]);
  const [message, setMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(false);
  const [cameraState, setCameraState] = useState<
    "zoomed" | "default" | "zoomeout"
  >("default");
  const [emotionData, setEmotionData] = useState<EmotionData | null>(null);

  const chat = async (input: string) => {
    setLoading(true);
    try {
      const data = await fetch(`${backendUrl}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      const resp = await data.json();
      const newMessages = resp.messages as Message[];
      const emotion = resp.emotion as EmotionData;

      // Set emotion data for display
      if (emotion) {
        setEmotionData(emotion);
      }

      // // Preload audio
      // for (const msg of newMessages) {
      //   const audio = new Audio(`data:audio/mp3;base64,${msg.audio}`);
      //   await audio.play().catch(() => {});
      //   audio.pause();
      //   audio.currentTime = 0;
      // }

      // ✅ Append to history
      setMessages((prev) => [...prev, ...newMessages]);

      // ✅ Enqueue for playback
      setPlayQueue((prev) => [...prev, ...newMessages]);
    } catch (error) {
      console.error("Error in chat:", error);
    } finally {
      setLoading(false);
    }
  };

  // Manage currently playing message
  useEffect(() => {
    if (playQueue.length > 0) {
      setMessage(playQueue[0]);
    } else {
      setMessage(null);
    }
  }, [playQueue]);

  // ✅ Only pop from queue after speaking
  const onMessagePlayed = () => {
    setPlayQueue((queue) => queue.slice(1));
  };

  return (
    <ChatContext.Provider
      value={{
        chat,
        message,
        messages,
        onMessagePlayed,
        loading,
        cameraState,
        setCameraState,
        emotionData,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};


// import {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
//   ReactNode,
// } from "react";

// const backendUrl = "http://localhost:3000";

// interface Message {
//   animation: string;
//   facialExpression: string;
//   lipsync: {
//     mouthCues: Array<{
//       start: number;
//       end: number;
//       value: string;
//     }>;
//   };
//   audio: string; // base64 MP3
//   text: string;
// }

// interface ChatContextType {
//   chat: (message: string) => Promise<void>;
//   message: Message | null; // currently playing
//   messages: Message[];     // full history
//   onMessagePlayed: () => void;
//   loading: boolean;
//   cameraState: "zoomed" | "default" | "zoomeout";
//   setCameraState: (state: "zoomed" | "default" | "zoomeout") => void;
// }

// interface ChatProviderProps {
//   children: ReactNode;
// }

// const ChatContext = createContext<ChatContextType | undefined>(undefined);

// export const ChatProvider = ({ children }: ChatProviderProps) => {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [playQueue, setPlayQueue] = useState<Message[]>([]);
//   const [message, setMessage] = useState<Message | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [cameraState, setCameraState] = useState<
//     "zoomed" | "default" | "zoomeout"
//   >("default");

//   const chat = async (input: string) => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${backendUrl}/chat`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ message: input }),
//       });

//       const resp = await res.json();

//       // Safety check
//       if (!Array.isArray(resp.messages)) {
//         console.error("Invalid messages from backend:", resp);
//         return;
//       }

//       const newMessages = resp.messages as Message[];

//       // Preload audio
//       for (const msg of newMessages) {
//         const audio = new Audio(`data:audio/mp3;base64,${msg.audio}`);
//         await audio.play().catch(() => {});
//         audio.pause();
//         audio.currentTime = 0;
//       }

//       setMessages((prev) => [...prev, ...newMessages]);
//       setPlayQueue((prev) => [...prev, ...newMessages]);

//     } catch (error) {
//       console.error("Error in chat:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Manage currently playing message
//   useEffect(() => {
//     if (playQueue.length > 0) {
//       setMessage(playQueue[0]);
//     } else {
//       setMessage(null);
//     }
//   }, [playQueue]);

//   // After message is played, pop it
//   const onMessagePlayed = () => {
//     setPlayQueue((queue) => queue.slice(1));
//   };

//   return (
//     <ChatContext.Provider
//       value={{
//         chat,
//         message,
//         messages,
//         onMessagePlayed,
//         loading,
//         cameraState,
//         setCameraState,
//       }}
//     >
//       {children}
//     </ChatContext.Provider>
//   );
// };

// export const useChat = (): ChatContextType => {
//   const context = useContext(ChatContext);
//   if (!context) {
//     throw new Error("useChat must be used within a ChatProvider");
//   }
//   return context;
// };
