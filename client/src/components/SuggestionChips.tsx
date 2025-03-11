import React from "react";
import { Button } from "@/components/ui/button";

interface SuggestionChipsProps {
  suggestions: string[];
  onChipClick: (suggestion: string) => void;
}

const SuggestionChips: React.FC<SuggestionChipsProps> = ({
  suggestions,
  onChipClick,
}) => {
  return (
    <div className="p-2 border-t border-border bg-background">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            className="whitespace-nowrap text-xs py-1.5 px-3 bg-muted hover:bg-muted/80 rounded-full transition-colors font-medium border-none h-auto"
            onClick={() => onChipClick(suggestion)}
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SuggestionChips;