import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoiceButtonProps {
  isListening?: boolean;
  onListenClick?: () => void;
  isSpeaking?: boolean;
  onSpeakClick?: () => void;
  mode?: "input" | "output";
  size?: "default" | "icon" | "sm" | "lg";
  tooltipText?: string;
  className?: string;
  disabled?: boolean;
}

export function VoiceButton({
  isListening = false,
  onListenClick,
  isSpeaking = false,
  onSpeakClick,
  mode = "input",
  size = "icon",
  tooltipText,
  className,
  disabled,
  ...props
}: VoiceButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  
  const handleMouseEnter = () => setShowTooltip(true);
  const handleMouseLeave = () => setShowTooltip(false);
  
  return (
    <div className="relative inline-block">
      <Button
        type="button"
        size={size}
        variant={mode === "input" ? (isListening ? "destructive" : "secondary") : (isSpeaking ? "destructive" : "secondary")}
        className={cn(
          "rounded-full transition-all duration-200",
          {
            "animate-pulse": isListening || isSpeaking,
            "h-10 w-10": size === "icon",
          },
          className
        )}
        disabled={disabled}
        onClick={mode === "input" ? onListenClick : onSpeakClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {mode === "input" 
          ? (isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />)
          : (isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />)
        }
      </Button>
      
      {showTooltip && tooltipText && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded shadow-lg whitespace-nowrap">
          {tooltipText}
        </div>
      )}
    </div>
  );
}