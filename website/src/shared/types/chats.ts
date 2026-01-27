// src/shared/types/messageType.ts

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: string;
  status: "sent" | "delivered";
  createdAt?: string;
  updatedAt?: string;
  messageType?: "company_to_user" | "user_to_company";
}
