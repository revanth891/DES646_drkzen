// frontend/src/components/UI.tsx - Add these imports and state variables
import { useRef, useState, useEffect } from "react";
import { useChat } from "../hooks/useChat";
import { useTranscribe } from "../hooks/useTranscribe";

export const UI = ({
    hidden,
    ...props
}: {
    hidden?: boolean;
    [key: string]: any;
}) => {
    const input = useRef<HTMLInputElement>(null);
    const { chat, loading: chatLoading, setCameraState: setChatCameraState, message: chatMessage } = useChat();
    const { transcribe, loading: transcribeLoading, setCameraState: setTranscribeCameraState, message: transcribeMessage } = useTranscribe();
    const [voiceListening, setVoiceListening] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<BlobPart[]>([]);
    const backendUrl = "http://localhost:3000";
    const [mode, setMode] = useState<"text" | "voice">("text");

    // Function to send message to the chat
    const sendMessage = () => {
        if (input.current && input.current.value.trim() !== "") {
            chat(input.current.value);
            input.current.value = "";
        }
    };

    // Function to start recording audio
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];
            
            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    audioChunksRef.current.push(e.data);
                }
            };
            
            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                setAudioBlob(audioBlob);
                
                // Convert blob to File object
                const audioFile = new File([audioBlob], 'recording.wav', { type: 'audio/wav' });
                
                // Use the transcribe function from useTranscribe hook
                try {
                    setVoiceListening(true); // Show loading state
                    await transcribe(audioFile);
                } catch (error) {
                    console.error("Error transcribing audio:", error);
                } finally {
                    setVoiceListening(false);
                }
                
                // Stop all tracks
                stream.getTracks().forEach(track => track.stop());
            };
            
            mediaRecorder.start();
            setIsRecording(true);
        } catch (error) {
            console.error("Error accessing microphone:", error);
            alert("Could not access microphone. Please check permissions.");
        }
    };

    // Function to stop recording
    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    // Original voice input function using Web Speech API
    const startListening = () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert("Your browser doesn't support speech recognition. Try Chrome or Edge.");
            return;
        }

        const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-US";

        recognition.onstart = () => {
            setVoiceListening(true);
        };

        recognition.onend = () => {
            setVoiceListening(false);
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            if (input.current) {
                input.current.value = transcript;
            }
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error", event.error);
            setVoiceListening(false);
        };

        recognition.start();
    };

    // Determine which loading state and message to use
    const loading = chatLoading || transcribeLoading;
    const message = chatMessage || transcribeMessage;
    const setCameraState = (state: "zoomed" | "default" | "zoomeout") => {
        setChatCameraState(state);
        setTranscribeCameraState(state);
    };

    return (
        <div className="fixed top-0 left-0 w-screen h-screen z-10 pointer-events-none justify-between flex flex-col">
            <div className="p-8 flex justify-between w-full">
                <div></div>
                <div className="flex gap-4 pointer-events-auto">
                    <button
                        className={`rounded-full aspect-square h-[2.5rem] flex-shrink-0 p-[0.75rem] focus:outline-none hover:opacity-90 transition-opacity duration-200 focus:ring-1 focus:ring-[#FFF] focus:ring-offset-2 ring-offset-[#1F1F1F] ${
                            mode === "text" ? "bg-gradient-to-b from-[#DE4561] to-[#5B2996]" : "bg-[#1F1F1F]"
                        }`}
                        onClick={() => setMode("text")}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                        </svg>
                    </button>
                    <button
                        className={`rounded-full aspect-square h-[2.5rem] flex-shrink-0 p-[0.75rem] focus:outline-none hover:opacity-90 transition-opacity duration-200 focus:ring-1 focus:ring-[#FFF] focus:ring-offset-2 ring-offset-[#1F1F1F] ${
                            mode === "voice" ? "bg-gradient-to-b from-[#DE4561] to-[#5B2996]" : "bg-[#1F1F1F]"
                        }`}
                        onClick={() => setMode("voice")}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                        </svg>
                    </button>
                </div>
            </div>
            
            <div className="mb-[6.25rem] self-center pointer-events-auto">
                {mode === "text" ? (
                    <div className="flex min-w-[37.5rem] rounded-[4rem] bg-gradient-to-r from-[#D44264] to-[#6C2C8E] p-[3px]">
                        <div className="flex-1 flex items-center bg-[#1F1F1F] rounded-[4rem] px-[1.5rem]">
                            <input
                                ref={input}
                                className="flex-1 bg-transparent outline-none text-white py-[1rem] placeholder:text-[#FFFFFF80]"
                                placeholder="Send a message..."
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        sendMessage();
                                    }
                                }}
                            />
                            <button
                                className="rounded-full aspect-square h-[2.5rem] flex-shrink-0 p-[0.75rem] bg-gradient-to-b from-[#DE4561] to-[#5B2996] focus:outline-none hover:opacity-90 transition-opacity duration-200 focus:ring-1 focus:ring-[#FFF] focus:ring-offset-2 ring-offset-[#1F1F1F]"
                                onClick={sendMessage}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-white">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-[1rem] items-center text-white">
                        <button
                            className={`self-stretch aspect-square rounded-full bg-gradient-to-b from-[#DE4561] to-[#5B2996] min-h-[2.5rem] flex-shrink-0 p-[0.75rem] focus:outline-none hover:opacity-90 transition-opacity duration-200 focus:ring-1 focus:ring-[#FFF] focus:ring-offset-2 ring-offset-[#1F1F1F] ${isRecording ? 'animate-pulse' : ''}`}
                            onClick={(e) => {
                                e.preventDefault();
                                if (isRecording) {
                                    stopRecording();
                                } else {
                                    startRecording();
                                }
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1}
                                stroke="currentColor"
                                className="h-[3rem] text-white"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z"
                                />
                            </svg>
                        </button>
                        <div>
                            {isRecording ? "Recording... (tap to stop)" : 
                             voiceListening || transcribeLoading ? "Processing..." : "Tap to record"}
                        </div>
                        
                        {input.current?.value && input.current.value.trim() !== "" && (
                            <button
                                className="mt-4 py-2 px-4 bg-gradient-to-b from-[#DE4561] to-[#5B2996] rounded-full"
                                onClick={sendMessage}
                            >
                                Send
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};