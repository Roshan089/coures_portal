import React from "react";
import { Box, TextField, Typography, Avatar, Button } from "@mui/material";

import { Chats } from "@/shared/types/messageType";

interface ChatSectionProps {
  selectedChat: Chats | null;
  onSendMessage?: (content: string) => void; // Callback for sending messages
}

const ChatSection: React.FC<ChatSectionProps> = ({
  selectedChat,
  onSendMessage,
}) => {
  const [messageContent, setMessageContent] = React.useState("");

  const handleSendMessage = () => {
    if (messageContent.trim() && onSendMessage) {
      onSendMessage(messageContent.trim());
      setMessageContent(""); // Clear the input field
    }
  };

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        bgcolor: "#E2F7FF",
        p: 3,
        borderRadius: "16px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      {selectedChat ? (
        <>
          {/* Chat Messages Section */}
          <Box
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
              pr: 1, // Padding to avoid text cutting off with scroll
            }}
          >
            {selectedChat.messages?.length ? (
              selectedChat.messages.map((message, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent:
                      message.sender === "You" ? "flex-end" : "flex-start",
                    mb: 2,
                  }}
                >
                  {message.sender !== "You" && (
                    <Avatar
                      sx={{
                        bgcolor: "#4A90E2",
                        color: "#FFFFFF",
                        width: 40,
                        height: 40,
                        marginRight: 2,
                      }}
                    >
                      {selectedChat.name?.[0] || "?"}
                    </Avatar>
                  )}
                  <Box
                    sx={{
                      maxWidth: "70%",
                      p: 2,
                      borderRadius: "12px",
                      bgcolor: message.sender === "You" ? "#4A90E2" : "#E0E0E0",
                      color: message.sender === "You" ? "#FFFFFF" : "#000000",
                      boxShadow: "0 1px 6px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    {message.content}
                  </Box>
                  {message.sender === "You" && (
                    <Avatar
                      sx={{
                        bgcolor: "#4A90E2",
                        color: "#FFFFFF",
                        width: 40,
                        height: 40,
                        marginLeft: 2,
                      }}
                    >
                      Y
                    </Avatar>
                  )}
                </Box>
              ))
            ) : (
              <Typography sx={{ color: "text.secondary", textAlign: "center" }}>
                No messages yet.
              </Typography>
            )}
          </Box>

          {/* Input Message Field */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              bgcolor: "#FFFFFF",
              borderRadius: "12px",
              boxShadow: "0 1px 6px rgba(0, 0, 0, 0.1)",
              marginTop: 2,
              p: 1,
            }}
          >
            <TextField
              fullWidth
              placeholder={`Type a message to ${selectedChat.name || ""}`}
              variant="outlined"
              size="small"
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendMessage();
              }}
              sx={{ marginRight: 2, bgcolor: "#F9F9F9" }}
            />
            <Button
              variant="contained"
              onClick={handleSendMessage}
              sx={{
                bgcolor: "#4A90E2",
                "&:hover": {
                  bgcolor: "#357ABD",
                },
              }}
            >
              Send
            </Button>
          </Box>
        </>
      ) : (
        <Typography
          variant="h6"
          sx={{
            textAlign: "center",
            color: "text.secondary",
            mt: "auto",
            mb: "auto",
          }}
        >
          Select an applicant to view their chat.
        </Typography>
      )}
    </Box>
  );
};

export default ChatSection;
