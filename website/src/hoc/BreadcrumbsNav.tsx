"use client";

import { useRouter, usePathname } from "next/navigation";
import { useBreadcrumbs } from "./useBreadcrumbs";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

interface BreadcrumbNavItem {
  label: string;
  href?: string;
  onClick?: () => void;
  hasOnClick?: boolean;
}

const BreadcrumbsNav = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { breadcrumbs } = useBreadcrumbs();

  // Check if breadcrumbs should be hidden
  const shouldHideBreadcrumbs = () => {
    // Hide on dashboard routes
    if (pathname.endsWith("/dashboard")) return true;

    // Hide on specific patterns
    const routePatternsWithoutBreadcrumbs = [
      /^\/admin\/superadmin-dashboard/, // Admin dashboard and sub-routes
      /^\/company\/dashboard/, // Company dashboard and sub-routes
    ];

    return routePatternsWithoutBreadcrumbs.some((pattern) =>
      pattern.test(pathname)
    );
  };

  // Don't render if breadcrumbs should be hidden
  if (shouldHideBreadcrumbs()) return null;

  const handleClick = (item: BreadcrumbNavItem) => {
    if (item.onClick) {
      item.onClick();
    } else if (item.href) {
      router.push(item.href);
    }
  };

  return (
    <Breadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      aria-label="breadcrumb"
      sx={{
        padding: 2,
        "& .MuiBreadcrumbs-separator": {
          mx: 1,
        },
      }}
    >
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;

        return isLast ? (
          <Typography
            key={index}
            color="text.primary"
            sx={{
              fontFamily: "inherit",
              textTransform: "capitalize",
            }}
          >
            {crumb.label}
          </Typography>
        ) : (
          <Link
            key={index}
            component="button"
            underline="hover"
            color="inherit"
            onClick={() => handleClick(crumb)}
            sx={{
              cursor: "pointer",
              border: "none",
              background: "none",
              p: 0,
              fontFamily: "inherit",
              textTransform: "capitalize",
            }}
          >
            {crumb.label}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};

export default BreadcrumbsNav;
