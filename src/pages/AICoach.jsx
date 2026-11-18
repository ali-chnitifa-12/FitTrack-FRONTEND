import PageHeading from "../Components/PageHeading.jsx";
import { useState, useRef, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, RefreshCcw, ChevronDown } from "lucide-react";
import { AuthContext } from "../context/AuthContext.jsx";
import api from "../Utils/axios.jsx";
import DisclaimerBanner from "../Components/DisclaimerBanner.jsx";
import analytics from "../Utils/analytics";

// Starter suggestions shown before first message
const suggestions = [
  "Am I on track to hit my goal weight?",
  "What should I eat before a workout?",
  "Create a 3-day workout split for me",
  "Why has my weight plateaued?",
  "How much protein do I need daily?",
  "Give me a high-protein breakfast idea",
];

// Typing indicator component
function TypingIndicator() {
  return (
    <div className="flex items-end gap-3">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-500/20">
        <Bot size={16} className="text-black" />
      </div>
      <div className="bg-gray-800/80 border border-gray-700/50 rounded-2xl rounded-bl-sm px-4 py-3">
        <div className="flex gap-1.5 items-center">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-green-400 rounded-full"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Single message bubble
function MessageBubble({ msg }) {
  const isAI = msg.role === "assistant";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`flex items-end gap-3 ${isAI ? "" : "flex-row-reverse"}`}
    >
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${
          isAI
            ? "bg-gradient-to-br from-green-500 to-teal-500 shadow-green-500/20"
            : "bg-gradient-to-br from-blue-500 to-purple-600 shadow-blue-500/20"
        }`}
      >
        {isAI ? (
          <Bot size={16} className="text-black" />
        ) : (
          <User size={16} className="text-white" />
        )}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[90%] md:max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words ${
          isAI
            ? "bg-gray-800/80 border border-gray-700/50 text-gray-100 rounded-bl-sm"
            : "bg-gradient-to-br from-green-500/90 to-teal-500/80 text-black font-medium rounded-br-sm"
        }`}
      >
        {msg.content}
        <span className="block text-[10px] mt-1.5 opacity-50">
          {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </motion.div>
  );
}

export default function AICoach() {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hi ${user?.name || "there"}! Ask me for a workout idea, help planning meals, or recovery tips.`,
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const bottomRef = useRef(null);
  const chatRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Show scroll-to-bottom button when user scrolls up
  const handleScroll = () => {
    if (!chatRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatRef.current;
    setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 100);
  };

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async (text) => {
    const messageText = text || input.trim();
    if (!messageText || loading) return;

    const userMsg = { role: "user", content: messageText, timestamp: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/ai/chat", {
        message: messageText,
        history: messages.slice(-10), // send last 10 messages for context
      });

      const aiMsg = {
        role: "assistant",
        content: res.data.reply,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error("AI chat error:", err);

      if (err.response?.status === 429 || err.response?.data?.code === "QUOTA_EXCEEDED") {
        analytics.trackLimitReached("chat"); // user hit their daily AI chat quota
        setError(err.response?.data?.error || "Daily AI Coach message limit reached. Upgrade to Premium for extended access!");
      } else if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
      } else if (err.code === "ERR_NETWORK" || !err.response) {
        setError("Network error: Could not connect to FitTrack server. Please check your connection.");
      } else {
        setError(err.response?.data?.error || "Failed to get a response. Please try again.");
      }
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: `What would you like to work on today, ${user?.name || "there"}?`,
        timestamp: Date.now(),
      },
    ]);
  };

  return (
    <div className="fit-page fit-container fit-page-reading">
      <PageHeading
        title="AI Coach"
        description="Ask for help with meals, workouts, or recovery."
        action={messages.length > 1 && (
          <button type="button" className="fit-button fit-button-secondary" onClick={clearChat}>Clear chat</button>
        )}
      />
      {/* Chat Container */}
      <div className="min-w-0">
        <DisclaimerBanner className="mb-3" />
        <div className="fit-panel flex flex-col overflow-hidden">
          {/* Messages */}
          <div
            ref={chatRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-4 scroll-smooth"
            style={{ maxHeight: "calc(100vh - 340px)", minHeight: "300px" }}
          >
            {messages.map((msg, i) => (
              <MessageBubble key={i} msg={msg} />
            ))}

            {loading && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>

          {/* Scroll to bottom button */}
          <AnimatePresence>
            {showScrollBtn && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={scrollToBottom}
                className="absolute bottom-24 right-8 w-9 h-9 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 hover:bg-green-400 transition-colors z-10"
              >
                <ChevronDown size={18} className="text-black" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Error Banner */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mx-4 mb-2 bg-red-500/20 border border-red-500/30 text-red-300 text-sm px-4 py-2 rounded-xl flex items-center justify-between"
              >
                <span>{error}</span>
                <button onClick={() => setError("")} className="ml-2 hover:text-red-200">
                  <RefreshCcw size={14} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input Row */}
          <div className="p-4 border-t border-gray-800/60 bg-gray-900/40">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="flex gap-3 items-end"
            >
              <textarea
                id="chat-input"
                name="chat-input"
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Type your question"
                aria-label="Your question"
                rows={1}
                className="min-w-0 flex-1 bg-gray-800/80 border border-gray-700 focus:border-green-500/60 focus:outline-none focus:ring-1 focus:ring-green-500/30 text-gray-100 placeholder-gray-500 rounded-xl px-4 py-3 text-sm resize-none transition-all duration-200"
                style={{ maxHeight: "120px", overflowY: "auto" }}
              />
              <motion.button
                type="submit"
                disabled={!input.trim() || loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="fit-button fit-button-primary shrink-0 disabled:opacity-40"
              >
                <Send size={16} aria-hidden="true" /> Send
              </motion.button>
            </form>
          </div>
        </div>
      </div>

      {/* Quick Suggestions – shown only when 1 message (intro) */}
      {messages.length === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="pt-5"
        >
          <p className="text-xs text-gray-500 mb-3 text-center">Try one of these questions</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {suggestions.map((s, i) => (
              <motion.button
                key={i}
                onClick={() => sendMessage(s)}
                whileHover={{ scale: 1.02, borderColor: "rgba(74,222,128,0.6)" }}
                whileTap={{ scale: 0.97 }}
                className="text-left text-xs text-gray-300 bg-gray-800/60 border border-gray-700/50 hover:border-green-500/40 hover:bg-gray-800 px-3 py-2.5 rounded-xl transition-all duration-200"
              >
                {s}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
