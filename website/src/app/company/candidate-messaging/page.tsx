"use client";
import FullHeightContainer from "@/hoc/FullHeightContainer";
import { Typography, useMediaQuery } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Chats } from "@/shared/types/messageType";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useGetCompanyConversationsQuery } from "@/store/api/chatsApiSlice";
import ChatContainer from "./ChatContainer";
import { useSearchParams } from "next/navigation";

// src/shared/types/messageType.ts

export interface ListChat {
  firstName: string;
  lastName: string;
  location: string;
  profileUrl?: string; // Optional if it may not be provided
  receiverId: string; // Ensure this matches the type you are using for user IDs
}

const JobDetailsPage: React.FC = () => {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const currentUserId = currentUser.user.userType.userId;
  const companyId = currentUser.user.userType.id;
  const searchParams = useSearchParams();
  const receiverIdFromUrl = searchParams.get('receiverId');

  const {
    data: conversations,
    error,
    isLoading,
  } = useGetCompanyConversationsQuery(companyId);

  console.log("conversations", conversations);

  const [filteredChats, setFilteredChats] = useState<Chats[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChat, setSelectedChat] = useState<Chats | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 720px)");
  console.log("company conversations", conversations);
  console.log("receiverId from URL:", receiverIdFromUrl);

  useEffect(() => {
    if (conversations) {
      const listChat: Chats[] = conversations.map((conversation) => ({
        firstName: conversation.firstName,
        lastName: conversation.lastName || "",
        location: `${conversation.city}, ${conversation.state}, ${conversation.country}`,
        profileUrl: conversation.profileUrl || "",
        receiverId: conversation.userId,
      }));
      setFilteredChats(listChat);
      console.log("company chat list", listChat);

      // If there's a receiverId in the URL, find and select that chat
      if (receiverIdFromUrl) {
        const chatToSelect = listChat.find(chat => chat.receiverId === receiverIdFromUrl);
        if (chatToSelect) {
          console.log("Auto-selecting chat:", chatToSelect);
          setSelectedChat(chatToSelect);
          if (!isDesktop) {
            setIsChatOpen(true);
          }
        } else {
          console.log("Chat not found for receiverId:", receiverIdFromUrl);
        }
      }
    }
  }, [conversations, receiverIdFromUrl, isDesktop]);

  const handleListItemClick = (chat: Chats) => {
    console.log("Receiver ID (Applicant):", chat.receiverId);
    setSelectedChat(chat);
    if (!isDesktop) {
      setIsChatOpen(true);
    }
  };

  console.log("selected chat", selectedChat);

  const handleBackToList = () => {
    setIsChatOpen(false);
    setSelectedChat(null);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    if (!conversations) return;

    if (!term) {
      setFilteredChats(
        conversations.map((conversation) => ({
          firstName: conversation.firstName,
          lastName: conversation.lastName || "",
          location: `${conversation.city}, ${conversation.state}, ${conversation.country}`,
          profileUrl: conversation.profileUrl || "",
          receiverId: conversation.userId,
        }))
      );
      return;
    }

    const filtered = conversations
      .map((conversation) => ({
        firstName: conversation.firstName || "",
        lastName: conversation.lastName || "",
        location: `${conversation.city}, ${conversation.state}, ${conversation.country}`,
        profileUrl: conversation.profileUrl || "",
        receiverId: conversation.userId,
      }))
      .filter((chat) => {
        return (
          chat.firstName.toLowerCase().includes(term) ||
          chat.lastName.toLowerCase().includes(term) ||
          chat.location.toLowerCase().includes(term)
        );
      });

    setFilteredChats(filtered);
  };

  if (isLoading) {
    return <Typography variant="body1">Loading conversations...</Typography>;
  }

  if (error) {
    return (
      <Typography variant="body1">Error loading conversations.</Typography>
    );
  }

  return (
    <FullHeightContainer>
      <ChatContainer
        receiverId={selectedChat?.receiverId || receiverIdFromUrl || ""}
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
        filteredChats={filteredChats}
        selectedChat={selectedChat}
        handleListItemClick={handleListItemClick}
        handleBackToList={handleBackToList}
        currentUserId={companyId}
        messageType="company_to_user"
      />
    </FullHeightContainer>
  );
};

export default JobDetailsPage;
