import React from "react";
import { Bot } from "lucide-react";
import { motion } from "framer-motion";

const LoadingMessage: React.FC = () => {
  return (
    <div className="flex mb-4">
      <div className="w-8 h-8 rounded-full bg-[#000080]/10 flex items-center justify-center mr-2 flex-shrink-0 self-start mt-1">
        <Bot className="h-4 w-4 text-[#000080]" />
      </div>
      <div className="bg-white rounded-lg rounded-tl-none p-3 shadow-sm inline-flex space-x-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-gray-300 rounded-full"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default LoadingMessage;
