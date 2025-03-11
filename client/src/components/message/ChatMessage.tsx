import React, { useCallback, useState } from "react";
import { MessageType } from "@/types";
import UserMessage from "./UserMessage";
import BotMessage from "./BotMessage";
import { useSpeech } from "@/hooks/use-speech";

interface ChatMessageProps {
  message: MessageType;
  voiceEnabled?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, voiceEnabled = false }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { speak, stopSpeaking, ttsSupported } = useSpeech();
  
  // Speak or stop speaking the message content
  const handleSpeakClick = useCallback(() => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      // Extract text content from the message
      let textToSpeak = "";
      if (typeof message.content === "string") {
        textToSpeak = message.content;
      } else if (React.isValidElement(message.content)) {
        // Try to get text from a React element
        const element = message.content as React.ReactElement;
        if (element.props && element.props.children && typeof element.props.children === "string") {
          textToSpeak = element.props.children;
        }
      }
      
      if (textToSpeak) {
        setIsSpeaking(true);
        speak(textToSpeak, 1, 1);
        
        // Listen for when speech ends
        const handleSpeechEnd = () => {
          setIsSpeaking(false);
        };
        
        if (window.speechSynthesis) {
          const checkIfSpeaking = setInterval(() => {
            if (!window.speechSynthesis.speaking) {
              setIsSpeaking(false);
              clearInterval(checkIfSpeaking);
            }
          }, 100);
          
          // Safety timeout to ensure state gets updated even if speech events fail
          setTimeout(() => {
            clearInterval(checkIfSpeaking);
            setIsSpeaking(false);
          }, 60000); // 1 minute maximum speaking time
        }
      }
    }
  }, [isSpeaking, message.content, speak, stopSpeaking]);

  if (message.type === "user") {
    return <UserMessage content={message.content} />;
  } else {
    return (
      <BotMessage 
        content={message.content} 
        isMock={message.isMock} 
        note={message.note}
        isSpeaking={isSpeaking}
        onSpeakClick={handleSpeakClick}
        voiceEnabled={voiceEnabled && ttsSupported}
      />
    );
  }
};

export default ChatMessage;
