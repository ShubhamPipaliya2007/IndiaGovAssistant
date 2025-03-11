import React from "react";
import { User } from "lucide-react";

interface UserMessageProps {
  content: React.ReactNode;
}

const UserMessage: React.FC<UserMessageProps> = ({ content }) => {
  return (
    <div className="flex mb-4 justify-end">
      <div className="bg-[#FF9933]/10 rounded-lg rounded-tr-none p-3 shadow-sm max-w-[80%]">
        {typeof content === "string" ? <p className="text-sm">{content}</p> : content}
      </div>
      <div className="w-8 h-8 rounded-full bg-[#FF9933]/20 flex items-center justify-center ml-2 flex-shrink-0 self-start mt-1">
        <User className="h-4 w-4 text-[#FF9933]" />
      </div>
    </div>
  );
};

export default UserMessage;
