import { useState, useCallback, useEffect, useRef } from "react";
import { MessageType, ChatResponseType } from "@/types";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useSpeech } from "@/hooks/use-speech";
import ErrorMessage from "@/components/message/ErrorMessage";

export function useChat() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isLmStudioAvailable, setIsLmStudioAvailable] = useState<boolean | null>(null);
  const [autoPlayVoice, setAutoPlayVoice] = useState(false);
  const lastResponseRef = useRef<string | null>(null);
  
  const { toast } = useToast();
  
  // Initialize speech recognition
  const { 
    isListening, 
    isSpeaking, 
    speechSupported,
    ttsSupported,
    startListening, 
    stopListening, 
    speak, 
    stopSpeaking, 
    getVoices 
  } = useSpeech({
    onSpeechResult: (text) => {
      setInputValue(text);
      // Auto-submit when speech recognition completes
      if (text.trim().length > 0) {
        sendMessage(text);
      }
    },
    language: "en-IN" // Default to English (India)
  });

  // Check if LM Studio is available when component mounts
  useEffect(() => {
    const checkLmStudioStatus = async () => {
      try {
        const response = await fetch("/api/lmstudio-status");
        const data = await response.json();
        setIsLmStudioAvailable(data.status === "available");
        
        if (data.status !== "available") {
          console.info("LM Studio is not available:", data.message);
          // Show toast only if specifically not available (not on error or unknown status)
          if (data.status === "unavailable") {
            toast({
              title: "Using Mock Responses",
              description: "LM Studio is not available. Using predefined responses for demonstration.",
              duration: 5000,
            });
          }
        }
      } catch (error) {
        console.error("Error checking LM Studio status:", error);
        setIsLmStudioAvailable(false);
      }
    };
    
    checkLmStudioStatus();
  }, [toast]);

  // Function to toggle voice autoplay
  const toggleAutoPlay = useCallback(() => {
    setAutoPlayVoice(prev => !prev);
    toast({
      title: `Voice Response ${!autoPlayVoice ? 'Enabled' : 'Disabled'}`,
      description: !autoPlayVoice 
        ? "Bot responses will be read aloud automatically." 
        : "Voice responses turned off.",
      duration: 3000,
    });
  }, [autoPlayVoice, toast]);

  // Function to handle listening for voice input
  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
      // Reset input value when starting to listen
      setInputValue("");
      toast({
        title: "Listening...",
        description: "Speak clearly into your microphone",
        duration: 2000,
      });
    }
  }, [isListening, startListening, stopListening, toast]);

  // Function to speak the last response
  const speakLastResponse = useCallback(() => {
    if (!lastResponseRef.current) return;
    
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speak(lastResponseRef.current);
    }
  }, [isSpeaking, speak, stopSpeaking]);

  const sendMessage = useCallback(async (message: string) => {
    // Add user message to chat
    setMessages((prev) => [...prev, { type: "user", content: message }]);
    setInputValue("");
    setIsLoading(true);
    
    // If we're listening, stop
    if (isListening) {
      stopListening();
    }

    try {
      const response = await apiRequest("POST", "/api/chat", { message });
      const data: ChatResponseType = await response.json();
      
      // Store the response text for voice playback
      const responseText = data.formatted_content 
        ? (typeof data.formatted_content === 'string' ? data.formatted_content : data.message) 
        : data.message;
      
      lastResponseRef.current = responseText;

      // Add bot response to chat with mock info if applicable
      setMessages((prev) => [
        ...prev,
        { 
          type: "bot", 
          content: data.formatted_content || data.message,
          isMock: data.source === "mock",
          note: data.note
        },
      ]);
      
      // If voice autoplay is enabled, speak the response
      if (autoPlayVoice && ttsSupported) {
        speak(responseText);
      }
      
      // If this is a mock response and we haven't shown a toast yet about it
      if (data.source === "mock" && isLmStudioAvailable !== false) {
        setIsLmStudioAvailable(false);
        toast({
          title: "Using Mock Responses",
          description: "LM Studio is not available. Using predefined responses for demonstration.",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      });
      
      // Add error message to chat
      const errorMessage = "Sorry, I'm having trouble responding right now. Please try again later.";
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          content: errorMessage,
        },
      ]);
      
      lastResponseRef.current = errorMessage;
    } finally {
      setIsLoading(false);
    }
  }, [autoPlayVoice, isListening, stopListening, toast, ttsSupported, speak, isLmStudioAvailable]);

  const handleSuggestionClick = useCallback((suggestion: string) => {
    setInputValue(suggestion);
  }, []);

  return {
    messages,
    isLoading,
    inputValue,
    setInputValue,
    sendMessage,
    handleSuggestionClick,
    isLmStudioAvailable,
    // Voice-related properties and methods
    isListening,
    isSpeaking,
    speechSupported,
    ttsSupported,
    toggleListening,
    toggleAutoPlay,
    autoPlayVoice,
    speakLastResponse
  };
}
