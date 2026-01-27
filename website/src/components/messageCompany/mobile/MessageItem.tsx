import React from "react";
import { Box, Typography, IconButton, TextField, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { Chats } from "@/shared/types/messageType";

const MessageChat = ({
  selectedChat,
  handleBackToList,
}: {
  selectedChat: Chats | undefined;
  handleBackToList: () => void;
}) => {
  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: "90%",
        padding: 2,
        bgcolor: "#FFFFFF",
      }}
    >
      {/* Back Button */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          marginBottom: 2,
        }}
      >
        <IconButton onClick={handleBackToList} sx={{ bgcolor: "#F0F0F0" }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" sx={{ marginLeft: 2, fontWeight: "bold" }}>
          {selectedChat?.name}
        </Typography>
      </Box>

      {/* Chat Messages */}
      <Box
        sx={{
          flexGrow: 1,
          bgcolor: "#F8F9FA",
          padding: 2,
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          marginBottom: 2,
          display: "flex",
          flexDirection: "column",
          height: "500px",
        }}
      >
        {/* Scrollable Messages Section */}
        <Box
          sx={{
            flexGrow: 1,
            paddingRight: 1,
            marginBottom: 2,
            overflowY: "scroll",
            scrollbarWidth: "none",
            "-ms-overflow-style": "none",
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          {selectedChat &&
            selectedChat.messages &&
            selectedChat?.messages.map((message, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent:
                    message.sender === "You" ? "flex-end" : "flex-start",
                  marginBottom: 1,
                }}
              >
                <Box
                  sx={{
                    maxWidth: "80%",
                    padding: 1.5,
                    borderRadius: "12px",
                    bgcolor: message.sender === "You" ? "#4A90E2" : "#E0E0E0",
                    color: message.sender === "You" ? "#FFFFFF" : "#000000",
                    boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      wordWrap: "break-word",
                      fontSize: "0.9rem",
                    }}
                  >
                    {message.content}
                  </Typography>
                </Box>
              </Box>
            ))}
        </Box>

        {/* Sticky Input Section */}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            position: "sticky",
            bottom: 0,
            bgcolor: "#F8F9FA",
            paddingTop: 1,
          }}
        >
          <TextField
            fullWidth
            placeholder={`Type a message to ${selectedChat?.name}`}
            variant="outlined"
            size="small"
            sx={{ bgcolor: "#F8F8F8", borderRadius: "8px" }}
          />
          <Button
            variant="contained"
            sx={{
              bgcolor: "#4A90E2",
              "&:hover": { bgcolor: "#357ABD" },
              color: "#FFFFFF",
            }}
          >
            Send
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default MessageChat;
