"use client";
import { useRouter } from "next/navigation"; // App Router's navigation
import { FunctionComponent, MouseEventHandler } from "react";
import { LinkToPage } from "@/utils";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/store/features/auth/authSlice";
import { usePathname } from "next/navigation"; // Importing the hook

interface Props extends LinkToPage {
  openInNewTab?: boolean;
  selected?: boolean;
  onClick?: MouseEventHandler;
  children?: Array<LinkToPage>;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

/**
 * Renders Navigation Item for SideBar, detects current url and sets selected state if needed.
 * Supports child navigation items.
 */
const SideBarNavItem: FunctionComponent<Props> = ({
  icon: Icon,
  path,
  subtitle,
  title,
  children = [],
}) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname(); // Using usePathname to get the current URL path
  const dispatch = useDispatch();

  const handleToggle = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent parent click handling
    setOpen((prev) => !prev); // Toggle dropdown visibility
  };

  const hasChildren = children.length > 0; // Explicit check for children existence
  const isSelected = pathname === path; // Check if current path matches the parent
  const isChildSelected = children.some((child) => pathname === child.path); // Check if any child is selected

  const changePage = () => {
    console.log("path", path);
    if (title === "Log Out") {
      // Log out user
      dispatch(logoutUser());
      router.push("/"); // Redirect to the home page
    }
    if (path) {
      router.push(path);
    }
  };

  return (
    <>
      <ListItemButton
        component={"div"}
        onClick={hasChildren ? handleToggle : changePage}
        sx={{
          position: "relative",
          backgroundColor:
            isSelected || isChildSelected ? "#45536C" : "#242D3D",
          display: "flex",
          justifyContent: "left",
          paddingLeft: 2,
          paddingRight: 2,
          color: isSelected || isChildSelected ? "#FFFFFF" : "#687B9D",
          borderRadius: isSelected || isChildSelected ? "8px" : "0px", // Add border radius when selected
          margin: "4px 8px", // Add margin for spacing
          "&:hover": {
            backgroundColor: "#354053",
            borderRadius: "8px", // Add border radius on hover too
          },
        }}
      >
        {Icon && (
          <ListItemIcon
            sx={{
              minWidth: "40px",
              "& svg": {
                fill: isSelected || isChildSelected ? "#FF6B00" : "#687B9D", // Change SVG fill color
                "& path": {
                  fill: isSelected || isChildSelected ? "#FF6B00" : "#687B9D", // Ensure path elements also change color
                },
              },
            }}
          >
            <Icon />
          </ListItemIcon>
        )}
        <ListItemText
          primary={title}
          secondary={subtitle}
          sx={{
            color: isSelected || isChildSelected ? "#FFFFFF" : "#687B9D",
            "& .MuiListItemText-primary": {
              fontWeight: isSelected || isChildSelected ? 600 : 400, // Make text bold when selected
            },
          }}
        />
        {hasChildren && (
          <ListItemIcon sx={{ minWidth: "40px", color: "#FFFFFF" }}>
            {open ? (
              <ExpandLess
                sx={{
                  "& svg": {
                    fill: isSelected || isChildSelected ? "#FF6B00" : "white",
                  },
                }}
              />
            ) : (
              <ExpandMore
                sx={{
                  "& svg": {
                    fill: isSelected || isChildSelected ? "#FF6B00" : "white",
                  },
                }}
              />
            )}
          </ListItemIcon>
        )}
      </ListItemButton>
      {hasChildren && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {children.map((child) => {
              const isChildSelected = pathname === child.path;
              return (
                <ListItemButton
                  key={`${child.title}-${child.path}`}
                  onClick={() => router.push(child.path || "#")}
                  sx={{
                    backgroundColor: isChildSelected ? "#45536C" : "#242D3D",
                    color: isChildSelected ? "#FFFFFF" : "#687B9D",
                    paddingLeft: 4,
                    paddingRight: 2,
                    margin: "4px 8px",
                    borderRadius: isChildSelected ? "8px" : "0px",
                    "&:hover": {
                      backgroundColor: "#354053",
                      borderRadius: "8px",
                    },
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  {child.icon && (
                    <ListItemIcon
                      sx={{
                        minWidth: "40px",
                        "& svg": {
                          fill: isChildSelected ? "#FF6B00" : "#687B9D", // Change SVG fill color
                          "& path": {
                            fill: isChildSelected ? "#FF6B00" : "#687B9D", // Ensure path elements also change color
                          },
                        },
                      }}
                    >
                      <child.icon />
                    </ListItemIcon>
                  )}
                  <ListItemText
                    primary={child.title}
                    secondary={child.subtitle}
                    sx={{
                      color: isChildSelected ? "#FFFFFF" : "#687B9D",
                      "& .MuiListItemText-primary": {
                        fontWeight: isChildSelected ? 600 : 400,
                      },
                    }}
                  />
                </ListItemButton>
              );
            })}
          </List>
        </Collapse>
      )}
    </>
  );
};

export default SideBarNavItem;
