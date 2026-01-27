import React from "react";
import {
  Box,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from "@mui/material";

import { Chats } from "@/shared/types/messageType";

interface ApplicantListProps {
  searchTerm: string;
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  filteredApplicants: Chats[];
  selectedApplicant: Chats | null;
  handleListItemClick: (applicant: Chats) => void;
}

const ApplicantList: React.FC<ApplicantListProps> = ({
  searchTerm,
  handleSearchChange,
  filteredApplicants,
  selectedApplicant,
  handleListItemClick,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: "0 0 30%",
        height: "100%",
        overflowY: "auto",
        background: "white",
        overflowX: "hidden", // Prevent horizontal scrolling
      }}
    >
      {/* Search Bar */}
      <Box sx={{ paddingX: "0.5rem", paddingTop: "1rem" }}>
        <TextField
          fullWidth
          placeholder="Search applicants..."
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          size="small"
          sx={{
            marginBottom: 2,
            borderRadius: "2rem",
            border: "1px solidrgb(98, 202, 202)",
            "& .MuiOutlinedInput-root": {
              borderRadius: "2rem",
            },
          }}
        />
      </Box>

      {/* Applicants List */}
      <List>
        {filteredApplicants.map((applicant, index) => (
          <ListItem
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              bgcolor: selectedApplicant === applicant ? "#A2E6FFE8" : "white",
              color: "black",
              "&:hover": {
                bgcolor:
                  selectedApplicant === applicant ? "darkgray" : "#f0f0f0",
              },
              transition: "background-color 0.3s",
              position: "relative",
              paddingBottom: "0.5rem",
            }}
            onClick={() => handleListItemClick(applicant)}
          >
            <ListItemAvatar>
              <Avatar />
            </ListItemAvatar>
            <ListItemText
              primary={applicant.name}
              secondary={applicant.location}
              sx={{
                whiteSpace: "nowrap", // Prevent long text from wrapping
                overflow: "hidden", // Hide overflowing text
                textOverflow: "ellipsis", // Add ellipsis if text is too long
              }}
            />
            {/* Center Gray Line */}
            <Box
              sx={{
                position: "absolute",
                bottom: "0",
                left: "4%", // Align line to the left edge
                right: "5%", // Align line to the right edge
                height: "1px",
                backgroundColor: "#D1D9E9",
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ApplicantList;
