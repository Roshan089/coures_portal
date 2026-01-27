import React, { ForwardedRef, HTMLProps } from "react";
import {
  Button as MUIButton,
  ButtonProps as MUIButtonProps,
} from "@mui/material";
import { Home } from "@mui/icons-material"; // Example of importing a specific icon

// Define prop types for Button
interface ButtonProps extends MUIButtonProps {
  active?: boolean;
  reversed?: boolean;
}

// Update Button component with TypeScript types and MUI Button
export const Button = React.forwardRef(
  (
    { active, reversed, ...props }: ButtonProps,
    ref: ForwardedRef<HTMLButtonElement>
  ) => (
    <MUIButton
      {...props}
      ref={ref}
      sx={{
        cursor: "pointer",
        color: reversed
          ? active
            ? "white"
            : "#aaa"
          : active
          ? "black"
          : "#ccc",
      }}
    />
  )
);

// Set display name for Button
Button.displayName = "Button";

// Define prop types for Icon
interface IconProps extends HTMLProps<HTMLSpanElement> {}

// Example of using MUI's Home icon component directly
export const Icon = React.forwardRef(
  ({ className, ...props }: IconProps, ref: ForwardedRef<HTMLSpanElement>) => (
    <Home {...props} ref={ref} className={className} sx={{ fontSize: 18 }} />
  )
);

// Set display name for Icon
Icon.displayName = "Icon";

// Define prop types for Menu
interface MenuProps extends HTMLProps<HTMLDivElement> {}

// Update Menu component with TypeScript types and MUI Toolbar
export const Menu = React.forwardRef(
  ({ className, ...props }: MenuProps, ref: ForwardedRef<HTMLDivElement>) => (
    <div {...props} ref={ref} className={className}>
      {props.children}
    </div>
  )
);

// Set display name for Menu
Menu.displayName = "Menu";

// Define prop types for Toolbar
interface ToolbarProps extends MenuProps {}

// Update Toolbar component with TypeScript types and MUI Toolbar
export const Toolbar = React.forwardRef(
  (
    { className, ...props }: ToolbarProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => <Menu {...props} ref={ref} className={className} />
);

// Set display name for Toolbar
Toolbar.displayName = "Toolbar";
