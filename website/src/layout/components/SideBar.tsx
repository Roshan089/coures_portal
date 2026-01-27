"use client";
import { Box, Divider, Drawer, DrawerProps, Stack } from "@mui/material";
import { FunctionComponent, MouseEvent, useCallback } from "react";

import LogiLeadsLogo from "@/components/common/AppIcon/icons/LogiLeadsLogo";
import { LinkToPage } from "@/utils";
import { SIDE_BAR_WIDTH } from "../config";
import SideBarNavList from "./SideBarNavList";

export interface SideBarProps
  extends Pick<
    DrawerProps,
    "anchor" | "className" | "open" | "variant" | "onClose"
  > {
  items: Array<LinkToPage>;
}

const SideBar: FunctionComponent<SideBarProps> = ({
  open,
  variant,
  items,
  onClose,
}) => {
  const handleAfterLinkClick = useCallback(
    (event: MouseEvent) => {
      if (variant === "temporary" && typeof onClose === "function") {
        onClose(event, "backdropClick");
      }
    },
    [variant, onClose]
  );

  return (
    <Box sx={{ display: "flex" }}>
      <Box
        component="nav"
        sx={{
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          bgcolor: "#242D3D",
          height: "100%",
        }}
      >
        <Drawer
          variant="persistent"
          open={open}
          onClose={onClose}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            "& .MuiDrawer-paper": {
              width: SIDE_BAR_WIDTH,
              backgroundColor: "#242D3D",
            },
          }}
        >
          <Stack sx={{ height: "100%" }} onClick={handleAfterLinkClick}>
            <Box sx={{ paddingY: 3, paddingX: 8 }}>
              <LogiLeadsLogo />
            </Box>
            <Box sx={{ flex: 0 }}>
              <SideBarNavList items={items} />
            </Box>
            <Divider />
          </Stack>
          <footer
            style={{
              color: "#FFFFFF",
              display: "flex",
              justifyContent: "center",
            }}
          >
            Copyright LogiLeads 2025.
          </footer>
        </Drawer>
      </Box>
    </Box>
  );
};

export default SideBar;
