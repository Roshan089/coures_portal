import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { Avatar, Button, Divider, Stack, IconButton } from "@mui/material";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/store/features/auth/authSlice";
import { useRouter } from "next/navigation";

// Import your SVGs for icons
import NotificationIcon from "@/components/common/AppIcon/icons/NotificationIcon";
import SearchIcon from "@/components/common/AppIcon/icons/SearchIcon";
import SettingIcon from "@/components/common/AppIcon/icons/SettingIcon";
import LogisticsLogo from "@/layout/components/LogisticsLogo.png";

// Import the SideBar component
import SideBar from "@/layout/components/SideBar"; // Adjust the import path as per your project structure

// Import MenuIcon for the hamburger icon
import MenuIcon from "@mui/icons-material/Menu";
import { LinkToPage } from "@/utils";

import { useState } from "react";
import { ADMIN_SIDEBAR_ITEMS } from "../constants/adminSidebar";
import { APPLICANT_SIDEBAR_ITEMS } from "../constants/applicantSibebar";
import { RECRUITER_SIDEBAR_ITEMS } from "../constants/recruitmentAgencySidebar";
import { COMPANY_SIDEBAR_ITEMS } from "../constants/companySidebar";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));



const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const IconContainer = styled("div")(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 48,
  height: 48,
  borderRadius: "50%",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
}));

const ProfileMenuContainer = styled(Menu)(({ theme }) => ({
  "& .MuiPaper-root": {
    padding: theme.spacing(2),
    width: 321,
  },
}));
interface TopBarProps {
  onSidebarToggle: () => void; // Ensure this prop is defined
}
const TopBar: React.FC<TopBarProps> = ({ onSidebarToggle }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const [searchVisible, setSearchVisible] = React.useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = React.useState(false);
  const [sidebarItems, setSidebarItems] = useState<Array<LinkToPage>>([]);
  const dispatch = useDispatch();
  const router = useRouter();

  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setProfileMenuOpen(true);
  };

  // Replace this with actual logic to get the role, e.g., from props, context, or API
  const role = "company"; // Hardcoded for demonstration; replace with actual logic

  React.useEffect(() => {
    setSidebarItems(getSidebarItems(role));
  }, [role]);

  const handleProfileMenuClose = () => {
    setProfileMenuOpen(false);
    setAnchorEl(null);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  
  // Function to toggle the sidebar

  const handleSidebarToggle = () => {
    onSidebarToggle();
  };

  const handleLogout = () => {
    dispatch(logoutUser()); // Clear auth state from Redux and localStorage
    handleProfileMenuClose(); // Close the profile menu
    router.push("/auth/login"); // Redirect to login page
  };

  const profileMenu = (
    <ProfileMenuContainer
      anchorEl={anchorEl}
      open={profileMenuOpen}
      onClose={handleProfileMenuClose}
      sx={{ mt: 5 }}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center", // Keeps the overall layout centered
        }}
      >
        {/* Profile section */}
        <Stack direction={"row"} spacing={2}>
          <Avatar
            alt="User"
            src={LogisticsLogo.src} // Ensure this is the correct image path
            sx={{ width: 66, height: 66, marginBottom: 2 }}
          />
          <Stack>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Menlo Logistics
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Logistics and Supply Chain Management
            </Typography>
          </Stack>
        </Stack>

        {/* View Profile Button */}
        <Button
          variant="contained"
          sx={{ mt: 2, width: "100%", bgcolor: "#242D3D" }}
          onClick={handleProfileMenuClose}
        >
          View Profile
        </Button>

        <Divider sx={{ my: 1 }} />

        {/* Menu Items */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch", // Ensure the items stretch to the full width of their container
            width: "100%", // Ensure the box takes the full width of its parent container
          }}
        >
          <MenuItem sx={{ justifyContent: "flex-start" }}>Account</MenuItem>
          <MenuItem sx={{ justifyContent: "flex-start" }}>Settings</MenuItem>
          <MenuItem sx={{ justifyContent: "flex-start" }}>Help</MenuItem>
          <MenuItem
            sx={{ justifyContent: "flex-start" }}
            onClick={handleLogout}
          >
            Log Out
          </MenuItem>
        </Box>
      </Box>
    </ProfileMenuContainer>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={() => setMobileMoreAnchorEl(null)}
    >
      
      <MenuItem onClick={handleMenuClose}></MenuItem>
      <MenuItem onClick={handleMenuClose}>My Account</MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" sx={{ bgcolor: "#242D3D" }}>
        <Toolbar>
          {/* Left Hamburger Icon */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={handleSidebarToggle} // Open/Close sidebar when clicked
          >
            <MenuIcon />
          </IconButton>

          {/* Center Search Bar */}
          

          {/* Icons on the right */}
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", width: "100%" }}
          >
            <Box sx={{ display: "flex", flexWrap: "nowrap" }}>
              

              {/* Profile Icon */}
              <IconContainer onClick={handleProfileMenuOpen}>
                <Avatar
                  alt="User"
                  src="/path/to/your/image.jpg"
                  sx={{ width: 25, height: 25 }}
                />
              </IconContainer>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar Component */}
      <SideBar
        items={sidebarItems} // Pass your menu items here
      />

      {renderMobileMenu}
      {profileMenu}
    </Box>
  );
};
export default TopBar;

export const getSidebarItems = (role: string): Array<LinkToPage> => {
  switch (role) {
    case "admin":
      return ADMIN_SIDEBAR_ITEMS;
    case "applicant":
      return APPLICANT_SIDEBAR_ITEMS;
    case "recruiter":
      return RECRUITER_SIDEBAR_ITEMS;
    case "company":
    default:
      return COMPANY_SIDEBAR_ITEMS; // Default is COMPANY_SIDEBAR_ITEMS
  }
};
