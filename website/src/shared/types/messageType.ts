export interface Message {
  sender: string;
  content: string;
}

export interface Chats {
  firstName: string;
  lastName?: string;
  location: string;
  profileUrl: string;
  messages?: { sender: string; content: string }[] | undefined;
  receiverId: string;
}
