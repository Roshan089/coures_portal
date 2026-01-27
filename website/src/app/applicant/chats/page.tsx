"use client";
import FullHeightContainer from "@/hoc/FullHeightContainer";
import { Typography, useMediaQuery } from "@mui/material";
import React, { useEffect, useState } from "react";

import { Chats } from "@/shared/types/messageType";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useGetUserConversationsQuery } from "@/store/api/chatsApiSlice";
import ChatContainer from "@/app/company/candidate-messaging/ChatContainer";
import { useParams, useSearchParams } from "next/navigation";
import { useGetJobByIdQuery } from "@/store/api/jobApiSlice";

const JobDetailsPage: React.FC = () => {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const currentUserId = currentUser.user.userType.userId;

  const searchParams = useSearchParams();
  const jobId = searchParams.get("receiverId"); // Get receiverId from URL query

  const { data: job } = useGetJobByIdQuery(jobId);

  const receiverId = job?.company?.id;
  console.log("receiverId", receiverId);

  const {
    data: conversations,
    error,
    isLoading,
  } = useGetUserConversationsQuery(currentUserId);
  console.log("conversations", conversations);
  const [filteredChats, setFilteredChats] = useState<Chats[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChat, setSelectedChat] = useState<Chats | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 720px)");

  useEffect(() => {
    if (conversations) {
      // Create a map to store unique chats by receiverId
      const uniqueChats = new Map();

      // First, add all existing conversations
      conversations.forEach((conversation) => {
        uniqueChats.set(conversation.userId, {
          firstName: conversation.firstName,
          lastName: conversation.lastName || "",
          location: conversation.location,
          profileUrl: conversation.profileUrl || "",
          receiverId: conversation.userId,
        });
      });

      // Then, if we have a new chat with receiverId, add or update it
      if (receiverId && job?.company) {
        uniqueChats.set(receiverId, {
          firstName: job.company.name || "Unknown",
          lastName: "",
          location: `${job.company.location}`,
          profileUrl: job?.company?.imageUrl || "",
          receiverId: receiverId,
        });
        setSelectedChat(uniqueChats.get(receiverId));
      }

      // Convert map values back to array
      const listChat = Array.from(uniqueChats.values());
      setFilteredChats(listChat);
    }
  }, [conversations, receiverId, job]);

  const handleListItemClick = (chat: Chats) => {
    setSelectedChat(chat);

    if (!isDesktop) {
      setIsChatOpen(true);
    }
  };

  const handleBackToList = () => {
    setIsChatOpen(false);
    setSelectedChat(null); // Reset selected chat
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredChats((prevChats) =>
      prevChats.filter(
        (chat) =>
          chat.firstName.toLowerCase().includes(term) ||
          (chat.lastName?.toLowerCase() || "").includes(term) ||
          chat.location.toLowerCase().includes(term)
      )
    );
  };

  // Loading and error handling
  if (isLoading) {
    return <Typography variant="body1">Loading conversations...</Typography>;
  }

  return (
    <FullHeightContainer>
      <ChatContainer
        receiverId={receiverId || selectedChat?.receiverId || ""}
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
        filteredChats={filteredChats}
        selectedChat={selectedChat}
        handleListItemClick={handleListItemClick}
        handleBackToList={handleBackToList}
        currentUserId={currentUserId}
        messageType="user_to_company"
      />
    </FullHeightContainer>
  );
};

export default JobDetailsPage;
