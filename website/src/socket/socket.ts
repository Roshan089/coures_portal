import { ChatMessage } from "@/shared/types/chats";
import { io, Socket } from "socket.io-client";

class ChatSocket {
  private socket: Socket | null = null;

  constructor(
    private userId: string, 
    private refetch: () => void,
    private messageType: "company_to_user" | "user_to_company" = "company_to_user"
  ) {}

  connect() {
    this.socket = io(process.env.NEXT_PUBLIC_API_SOCKET_URL);

    this.socket.on("connect", () => {
      console.log("Socket connected with ID:", this.socket?.id);
      this.joinRoom();
    });

    this.socket.on("userJoined", (data) => {
      console.log("User/Company joined:", data);
      this.refetch(); // Call refetch when a user/company joins
    });
  }

  joinRoom() {
    if (this.socket) {
      const userType = this.messageType === "company_to_user" ? "company" : "user";
      const joinData = {
        userId: userType === "user" ? this.userId : undefined,
        companyId: userType === "company" ? this.userId : undefined,
        userType: userType
      };
      this.socket.emit("join", JSON.stringify(joinData));
    }
  }

  onMessageReceived(callback: (data: ChatMessage) => void) {
    if (this.socket) {
      this.socket.on("receiveMessage", (data) => {
        const messageData = typeof data === "string" ? JSON.parse(data) : data;
        callback(messageData);
      });
    }
  }

  onMessageStatusUpdate(callback: (data: ChatMessage) => void) {
    if (this.socket) {
      this.socket.on("messageStatusUpdate", (data) => {
        const messageData = typeof data === "string" ? JSON.parse(data) : data;
        callback(messageData);
      });
    }
  }

  sendMessage(messageData: ChatMessage) {
    if (this.socket) {
      // Add messageType to the message data
      const messageWithType = {
        ...messageData,
        messageType: this.messageType
      };
      this.socket.emit("sendMessage", JSON.stringify(messageWithType));
    }
  }

  disconnect() {
    if (this.socket) {
      console.log("Socket disconnecting for userId/companyId:", this.userId);
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export default ChatSocket;
