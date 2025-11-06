import { useEffect, useState } from "react";
import { useChat } from "../hooks/useChat";
import { useTranscribe } from "../hooks/useTranscribe";
import { Moon, Sun } from "lucide-react";

export const EmotionDisplay = ({ darkMode }: { darkMode?: boolean }) => {
  const { messages: chatMessages, emotionData: chatEmotionData } = useChat();
  const { emotionData: transcribeEmotionData } = useTranscribe();

  // Use emotion data from either chat or transcribe, prioritizing the most recent
  const emotionData = chatEmotionData || transcribeEmotionData;
  const messages = chatMessages;
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [themeDarkMode, setThemeDarkMode] = useState(true); // Default to dark mode

  // Sync with system theme or use dark mode by default
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setThemeDarkMode(savedTheme === 'dark');
    } else {
      setThemeDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !themeDarkMode;
    setThemeDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  // Simulate emotion detection steps for visual appeal
  const steps = [
    { label: "Analyzing text...", color: themeDarkMode ? "text-blue-400" : "text-blue-600" },
    { label: "Detecting sentiment...", color: themeDarkMode ? "text-green-400" : "text-green-600" },
    { label: "Processing emotion...", color: themeDarkMode ? "text-yellow-400" : "text-yellow-600" },
    { label: "Generating response...", color: themeDarkMode ? "text-purple-400" : "text-purple-600" },
  ];

  // Show emotion detection process when emotion data or messages change
  useEffect(() => {
    if (emotionData) {
      // Show results when emotion data is available
      setIsVisible(true);
      setCurrentStep(steps.length - 1);
    } else if (chatMessages.length > 0) {
      // Show processing animation when chat interaction starts
      setIsVisible(true);
      setCurrentStep(0);
      const stepInterval = setInterval(() => {
        setCurrentStep((prev) => prev < steps.length - 1 ? prev + 1 : prev);
      }, 800);
      return () => clearInterval(stepInterval);
    }
  }, [chatMessages.length, emotionData]);

  // Separate effect for transcribe to ensure it triggers visibility
  useEffect(() => {
    if (transcribeEmotionData) {
      setIsVisible(true);
      setCurrentStep(steps.length - 1);
    }
  }, [transcribeEmotionData]);

  const getEmotionIcon = (emotion: string) => {
    const iconMap: { [key: string]: JSX.Element } = {
      happy: (
        <svg className={`w-8 h-8 ${themeDarkMode ? "text-green-400" : "text-green-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h6m4.5 5a8.5 8.5 0 11-17 0 8.5 8.5 0 0117 0z" />
        </svg>
      ),
      sad: (
        <svg className={`w-8 h-8 ${themeDarkMode ? "text-blue-400" : "text-blue-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h6m4.5 5a8.5 8.5 0 11-17 0 8.5 8.5 0 0117 0z" />
        </svg>
      ),
      angry: (
        <svg className={`w-8 h-8 ${themeDarkMode ? "text-red-400" : "text-red-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9.878 9.878a3 3 0 104.244 4.244M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      surprised: (
        <svg className={`w-8 h-8 ${themeDarkMode ? "text-yellow-400" : "text-yellow-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      excited: (
        <svg className={`w-8 h-8 ${themeDarkMode ? "text-purple-400" : "text-purple-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      calm: (
        <svg className={`w-8 h-8 ${themeDarkMode ? "text-cyan-400" : "text-cyan-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      neutral: (
        <svg className={`w-8 h-8 ${themeDarkMode ? "text-gray-400" : "text-gray-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      // Additional emotions from advanced detector
      fear: (
        <svg className={`w-8 h-8 ${themeDarkMode ? "text-orange-400" : "text-orange-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ),
      disgust: (
        <svg className={`w-8 h-8 ${themeDarkMode ? "text-emerald-400" : "text-emerald-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9.878 9.878a3 3 0 104.244 4.244m-3.183-.621L15 9m-6 6h6m4.5 5a8.5 8.5 0 11-17 0 8.5 8.5 0 0117 0z" />
        </svg>
      ),
      trust: (
        <svg className={`w-8 h-8 ${themeDarkMode ? "text-indigo-400" : "text-indigo-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    };
    return iconMap[emotion] || iconMap.neutral;
  };

  const getEmotionColor = (emotion: string) => {
    const colorMap: { [key: string]: string } = {
      happy: themeDarkMode ? "text-green-400 border-green-400" : "text-green-600 border-green-600",
      sad: themeDarkMode ? "text-blue-400 border-blue-400" : "text-blue-600 border-blue-600",
      angry: themeDarkMode ? "text-red-400 border-red-400" : "text-red-600 border-red-600",
      surprised: themeDarkMode ? "text-yellow-400 border-yellow-400" : "text-yellow-600 border-yellow-600",
      excited: themeDarkMode ? "text-purple-400 border-purple-400" : "text-purple-600 border-purple-600",
      calm: themeDarkMode ? "text-cyan-400 border-cyan-400" : "text-cyan-600 border-cyan-600",
      neutral: themeDarkMode ? "text-gray-400 border-gray-400" : "text-gray-600 border-gray-600",
      fear: themeDarkMode ? "text-orange-400 border-orange-400" : "text-orange-600 border-orange-600",
      disgust: themeDarkMode ? "text-emerald-400 border-emerald-400" : "text-emerald-600 border-emerald-600",
      trust: themeDarkMode ? "text-indigo-400 border-indigo-400" : "text-indigo-600 border-indigo-600",
    };
    return colorMap[emotion] || (themeDarkMode ? "text-gray-400 border-gray-400" : "text-gray-600 border-gray-600");
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 pointer-events-auto">
      <div className={`gradient-border rounded-xl transition-all duration-300 ${
        emotionData ? 'w-72' : 'w-56'
      } ${themeDarkMode ? "dark-gradient" : ""}`}>
        <div
          className={`inner rounded-xl p-4 shadow-2xl transition-all duration-300 backdrop-blur-md relative ${
            themeDarkMode ? "bg-black/80 text-white" : "bg-white/90 text-black"
          }`}
        >
          <div className="absolute top-2 right-2 flex gap-2">
            <button
              onClick={toggleTheme}
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-200 ${
                themeDarkMode ? "bg-white/10 hover:bg-white/20" : "bg-black/10 hover:bg-black/20"
              }`}
            >
              {themeDarkMode ? (
                <Sun size={14} className="text-yellow-300" />
              ) : (
                <Moon size={14} className="text-blue-500" />
              )}
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-200 ${
                themeDarkMode ? "bg-white/10 hover:bg-white/20" : "bg-black/10 hover:bg-black/20"
              }`}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <h3 className="text-lg font-bold mb-3 flex items-center gap-2 pr-20">
            <svg className={`w-6 h-6 ${themeDarkMode ? "text-purple-400" : "text-purple-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Emotion Analysis
          </h3>

          {!emotionData ? (
            // Processing steps
            <div className="space-y-3">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 transition-all duration-500 ${
                    index <= currentStep ? 'opacity-100' : 'opacity-30'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${
                    index < currentStep ? 'bg-green-400' : index === currentStep ? 'bg-blue-400 animate-pulse' : 'bg-gray-400'
                  }`} />
                  <span className={`text-sm ${
                    index <= currentStep
                      ? step.color
                      : themeDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {step.label}
                  </span>
                  {index < currentStep && (
                    <span className="text-green-400 ml-auto">✓</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            // Emotion results
            <div className="space-y-4">
              <div className="text-center">
                <div className="flex justify-center mb-2">{getEmotionIcon(emotionData.emotion)}</div>
                <div className={`text-xl font-bold capitalize ${getEmotionColor(emotionData.emotion)}`}>
                  {emotionData.emotion}
                </div>
                <div className={`text-sm mt-1 ${
                  themeDarkMode ? "text-gray-400" : "text-gray-600"
                }`}>
                  Confidence: {(emotionData.confidence * 100).toFixed(1)}%
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className={`rounded-lg p-2 ${
                  themeDarkMode ? "bg-white/10" : "bg-black/5"
                }`}>
                  <div className={`${
                    themeDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}>Polarity</div>
                  <div className="font-mono">{emotionData.polarity.toFixed(2)}</div>
                </div>
                <div className={`rounded-lg p-2 ${
                  themeDarkMode ? "bg-white/10" : "bg-black/5"
                }`}>
                  <div className={`${
                    themeDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}>Subjectivity</div>
                  <div className="font-mono">{emotionData.subjectivity.toFixed(2)}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className={`text-sm ${
                  themeDarkMode ? "text-gray-400" : "text-gray-600"
                }`}>Sentiment Scores</div>
                <div className="flex gap-1">
                  <div className="flex-1 bg-red-500 rounded text-xs text-center py-1 text-white">
                    Neg: {(emotionData.vader_scores.neg * 100).toFixed(0)}%
                  </div>
                  <div className="flex-1 bg-gray-500 rounded text-xs text-center py-1 text-white">
                    Neu: {(emotionData.vader_scores.neu * 100).toFixed(0)}%
                  </div>
                  <div className="flex-1 bg-green-500 rounded text-xs text-center py-1 text-white">
                    Pos: {(emotionData.vader_scores.pos * 100).toFixed(0)}%
                  </div>
                </div>
              </div>

              <div className={`text-xs text-center ${
                themeDarkMode ? "text-gray-500" : "text-gray-600"
              }`}>
                Avatar response adapted to detected emotion
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
