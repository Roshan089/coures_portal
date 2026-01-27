"use client";
import FullHeightContainer from "@/hoc/FullHeightContainer";
import { Typography, useMediaQuery, Box, TextField, Autocomplete, Paper } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Chats } from "@/shared/types/messageType";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useGetCompanyConversationsQuery } from "@/store/api/chatsApiSlice";
import { useGetClientsQuery } from "@/store/api/companyApiSlice";
import ChatContainer from "@/app/agency/chats/ChatContainer";
import { useSearchParams } from "next/navigation";

export interface ListChat {
  firstName: string;
  lastName: string;
  location: string;
  profileUrl?: string;
  receiverId: string;
}

const AgencyChatsPage: React.FC = () => {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const currentUserId = currentUser.user.userType.userId;
  const searchParams = useSearchParams();
  const receiverIdFromUrl = searchParams.get('receiverId');
  const companyIdFromUrl = searchParams.get('companyId');

  // Get all companies managed by the agency
  const {
    data: companies,
    error: companiesError,
    isLoading: companiesLoading,
  } = useGetClientsQuery(currentUserId);

  // State for selected company
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(companyIdFromUrl || '');
  const [selectedCompany, setSelectedCompany] = useState<any>(null);

  // Get conversations for the selected company
  const {
    data: conversations,
    error: conversationsError,
    isLoading: conversationsLoading,
  } = useGetCompanyConversationsQuery(selectedCompanyId, {
    skip: !selectedCompanyId,
  });

  const [filteredChats, setFilteredChats] = useState<Chats[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChat, setSelectedChat] = useState<Chats | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 720px)");

  console.log("agency companies", companies);
  console.log("selected company conversations", conversations);
  console.log("receiverId from URL:", receiverIdFromUrl);

  // Set initial company if not selected
  useEffect(() => {
    if (companies && companies.length > 0 && !selectedCompanyId) {
      const firstCompany = companies[0];
      setSelectedCompanyId(firstCompany.id);
      setSelectedCompany(firstCompany);
    } else if (companies && companyIdFromUrl) {
      const company = companies.find(c => c.id === companyIdFromUrl);
      if (company) {
        setSelectedCompany(company);
      }
    }
  }, [companies, selectedCompanyId, companyIdFromUrl]);

  useEffect(() => {
    if (conversations && selectedCompanyId) {
      const listChat: Chats[] = conversations.map((conversation) => ({
        firstName: conversation.firstName,
        lastName: conversation.lastName || "",
        location: `${conversation.city}, ${conversation.state}, ${conversation.country}`,
        profileUrl: conversation.profileUrl || "",
        receiverId: conversation.userId,
      }));
      setFilteredChats(listChat);
      console.log("agency chat list", listChat);

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
  }, [conversations, receiverIdFromUrl, isDesktop, selectedCompanyId]);

  const handleCompanyChange = (event: any, newValue: any) => {
    if (newValue) {
      setSelectedCompany(newValue);
      setSelectedCompanyId(newValue.id);
      setSelectedChat(null);
      setIsChatOpen(false);
    }
  };

  const handleListItemClick = (chat: Chats) => {
    console.log("Receiver ID (Applicant):", chat.receiverId);
    setSelectedChat(chat);
    if (!isDesktop) {
      setIsChatOpen(true);
    }
  };

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

  if (companiesLoading) {
    return <Typography variant="body1">Loading companies...</Typography>;
  }

  if (companiesError) {
    return <Typography variant="body1">Error loading companies.</Typography>;
  }

  if (!companies || companies.length === 0) {
    return <Typography variant="body1">No companies found for this agency.</Typography>;
  }

  if (conversationsLoading) {
    return <Typography variant="body1">Loading conversations...</Typography>;
  }

  if (conversationsError) {
    return <Typography variant="body1">Error loading conversations.</Typography>;
  }

  return (
    <FullHeightContainer>
      <Box sx={{ mb: 2 }}>
        <Autocomplete
          options={companies || []}
          getOptionLabel={(option: any) => option.name || ''}
          value={selectedCompany}
          onChange={handleCompanyChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search Company"
              placeholder="Type to search companies..."
              variant="outlined"
              fullWidth
            />
          )}
          renderOption={(props, option: any) => (
            <Box component="li" {...props}>
              <Box>
                <Typography variant="body1" fontWeight="medium">
                  {option.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {option.location || 'No location'}
                </Typography>
              </Box>
            </Box>
          )}
          PaperComponent={({ children }) => (
            <Paper elevation={3} sx={{ mt: 1 }}>
              {children}
            </Paper>
          )}
        />
      </Box>
      
      <ChatContainer
        receiverId={selectedChat?.receiverId || receiverIdFromUrl || ""}
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
        filteredChats={filteredChats}
        selectedChat={selectedChat}
        handleListItemClick={handleListItemClick}
        handleBackToList={handleBackToList}
        currentUserId={selectedCompanyId}
        messageType="company_to_user"
      />
    </FullHeightContainer>
  );
};

export default AgencyChatsPage;
