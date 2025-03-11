import { useState, useCallback } from "react";
import { MessageType, ChatResponseType } from "@/types";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import ErrorMessage from "@/components/message/ErrorMessage";

export function useChat() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const { toast } = useToast();

  const sendMessage = useCallback(async (message: string) => {
    // Add user message to chat
    setMessages((prev) => [...prev, { type: "user", content: message }]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await apiRequest("POST", "/api/chat", { message });
      const data: ChatResponseType = await response.json();

      // Add bot response to chat
      setMessages((prev) => [
        ...prev,
        { 
          type: "bot", 
          content: data.formatted_content || data.message 
        },
      ]);
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
  }, [toast]);

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
  };
}
