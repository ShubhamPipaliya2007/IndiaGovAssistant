import React from "react";
import { Bot } from "lucide-react";

interface BotMessageProps {
  content: React.ReactNode;
}

const BotMessage: React.FC<BotMessageProps> = ({ content }) => {
  return (
    <div className="flex mb-4">
      <div className="w-8 h-8 rounded-full bg-[#000080]/10 flex items-center justify-center mr-2 flex-shrink-0 self-start mt-1">
        <Bot className="h-4 w-4 text-[#000080]" />
      </div>
      <div className="bg-white rounded-lg rounded-tl-none p-3 shadow-sm max-w-[80%]">
        {typeof content === "string" ? <p className="text-sm">{content}</p> : content}
      </div>
    </div>
  );
};

export default BotMessage;
