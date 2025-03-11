import React from "react";
import { MessageType } from "@/types";
import UserMessage from "./UserMessage";
import BotMessage from "./BotMessage";

interface ChatMessageProps {
  message: MessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  if (message.type === "user") {
    return <UserMessage content={message.content} />;
  } else {
    return <BotMessage content={message.content} />;
  }
};

export default ChatMessage;
