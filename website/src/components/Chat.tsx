"use client";
import { useEffect, useState, useRef } from "react";
import { Box, Typography, IconButton, TextField, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { Chats } from "@/shared/types/messageType"; // Assuming you have a Chats interface defined
import { useGetAllMessagesQuery, useGetCompanyUserMessagesQuery } from "@/store/api/chatsApiSlice";
import ChatSocket from "@/socket/socket";
import { ChatMessage } from "@/shared/types/chats";

const MessageChats = ({
  isDesktop,
  selectedChat,
  userId, // This can be either userId or companyId
  receiverId,
  onBack,
  messageType = "company_to_user", // Default to company-to-user for company side
}: {
  isDesktop: boolean;
  selectedChat: Chats | undefined;
  userId: string; // Can be userId or companyId
  receiverId: string;
  onBack: () => void;
  messageType?: "company_to_user" | "user_to_company";
}) => {
  // Use different query based on message type
  const { data: chatHistory, refetch } = messageType === "company_to_user" 
    ? useGetCompanyUserMessagesQuery({ companyId: userId, userId: receiverId })
    : useGetCompanyUserMessagesQuery({ companyId: receiverId, userId: userId });

  const [messages, setMessages] = useState<ChatMessage[]>([]); // Use ChatMessage type
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const chatSocketRef = useRef<ChatSocket | null>(null);

  useEffect(() => {
    const chatSocket = new ChatSocket(userId, refetch, messageType);
    chatSocket.connect();
    chatSocketRef.current = chatSocket;

    chatSocket.onMessageReceived((data) => {
      const messageData: ChatMessage = data; // Typecast the received data

      // Only add the message if it's part of the current conversation
      if (
        (messageData.senderId === userId &&
          messageData.receiverId === receiverId) ||
        (messageData.senderId === receiverId &&
          messageData.receiverId === userId)
      ) {
        setMessages((prev) => {
          const messageExists = prev.some(
            (msg) =>
              msg.timestamp === messageData.timestamp &&
              msg.senderId === messageData.senderId
          );
          return messageExists ? prev : [...prev, messageData];
        });
      }
    });

    chatSocket.onMessageStatusUpdate((data) => {
      const messageData: ChatMessage = data; // Typecast the received data

      // Only update status for messages in the current conversation
      if (
        (messageData.senderId === userId &&
          messageData.receiverId === receiverId) ||
        (messageData.senderId === receiverId &&
          messageData.receiverId === userId)
      ) {
        setMessages((prev) => {
          const messageExists = prev.some(
            (msg) =>
              msg.timestamp === messageData.timestamp &&
              msg.senderId === messageData.senderId
          );
          return messageExists ? prev : [...prev, messageData];
        });
      }
    });

    return () => {
      chatSocket.disconnect();
    };
  }, [userId, receiverId, refetch, messageType]);

  useEffect(() => {
    if (chatHistory) {
      setMessages(chatHistory as ChatMessage[]); // Ensure chatHistory is of type ChatMessage[]
    }
  }, [chatHistory]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const messageData: ChatMessage = {
      id: "some-generated-id", // Generate an ID as needed
      senderId: userId,
      receiverId: receiverId,
      message: input,
      status: "sent",
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messageType: messageType, // Add message type
    };

    chatSocketRef.current?.sendMessage(messageData);
    setInput("");
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        maxHeight: "100%",
        overflow: "hidden",
        bgcolor: "#536485",
      }}
    >
      {/* Header - Fixed height */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          p: 2,
          bgcolor: "#242D3D",
          borderTopLeftRadius: "12px",
          borderTopRightRadius: "12px",
          borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
          minHeight: "64px",
          flexShrink: 0,
        }}
      >
        {!isDesktop && (
          <IconButton
            onClick={onBack}
            sx={{
              color: "#ffffff",
              padding: 0,
              marginRight: 1,
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        )}
        <Box
          component="img"
          src={selectedChat?.profileUrl || "/default-avatar.png"}
          sx={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
        <Box>
          <Typography
            variant="subtitle1"
            sx={{
              color: "#ffffff",
              fontWeight: 500,
              fontSize: "1rem",
            }}
          >
            {selectedChat?.firstName}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#536485",
              fontSize: "0.875rem",
            }}
          >
            Online
          </Typography>
        </Box>
      </Box>

      {/* Messages Container - Scrollable */}
      <Box
        key="messages-container"
        sx={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          p: 2,
          "&::-webkit-scrollbar": { display: "none" },
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        {messages &&
          messages.map((message, index) => {
            // Determine if this message is from the current user/company
            const isFromCurrentUser = message.senderId === userId;
            
            return (
              <Box
                key={`message-${message.id}-${index}`}
                sx={{
                  display: "flex",
                  justifyContent: isFromCurrentUser ? "flex-end" : "flex-start",
                  marginBottom: 1,
                }}
              >
                <Box
                  sx={{
                    maxWidth: "80%",
                    padding: 1.5,
                    borderRadius: "12px",
                    bgcolor: isFromCurrentUser ? "#4A90E2" : "#E0E0E0",
                    color: isFromCurrentUser ? "#FFFFFF" : "#000000",
                    boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{ wordWrap: "break-word", fontSize: "0.9rem" }}
                  >
                    {message.message}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      gap: 0.5,
                      mt: 0.5,
                    }}
                  >
                    {isFromCurrentUser && (
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: "0.7rem",
                          color: "rgba(255,255,255,0.7)",
                        }}
                      >
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        <Typography
                          variant="caption"
                          sx={{
                            fontSize: "0.7rem",
                            color: "rgba(255,255,255,0.7)",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          • {message.status} {/* Display the status */}
                          {message.status === "delivered" && (
                            <DoneAllIcon sx={{ fontSize: "0.8rem", ml: 0.5 }} />
                          )}
                        </Typography>
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>
            );
          })}
        <div ref={messagesEndRef} />
      </Box>

      {/* Message Input - Fixed height */}
      <Box
        sx={{
          p: 2,
          bgcolor: "transparent",
          position: "relative",
          flexShrink: 0,
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 1,
            bgcolor: "rgba(255, 255, 255, 0.1)",
            borderRadius: "8px",
            p: 1,
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <TextField
            fullWidth
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            variant="standard"
            size="small"
            sx={{
              width: "100%",
              "& .MuiInputBase-root": {
                bgcolor: "transparent",
                color: "#FFFFFF",
                px: 2,
                width: "100%",
                "&::before, &::after": {
                  display: "none",
                },
              },
              "& .MuiInputBase-input": {
                "&::placeholder": {
                  color: "rgba(255, 255, 255, 0.7)",
                  opacity: 1,
                },
              },
            }}
          />
          <Button
            variant="contained"
            onClick={sendMessage}
            sx={{
              bgcolor: "#4A90E2",
              color: "#FFFFFF",
              textTransform: "none",
              minWidth: "unset",
              px: 3,
              flexShrink: 0,
              "&:hover": {
                bgcolor: "#357ABD",
              },
            }}
          >
            Send
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default MessageChats;
