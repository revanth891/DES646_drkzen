

import { useEffect, useState } from "react";
import { useChat } from "../hooks/useChat";

export const ChatOverlay = ({ darkMode }: { darkMode: boolean }) => {
  const { messages } = useChat();
  const [isMobile, setIsMobile] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640); // sm breakpoint
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Show overlay automatically if new messages appear (only on mobile)
  useEffect(() => {
    if (isMobile && messages.length > 0) {
      setShowHistory(true);
      // auto-hide after a few seconds if you want:
      setTimeout(() => setShowHistory(false), 5000);
    }
  }, [messages, isMobile]);

  return (
    <div
      className={`pointer-events-auto transition-all duration-500 ease-in-out z-50
        ${isMobile
          ? `fixed left-0 w-full px-2 pb-[4.5rem] sm:pb-0` // space for search bar
          : `absolute bottom-5 left-1/2 transform -translate-x-1/2 w-[1000px] max-w-full`
        }
        ${isMobile && showHistory ? "bottom-[1rem] opacity-100" : isMobile ? "bottom-0 opacity-0 pointer-events-none" : ""}`}
      style={{
        transform: isMobile
          ? `translateY(${showHistory ? "0%" : "100%"})`
          : undefined,
      }}
    >
      <div className="gradient-border rounded-2xl">
        <div
          className={`inner rounded-2xl p-4 shadow-xl transition-all duration-500 ${
            darkMode ? "bg-white/10 text-white" : "bg-black/5 text-white"
          }`}
          style={{
            backgroundImage: darkMode
              ? `radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)`
              : `radial-gradient(rgba(0,0,0,0.05) 1px, transparent 1px)`,
            backgroundSize: "4px 4px",
          }}
        >
          <h2
            className={`text-lg font-semibold text-center mb-3 ${
              darkMode ? "text-white" : "text-white"
            }`}
          >
            Your AI Response
          </h2>

          <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-1">
            {messages?.length > 0 ? (
              messages.map((msg, i) => (
                <div
                  key={i}
                  className={`rounded-lg px-3 py-2 text-sm shadow-sm border ${
                    darkMode
                      ? "bg-white/10 border-white/10 text-white"
                      : "bg-black/5 border-black/10 text-white"
                  }`}
                >
                  {msg.text}
                </div>
              ))
            ) : (
              <p
                className={`text-center text-sm ${
                  darkMode ? "text-white/60" : "text-white/60"
                }`}
              >
                Ask something to begin!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
