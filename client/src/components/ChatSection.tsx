import React, { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, MoreVertical, Upload } from "lucide-react";
import ChatMessage from "./message/ChatMessage";
import UserMessage from "./message/UserMessage";
import BotMessage from "./message/BotMessage";
import LoadingMessage from "./message/LoadingMessage";
import SuggestionChips from "./SuggestionChips";
import { VoiceButton } from "@/components/ui/voice-button";
import { useChat } from "@/lib/useChat";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export interface ChatSectionProps {
  showUploadButton?: boolean;
  onUploadClick?: () => void;
}

const ChatSection: React.FC<ChatSectionProps> = ({ 
  showUploadButton = true, 
  onUploadClick 
}) => {
  const { 
    messages, 
    isLoading, 
    inputValue, 
    setInputValue, 
    sendMessage, 
    handleSuggestionClick,
    isListening,
    isSpeaking,
    speechSupported,
    ttsSupported,
    toggleListening,
    toggleAutoPlay,
    autoPlayVoice,
    speakLastResponse
  } = useChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    <section className="flex-1 flex flex-col">
      <div className="bg-background rounded-xl shadow-md overflow-hidden flex flex-col h-[calc(100vh-160px)] border border-border">
        {/* Chat Header */}
        <div className="p-4 border-b border-border bg-background">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="font-['Poppins'] font-medium text-primary">
                  AI Assistant
                </h2>
                <p className="text-xs text-muted-foreground">
                  Powered by Government of India
                </p>
              </div>
            </div>
            <div>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5 text-muted-foreground" />
              </Button>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div 
          className="flex-1 overflow-y-auto p-4 bg-muted/50" 
          id="chat-messages"
        >
          {/* Welcome Message */}
          <BotMessage 
            content={
              <p className="text-sm">
                🙏 Namaste! I'm your E-Governance Assistant. I can help you with information 
                about various government services, initiatives, and programs in India. 
                What would you like to know about?
              </p>
            }
            voiceEnabled={ttsSupported}
          />

          {/* Display Chat History */}
          {messages.map((message, index) => (
            <ChatMessage 
              key={index} 
              message={message}
              voiceEnabled={ttsSupported}
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

        {/* Voice Output Controls */}
        <div className="px-3 py-2 border-t border-border bg-background/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Switch
              id="auto-voice"
              checked={autoPlayVoice}
              onCheckedChange={toggleAutoPlay}
            />
            <Label htmlFor="auto-voice" className="text-sm text-foreground">Auto-read responses</Label>
          </div>
          {ttsSupported && (
            <VoiceButton
              mode="output"
              isSpeaking={isSpeaking}
              onSpeakClick={speakLastResponse}
              tooltipText={isSpeaking ? "Stop speaking" : "Read aloud"}
              disabled={!messages.length}
              className="ml-auto"
            />
          )}
        </div>

        {/* Chat Input */}
        <div className="p-3 border-t border-border bg-background">
          <form className="flex items-center gap-2" onSubmit={handleSubmit}>
            {speechSupported && (
              <VoiceButton
                mode="input"
                isListening={isListening}
                onListenClick={toggleListening}
                tooltipText={isListening ? "Stop listening" : "Voice input"}
                disabled={isLoading}
              />
            )}
            <Input
              type="text"
              className="flex-1 bg-background border-border focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder={isListening ? "Listening..." : "Type your question here..."}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isListening}
            />
            
            {showUploadButton && onUploadClick && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="border-[#000080] text-[#000080] hover:bg-[#000080]/10"
                onClick={onUploadClick}
                title="Upload Document for Analysis"
              >
                <Upload className="h-4 w-4" />
              </Button>
            )}
            
            <Button
              type="submit"
              className="bg-[#000080] hover:bg-[#000060] text-primary-foreground"
              disabled={(!inputValue.trim() || isLoading) && !isListening}
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
          <div className="flex items-center justify-between mt-1.5 ml-1">
            <p className="text-xs text-muted-foreground">
              Ask me about government services, policies, or programs in India
            </p>
            {speechSupported && (
              <p className="text-xs text-muted-foreground">
                {isListening ? "Listening... Speak now" : ""}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChatSection;