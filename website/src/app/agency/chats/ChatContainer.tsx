import React, { useState } from "react";
import { Box, Typography, useMediaQuery } from "@mui/material";
import Grid from "@mui/material/Grid2";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { AppIconButton } from "@/components";
import ChatsList from "@/components/messageCompany/mobile/AppilicantList";
import MessageChats from "@/components/Chat";
import { Chats } from "@/shared/types/messageType";

interface ChatContainerProps {
  receiverId: string;
  searchTerm: string;
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  filteredChats: Chats[];
  selectedChat: Chats | null;
  handleListItemClick: (chat: Chats) => void;
  handleBackToList: () => void;
  currentUserId: string;
  messageType?: "company_to_user" | "user_to_company";
}

const ChatContainer: React.FC<ChatContainerProps> = ({
  receiverId,
  searchTerm,
  handleSearchChange,
  filteredChats,
  selectedChat,
  handleListItemClick,
  handleBackToList,
  currentUserId,
  messageType = "company_to_user",
}) => {
  const isDesktop = useMediaQuery("(min-width: 720px)");
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleBack = () => {
    setIsChatOpen(false);
    handleBackToList();
  };

  // Check if we should show chat (either selectedChat exists or receiverId from URL)
  const shouldShowChat = selectedChat || (receiverId && receiverId.trim() !== "");

  // Create a temporary chat object if we have receiverId but no selectedChat
  const chatToShow = selectedChat || (receiverId && receiverId.trim() !== "" ? {
    firstName: "New Chat",
    lastName: "",
    location: "",
    profileUrl: "/default-avatar.png",
    receiverId: receiverId,
  } as Chats : null);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 64px)", // Subtract header height
        maxHeight: "calc(100vh - 64px)",
        bgcolor: "#FEFEFE",
      }}
    >
      <Box
        sx={{
          height: "5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
          <Typography
            sx={{ paddingX: "1rem", fontSize: "1.25rem", fontWeight: "bold" }}
          >
            Agency Chats
          </Typography>
        </Box>
      </Box>
      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          height: "100%",
          overflow: "hidden",
        }}
      >
        {isDesktop ? (
          // Desktop Layout
          <Box sx={{ display: "flex", width: "100%", height: "100%" }}>
            {/* Chat List */}
            <Box
              sx={{
                width: "300px",
                borderRight: "1px solid #E0E0E0",
                height: "100%",
                overflow: "auto",
              }}
            >
              <ChatsList
                searchTerm={searchTerm}
                handleSearchChange={handleSearchChange}
                filteredChats={filteredChats}
                selectedChat={selectedChat}
                handleListItemClick={handleListItemClick}
              />
            </Box>
            {/* Chat Messages */}
            <Box
              sx={{
                flex: 1,
                height: "100%",
                overflow: "hidden",
              }}
            >
              {shouldShowChat ? (
                <MessageChats
                  isDesktop={isDesktop}
                  selectedChat={chatToShow || undefined}
                  userId={currentUserId}
                  receiverId={receiverId}
                  onBack={handleBack}
                  messageType={messageType}
                />
              ) : (
                <Box
                  sx={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography color="textSecondary">
                    Select a conversation to start messaging
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        ) : (
          // Mobile Layout
          <Box sx={{ width: "100%", height: "100%", overflow: "hidden" }}>
            {!shouldShowChat ? (
              <ChatsList
                searchTerm={searchTerm}
                handleSearchChange={handleSearchChange}
                filteredChats={filteredChats}
                selectedChat={selectedChat}
                handleListItemClick={(chat) => {
                  handleListItemClick(chat);
                  setIsChatOpen(true);
                }}
              />
            ) : (
              <MessageChats
                isDesktop={isDesktop}
                selectedChat={chatToShow || undefined}
                userId={currentUserId}
                receiverId={receiverId}
                onBack={handleBack}
                messageType={messageType}
              />
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ChatContainer; 