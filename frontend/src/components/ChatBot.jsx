import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([
        { text: "Hello! How can I help you today?", sender: "bot" }
    ]);
    const [loading, setLoading] = useState(false);
    const { userData } = useSelector(state => state.user);
    const scrollRef = useRef(null);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (e) => {
        if (e) e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setMessages(prev => [...prev, { text: userMessage, sender: "user" }]);
        setInput("");
        setLoading(true);

        try {
            const response = await axios.post("https://n8n.n8n-cloud.live/webhook/mychatapp", {
                message: userMessage,
                sessionId: userData?._id || "guest_user" // Uses actual User ID for memory
            });

            // n8n usually returns data in 'output' or 'message' property
            const botResponse = response.data.output || response.data.message || "I'm processing your request.";
            setMessages(prev => [...prev, { text: botResponse, sender: "bot" }]);
        } catch (error) {
            setMessages(prev => [...prev, { text: "Connection error. Please try again.", sender: "bot", error: true }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-5 right-5 z-[9999] font-sans">
            {/* Chat Bubble Icon */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 rounded-full bg-[#1D5A42] flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-7 h-7 fill-[#FF603A]">
                    <path d="M470.3 3.58a16 16 0 00-19.1 1.7L18.78 300.3a16 16 0 00.3 25.1l117 84 25.46 117A16 16 0 00178 512c.5 0 1 0 1.5-.1a16 16 0 0012.7-10.7l48-180 84 117c4 5.6 11 8.8 17.8 8.8.4 0 .9 0 1.3-.1A16 16 0 00360 432L509.3 19.33a16 16 0 00-39 15.75L353.6 409.8a32.06 32.06 0 01-51.1 5.9l-84-117L494 22a16 16 0 00-23.7-21.42L220.2 301l-117-84L470.3 3.58zM416.7 48L112 352.7a16 16 0 1022.6 22.6l304.7-304.7A16 16 0 00416.7 48z"/>
                </svg>
            </button>

            {/* Chat Window Popup */}
            {isOpen && (
                <div className="absolute bottom-20 right-0 w-80 h-[450px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 transition-all">
                    {/* Header */}
                    <div className="bg-[#1D5A42] p-4 flex justify-between items-center text-white">
                        <div>
                            <h3 className="font-bold text-sm">GrubGo Ai Assistant</h3>
                            <p className="text-[10px] opacity-80">Online | Powered by AI</p>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-xl hover:opacity-70">&times;</button>
                    </div>

                    {/* Messages Area */}
                    <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3">
                        {messages.map((msg, index) => (
                            <div 
                                key={index} 
                                className={`max-w-[80%] p-3 rounded-xl text-xs leading-relaxed ${
                                    msg.sender === "user" 
                                    ? "bg-[#00A38D] text-white self-end rounded-tr-none" 
                                    : "bg-white text-gray-700 self-start rounded-tl-none border border-gray-200"
                                }`}
                                style={msg.error ? { color: 'red' } : {}}
                            >
                                {msg.text}
                            </div>
                        ))}
                        {loading && (
                            <div className="bg-white text-gray-400 text-[10px] italic self-start p-2 animate-pulse">
                                Assistant is typing...
                            </div>
                        )}
                    </div>

                    {/* Footer Input */}
                    <form onSubmit={handleSendMessage} className="p-3 border-t flex gap-2 bg-white">
                        <input 
                            type="text" 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 text-xs border border-gray-200 p-2 rounded-lg outline-none focus:border-[#00A38D]"
                        />
                        <button type="submit" className="text-[#FF603A] hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-5 h-5 fill-currentColor">
                                <path d="M470.3 3.58a16 16 0 00-19.1 1.7L18.78 300.3a16 16 0 00.3 25.1l117 84 25.46 117A16 16 0 00178 512c.5 0 1 0 1.5-.1a16 16 0 0012.7-10.7l48-180 84 117c4 5.6 11 8.8 17.8 8.8.4 0 .9 0 1.3-.1A16 16 0 00360 432L509.3 19.33a16 16 0 00-39 15.75L353.6 409.8a32.06 32.06 0 01-51.1 5.9l-84-117L494 22a16 16 0 00-23.7-21.42L220.2 301l-117-84L470.3 3.58zM416.7 48L112 352.7a16 16 0 1022.6 22.6l304.7-304.7A16 16 0 00416.7 48z"/>
                            </svg>
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ChatBot;