import React, { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, MoreVertical } from "lucide-react";
import ChatMessage from "./message/ChatMessage";
import UserMessage from "./message/UserMessage";
import BotMessage from "./message/BotMessage";
import LoadingMessage from "./message/LoadingMessage";
import SuggestionChips from "./SuggestionChips";
import { useChat } from "@/lib/useChat";

const ChatSection: React.FC = () => {
  const { 
    messages, 
    isLoading, 
    inputValue, 
    setInputValue, 
    sendMessage, 
    handleSuggestionClick 
  } = useChat();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      sendMessage(inputValue);
    }
  };

  const suggestions = [
    "What is DigiLocker?",
    "How to apply for passport?",
    "E-governance initiatives",
    "GST information",
    "Electoral services"
  ];

  return (
    <section className="w-full md:w-2/3 lg:w-3/4 order-1 md:order-2">
      <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col h-[calc(100vh-160px)]">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#000080]/10 flex items-center justify-center">
                <Bot className="h-5 w-5 text-[#000080]" />
              </div>
              <div>
                <h2 className="font-['Poppins'] font-medium text-[#000080]">
                  AI Assistant
                </h2>
                <p className="text-xs text-gray-500">
                  Powered by Government of India
                </p>
              </div>
            </div>
            <div>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5 text-gray-500" />
              </Button>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div 
          className="flex-1 overflow-y-auto p-4 bg-gray-50" 
          id="chat-messages"
        >
          {/* Welcome Message */}
          <BotMessage content={
            <p className="text-sm">
              🙏 Namaste! I'm your E-Governance Assistant. I can help you with information 
              about various government services, initiatives, and programs in India. 
              What would you like to know about?
            </p>
          } />

          {/* Display Chat History */}
          {messages.map((message, index) => (
            <ChatMessage 
              key={index} 
              message={message} 
            />
          ))}

          {/* Loading Message */}
          {isLoading && <LoadingMessage />}
          
          {/* Invisible div for auto-scrolling */}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        <SuggestionChips 
          suggestions={suggestions} 
          onChipClick={handleSuggestionClick} 
        />

        {/* Chat Input */}
        <div className="p-3 border-t border-gray-200 bg-white">
          <form className="flex items-center gap-2" onSubmit={handleSubmit}>
            <Input
              type="text"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9933] focus:border-transparent"
              placeholder="Type your question here..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <Button
              type="submit"
              className="bg-[#000080] hover:bg-[#000080]/90 text-white rounded-lg p-2.5 h-10 w-10 flex items-center justify-center"
              disabled={!inputValue.trim() || isLoading}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <path d="M22 2L11 13" />
                <path d="M22 2L15 22L11 13L2 9L22 2Z" />
              </svg>
            </Button>
          </form>
          <p className="text-xs text-gray-500 mt-1.5 ml-1">
            Ask me about government services, policies, or programs in India
          </p>
        </div>
      </div>
    </section>
  );
};

export default ChatSection;
