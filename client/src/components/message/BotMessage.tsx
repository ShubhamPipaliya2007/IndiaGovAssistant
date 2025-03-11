import React from "react";
import { Bot, AlertCircle } from "lucide-react";
import { VoiceButton } from "@/components/ui/voice-button";

interface BotMessageProps {
  content: React.ReactNode;
  isMock?: boolean;
  note?: string;
  isSpeaking?: boolean;
  onSpeakClick?: () => void;
  voiceEnabled?: boolean;
}

const BotMessage: React.FC<BotMessageProps> = ({ 
  content, 
  isMock, 
  note, 
  isSpeaking, 
  onSpeakClick, 
  voiceEnabled 
}) => {
  return (
    <div className="flex mb-4">
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2 flex-shrink-0 self-start mt-1">
        <Bot className="h-4 w-4 text-primary" />
      </div>
      <div className="flex flex-col w-full">
        <div className="flex items-start">
          <div className="bg-card rounded-lg rounded-tl-none p-3 shadow-sm max-w-[90%] flex-grow text-card-foreground">
            {typeof content === "string" ? <p className="text-sm">{content}</p> : content}
          </div>

          {/* Voice button (if voice is enabled) */}
          {voiceEnabled && onSpeakClick && (
            <div className="ml-2 mt-1">
              <VoiceButton
                mode="output"
                isSpeaking={isSpeaking}
                onSpeakClick={onSpeakClick}
                tooltipText={isSpeaking ? "Stop speaking" : "Read aloud"}
                size="sm"
              />
            </div>
          )}
        </div>

        {/* Mock Response Indicator */}
        {isMock && (
          <div className="flex items-center mt-1 ml-1">
            <AlertCircle className="h-3 w-3 text-amber-500 mr-1" />
            <span className="text-xs text-amber-600 italic">
              Mock response for demo purposes
            </span>
          </div>
        )}

        {/* Additional note if provided */}
        {note && (
          <div className="text-xs text-muted-foreground mt-0.5 ml-1 max-w-[90%]">
            {note}
          </div>
        )}
      </div>
    </div>
  );
};

export default BotMessage;