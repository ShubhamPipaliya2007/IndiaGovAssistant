export interface MessageType {
  type: "user" | "bot";
  content: React.ReactNode;
  isMock?: boolean; // Flag to indicate if this is a mock response
  note?: string; // Optional note about the source or other info
}

export interface ChatResponseType {
  message: string;
  formatted_content?: React.ReactNode;
  source?: "lm-studio" | "mock"; // Source of the response
  note?: string; // Additional information about the response
}
