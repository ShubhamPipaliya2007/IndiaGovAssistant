export interface MessageType {
  type: "user" | "bot";
  content: React.ReactNode;
}

export interface ChatResponseType {
  message: string;
  formatted_content?: React.ReactNode;
}
