"use client";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Stack,
  Chip,
  Divider,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useRouter } from "next/navigation";
import RichTextDisplay from "../common/RichTextDisplay";
import { TJobs } from "@/shared/types/jobType";

interface CompanyCard extends TJobs {
  // Additional properties if needed
}

interface TopCompaniesProps {
  data: TJobs[]; // Updated to use TJobs type
}

export function TopCompanies({ data }: TopCompaniesProps) {
  const router = useRouter();

  const handleOpenPositionsClick = (jobId: string) => {
    router.push(`/applicant/job-details?jobId=${jobId}`);
  };

  return (
    <Box
      sx={{
        width: "100%",
        overflowX: { xs: "auto", md: "hidden" },
        WebkitOverflowScrolling: "touch",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": { display: "none" },
        "-ms-overflow-style": "none",
      }}
    >
      <Stack
        direction="row"
        spacing={2}
        sx={{
          display: "flex",
          flexWrap: "nowrap",
          gap: 2,
          py: 1,
          px: 1,
          minWidth: "min-content",
          "& > *": {
            flex: "0 0 auto",
          },
        }}
      >
        {data?.map((company: TJobs) => (
          <Card
            key={company.id}
            sx={{
              width: { xs: "280px", sm: "300px", md: "320px" },
              minWidth: { xs: "280px", sm: "300px", md: "320px" },
              maxWidth: { xs: "280px", sm: "300px", md: "320px" },
              borderRadius: 2,
              "&:hover": {
                boxShadow: 6,
                transform: "translateY(-2px)",
                transition: "all 0.2s ease-in-out",
              },
            }}
          >
            <CardContent>
              <Stack spacing={{ xs: 1.5, sm: 2 }}>
                {/* Company Info */}
                <Stack
                  direction="row"
                  spacing={{ xs: 1.5, sm: 2 }}
                  alignItems="center"
                >
                  <Avatar
                    alt={company.title}
                    sx={{
                      width: { xs: 48, sm: 56 },
                      height: { xs: 48, sm: 56 },
                    }}
                  />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="h6"
                      component="h2"
                      sx={{
                        fontSize: { xs: "1rem", sm: "1.25rem" },
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {company.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {company.company?.name}
                    </Typography>
                  </Box>
                </Stack>

                {/* Description */}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    minHeight: { xs: "4em", sm: "4.5em" },
                    fontSize: { xs: "0.875rem", sm: "0.875rem" },
                  }}
                >
                  <RichTextDisplay content={company.description} />
                </Typography>

                {/* Tags */}
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    flexWrap: "wrap",
                    gap: 1,
                  }}
                >
                  <Chip
                    label={company.sector}
                    size="small"
                    sx={{
                      bgcolor: "primary.light",
                      color: "primary.main",
                      fontSize: { xs: "0.75rem", sm: "0.8125rem" },
                    }}
                  />
                  <Chip
                    icon={<TrendingUpIcon />}
                    label={company.growth}
                    size="small"
                    sx={{
                      bgcolor: "success.light",
                      color: "success.main",
                      fontSize: { xs: "0.75rem", sm: "0.8125rem" },
                    }}
                  />
                </Stack>

                <Divider />

                {/* Open Positions */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mt: 2,
                    cursor: "pointer",
                    "&:hover": { color: "primary.main" },
                  }}
                  onClick={() => handleOpenPositionsClick(company.id)}
                >
                  <Typography variant="body1" fontWeight="medium">
                    View Job Details
                  </Typography>
                  <ArrowForwardIcon />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}

export default TopCompanies;
