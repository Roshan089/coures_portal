"use client";
import React from "react";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
  timelineItemClasses,
} from "@mui/lab";
import { Typography } from "@mui/material";
import { TExperience } from "@/shared/types/ApplicantExperience";

interface ExperienceTimelineProps {
  experiences: TExperience[];
}

const ExperienceTimeline: React.FC<ExperienceTimelineProps> = ({
  experiences,
}) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const getDuration = (startDate: string, endDate: string | null) => {
    const start = formatDate(startDate);
    const end = endDate ? formatDate(endDate) : "Present";
    return `${start} - ${end}`;
  };

  return (
    <Timeline
      sx={{
        [`& .${timelineItemClasses.root}:before`]: {
          flex: 0,
          padding: 0,
        },
        padding: 2,
        margin: 0,
        marginLeft: "-19px", // Align with the Experience heading
      }}
    >
      {experiences?.map((experience, index) => (
        <TimelineItem
          key={experience.id}
          sx={{
            "&:before": {
              display: "none", // Remove the default padding
            },
            minHeight: index === experiences.length - 1 ? "auto" : "100px", // Add spacing between items except last
          }}
        >
          <TimelineSeparator>
            <TimelineDot
              sx={{
                backgroundColor: "#00AFF0",
                margin: 0,
                padding: "4px",
                marginTop: "6px", // Align dot with the title text
              }}
            />
            {index < experiences.length - 1 && (
              <TimelineConnector
                sx={{
                  backgroundColor: "#00AFF0",
                  width: "2px",
                  marginY: 0,
                }}
              />
            )}
          </TimelineSeparator>
          <TimelineContent
            sx={{
              paddingY: 0,
              paddingX: 2,
              marginBottom: index === experiences.length - 1 ? 0 : 2,
              marginTop: 0, // Remove default top margin
            }}
          >
            <Typography
              variant="h6"
              sx={{
                marginTop: 0, // Remove default top margin
                lineHeight: 1.5, // Adjust line height for better alignment
              }}
            >
              {experience.title}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {experience.company} • {experience.employmentType}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {getDuration(experience.startDate, experience.endDate)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {experience.location}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              {experience.description}
            </Typography>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
};

export default ExperienceTimeline;
