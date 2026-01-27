import React from "react";
import {
  Box,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
} from "@mui/material";
import { Chats } from "@/shared/types/messageType";

const ChatsList = ({
  searchTerm,
  handleSearchChange,
  filteredChats,
  selectedChat,
  handleListItemClick,
}: {
  searchTerm: string;
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  filteredChats: Chats[];
  selectedChat?: Chats | null;
  handleListItemClick: (Chat: Chats) => void;
}) => {
  return (
    <Box
      sx={{
        flex: 1,
        overflowY: "auto",
        height: "100%",
        background: "white",
      }}
    >
      <Box sx={{ paddingX: "0.5rem", paddingTop: "1rem" }}>
        {/* Search Bar */}
        <TextField
          fullWidth
          placeholder="Search Chats..."
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          size="small"
          sx={{
            marginBottom: 2,
            borderRadius: "2rem",
            border: "1px solidrgb(111, 226, 226)",
            "& .MuiOutlinedInput-root": {
              borderRadius: "2rem",
            },
          }}
        />
      </Box>

      {/* Chats List */}
      <List>
        {filteredChats?.map((Chat: Chats, index) => (
          <React.Fragment key={index}>
            <ListItem
              onClick={() => handleListItemClick(Chat)}
              sx={{
                padding: 1,
                bgcolor: "#FFFFFF",
                boxShadow: "0 1px 4px rgba(255, 255, 255, 0.1)",
                transition: "background 0.3s",
                "&:hover": { bgcolor: "#F0F0F0" },
              }}
            >
              <ListItemAvatar>
                <Avatar />
              </ListItemAvatar>
              <ListItemText
                primary={Chat.firstName}
                secondary={Chat.location}
                sx={{
                  "& .MuiListItemText-primary": {
                    fontWeight: "bold",
                    fontSize: "1rem",
                  },
                  "& .MuiListItemText-secondary": {
                    color: "gray",
                    fontSize: "0.875rem",
                  },
                }}
              />
            </ListItem>
            {index < filteredChats.length - 1 && (
              <Divider
                sx={{
                  width: "90%", // Set the line to cover 80% of the box
                  marginLeft: "2%", // Center the line horizontally
                  bgcolor: "rgba(0, 0, 0, 0.12)", // Optional color adjustment
                }}
              />
            )}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default ChatsList;
