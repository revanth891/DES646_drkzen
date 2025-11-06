import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";

const backendUrl = "http://localhost:3000";
// const backendUrl = "https://vulture-assuring-mammoth.ngrok-free.app";
// const backendUrl = "https://avatargpt-backend.onrender.com";



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

interface TranscribeContextType {
    transcribe: (audioFile: File) => Promise<void>;
    message: Message | null;
    onMessagePlayed: () => void;
    loading: boolean;
    cameraState: "zoomed" | "default" | "zoomeout";
    setCameraState: (state: "zoomed" | "default" | "zoomeout") => void;
    emotionData: EmotionData | null;
}

interface TranscribeProviderProps {
    children: ReactNode;
}

const TranscribeContext = createContext<TranscribeContextType | undefined>(undefined);

export const TranscribeProvider = ({ children }: TranscribeProviderProps) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState<Message | null>(null);
    const [loading, setLoading] = useState(false);
    const [cameraState, setCameraState] = useState<
        "zoomed" | "default" | "zoomeout"
    >("default");
    const [emotionData, setEmotionData] = useState<EmotionData | null>(null);

    const transcribe = async (audioFile: File) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('audio', audioFile);

            const data = await fetch(`${backendUrl}/transcribe`, {
                method: "POST",
                body: formData,
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

            setMessages((prevMessages) => [...prevMessages, ...newMessages]);
        } catch (error) {
            console.error("Error in transcribe:", error);
        } finally {
            setLoading(false);
        }
    };

    const onMessagePlayed = () => {
        setMessages((messages) => messages.slice(1));
    };

    useEffect(() => {
        if (messages.length > 0) {
            setMessage(messages[0]);
        } else {
            setMessage(null);
        }
    }, [messages]);

    return (
        <TranscribeContext.Provider
            value={{
                transcribe,
                message,
                onMessagePlayed,
                loading,
                cameraState,
                setCameraState,
                emotionData,
            }}
        >
            {children}
        </TranscribeContext.Provider>
    );
};

export const useTranscribe = (): TranscribeContextType => {
    const context = useContext(TranscribeContext);
    if (!context) {
        throw new Error("useTranscribe must be used within a TranscribeProvider");
    }
    return context;
};


