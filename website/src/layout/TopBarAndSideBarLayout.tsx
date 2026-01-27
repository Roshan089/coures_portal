import { LinkToPage } from "@/utils";
import {
  AppBar,
  Drawer,
  Stack,
  StackProps,
  Toolbar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { FunctionComponent, useMemo, useState } from "react";
import { TopBar } from "./components";
import SideBar, { SideBarProps } from "./components/SideBar";
import {
  SIDE_BAR_DESKTOP_ANCHOR,
  SIDE_BAR_MOBILE_ANCHOR,
  TOP_BAR_DESKTOP_HEIGHT,
  TOP_BAR_MOBILE_HEIGHT,
} from "./config";

interface Props extends StackProps {
  sidebarItems: Array<LinkToPage>;
  title: string;
  companyLogo?: string;
  variant:
    | "sidebarAlwaysTemporary"
    | "sidebarPersistentOnDesktop"
    | "sidebarAlwaysPersistent";
}

const TopBarAndSideBarLayout: FunctionComponent<Props> = ({
  children,
  sidebarItems,
  variant,
}) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const theme = useTheme();

  const is900pxOrLess = useMediaQuery("(max-width:900px)");

  const sidebarProps = useMemo((): Partial<SideBarProps> => {
    const anchor = is900pxOrLess
      ? SIDE_BAR_MOBILE_ANCHOR
      : SIDE_BAR_DESKTOP_ANCHOR;
    let open = sidebarVisible;
    let sidebarVariant: SideBarProps["variant"] = "temporary";

    switch (variant) {
      case "sidebarAlwaysTemporary":
        break;
      case "sidebarPersistentOnDesktop":
        open = is900pxOrLess ? sidebarVisible : true;
        sidebarVariant = is900pxOrLess ? "temporary" : "persistent";
        break;
      case "sidebarAlwaysPersistent":
        open = true;
        sidebarVariant = "persistent";
        break;
    }

    return { anchor, open, variant: sidebarVariant };
  }, [is900pxOrLess, sidebarVisible, variant]);

  const onSideBarOpen = () => {
    setSidebarVisible(true);
  };

  const onSideBarClose = () => {
    setSidebarVisible(false);
  };

  const stackStyles = useMemo(() => {
    return {
      minHeight: "100vh",
      paddingTop: is900pxOrLess
        ? TOP_BAR_MOBILE_HEIGHT
        : TOP_BAR_DESKTOP_HEIGHT,
      paddingLeft:
        sidebarProps.variant === "persistent" &&
        sidebarProps.open &&
        sidebarProps?.anchor?.includes("left")
          ? theme.spacing(30)
          : 0,
      paddingRight:
        sidebarProps.variant === "persistent" &&
        sidebarProps.open &&
        sidebarProps?.anchor?.includes("right")
          ? theme.spacing(30)
          : 0,
    };
  }, [is900pxOrLess, sidebarProps, theme]);

  return (
    <Stack sx={stackStyles}>
      <AppBar position="fixed">
        <Toolbar>
          <TopBar onSidebarToggle={onSideBarOpen} />
        </Toolbar>
      </AppBar>

      {/* Drawer (Sidebar) */}
      <Drawer
        variant={sidebarProps.variant}
        open={sidebarProps.open}
        anchor={sidebarProps.anchor}
        onClose={onSideBarClose} // Close the sidebar on backdrop click
      >
        <SideBar
          items={sidebarItems}
          {...sidebarProps}
          onClose={onSideBarClose}
        />
      </Drawer>

      {/* Main content area */}
      <Stack component="main" flexGrow={1}>
        {children}
      </Stack>
    </Stack>
  );
};

export default TopBarAndSideBarLayout;
