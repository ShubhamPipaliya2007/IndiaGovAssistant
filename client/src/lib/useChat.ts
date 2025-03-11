import { useState, useCallback, useEffect } from "react";
import { MessageType, ChatResponseType } from "@/types";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import ErrorMessage from "@/components/message/ErrorMessage";

export function useChat() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isLmStudioAvailable, setIsLmStudioAvailable] = useState<boolean | null>(null);
  const { toast } = useToast();

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

  const sendMessage = useCallback(async (message: string) => {
    // Add user message to chat
    setMessages((prev) => [...prev, { type: "user", content: message }]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await apiRequest("POST", "/api/chat", { message });
      const data: ChatResponseType = await response.json();

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
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          content: "Sorry, I'm having trouble responding right now. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [toast, isLmStudioAvailable]);

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
  };
}
