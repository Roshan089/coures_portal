"use client";
import React, { useRef, useState } from "react";
import { Box, Button, Popover, Typography, useMediaQuery } from "@mui/material";
import Tiptap from "@/components/common/Tiptap";
import { useSelector } from "react-redux";
import {
  usePatchUploadCvMutation,
  useUploadCvMutation,
} from "@/store/api/uploadCvApiApiSlice";
import { RootState } from "@/store/store";
import { APPLICANT_ROUTES } from "@/shared/constants";
import { TJobs } from "@/shared/types/jobType";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ApplyPopoverProps {
  open: boolean;
  anchorEl: HTMLButtonElement | null;
  handleClose: () => void;
  selectedJob: TJobs;
}

const ApplyPopover: React.FC<ApplyPopoverProps> = ({
  open,
  anchorEl,
  handleClose,
  selectedJob,
}) => {
  const [uploadCv] = useUploadCvMutation();
  const [patchUploadCv] = usePatchUploadCvMutation();

  const isSmallScreen = useMediaQuery("(max-width: 900px)");
  // Navigate to the job details page

  // State to store selected file name
  const [fileName, setFileName] = useState<string | null>(null);

  // Reference to file input
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // State to hold the content from Tiptap
  const [editorContent, setEditorContent] = useState<string>("");

  // Handle file selection and logging
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // const file = event.target.files?.[0]; // Get the first file
    // if (file) {
    //   console.log("File selected:", file); // Logs the file object
    //   console.log("File name:", file.name); // Logs the file name
    //   setFileName(file.name); // Set the name of the selected file
    // }
    setFileName("www.example.com"); // Set the name of the selected file
  };

  // Trigger file input click when the user clicks on the upload area
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Opens file dialog
    }
  };
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const applicantId = currentUser.user.userType?.id;

  const existingApplication = Array.isArray(selectedJob?.application)
  ? selectedJob.application.find(
      (app) => app.applicantId === applicantId
    )
  : null;

const applicationId = existingApplication?.id ?? null;
const applicantAction = existingApplication?.applicantAction ?? null;


  const jobId = selectedJob?.id;

  

  // Handle Apply button click to log both file and editor content
  const handleApplyClick = async () => {
    if (!fileName) {
      console.error("No file selected");
      return;
    }

    const coverLetter = editorContent;
    const resume = fileName;

    const formData = {
      applicantId,
      jobId,
      coverLetter,
      resume,
    };

    try {
      let response;

      if (existingApplication && applicantAction) {
        // Update existing application (patch request)
        response = await patchUploadCv({
          id: applicationId,
          formData,
        }).unwrap();
      } else {
        // Create new application
        response = await uploadCv(formData).unwrap();
      }
      

      toast.success("CV uploaded successfully!");
      handleClose();

      // Redirecting to the job listing page after success
      window.location.href = APPLICANT_ROUTES.ALL_JOBS;
    } catch (error) {
      toast.error("Failed to upload CV. Please try again.");
      console.error("Upload Error", error);
    }
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      sx={{
        backdropFilter: "blur(5px)",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        "& .MuiPopover-paper": {
          width: isSmallScreen ? "95%" : "70%",
          height: isSmallScreen ? "90vh" : "80vh",
          borderRadius: "8px",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
          position: "fixed",
          left: "50% !important",
          top: "50% !important",
          transform: "translate(-50%, -50%) !important",
          overflowY: "scroll",
          border: "solid",
          paddingX: isSmallScreen ? "16px" : "80px",
        },
      }}
    >
      <Box
        sx={{
          p: isSmallScreen ? 2 : 3,
          backgroundColor: "white",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 1, fontSize: isSmallScreen ? "12px" : "14px" }}
        >
          3 free applications left.
        </Typography>

        <Typography
          variant="h6"
          sx={{
            mb: 2,
            fontWeight: 600,
            fontSize: isSmallScreen ? "18px" : "20px",
          }}
        >
          Apply with your CV
        </Typography>

        <Typography sx={{ mb: 1, fontSize: "14px" }}>Upload CV</Typography>

        {/* File Upload Area */}
        <Box
          sx={{
            width: "100%",
            border: "1px solid #E5E7EB",
            borderStyle: "solid",
            borderRadius: "4px",
            p: isSmallScreen ? 2 : 3,
            mb: 2,
            textAlign: "center",
            cursor: "pointer",
            minHeight: isSmallScreen ? "100px" : "120px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.02)",
            },
          }}
          onClick={handleUploadClick}
        >
          <Typography sx={{ fontSize: "24px", mb: 1 }}>+</Typography>
          <Typography
            variant="caption"
            sx={{ color: "#6B7280", fontSize: "12px" }}
          >
            File types accepted: TXT, PDF or Word Doc
          </Typography>
        </Box>

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          accept=".txt,.pdf,.docx"
          style={{ display: "none" }}
          onChange={handleFileChange} // Handle file selection
        />

        {/* Display selected file name */}
        {fileName && (
          <Typography variant="body2" sx={{ mt: 2, fontSize: "14px" }}>
            Selected file: {fileName}
          </Typography>
        )}

        {/* Tiptap Editor */}
        <Tiptap
          initialContent={editorContent} // Set initial content if needed
          onChange={(content) => setEditorContent(content)} // Capture content change
        />

        <Button
          variant="contained"
          sx={{
            backgroundColor: "#475569",
            textTransform: "none",
            py: isSmallScreen ? 1 : 1.5,
            width: isSmallScreen ? "100%" : "200px",
            display: "block",
            margin: "0 auto",
            "&:hover": {
              backgroundColor: "#364152",
            },
          }}
          onClick={handleApplyClick}
        >
          Apply
        </Button>
      </Box>
    </Popover>
  );
};

export default ApplyPopover;
