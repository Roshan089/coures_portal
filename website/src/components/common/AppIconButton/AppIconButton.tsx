import { ElementType, FunctionComponent, useMemo } from "react";
import {
  Tooltip,
  IconButton,
  IconButtonProps,
  TooltipProps,
  ButtonProps,
} from "@mui/material";
import AppIcon from "../AppIcon";
import AppLink from "../AppLink";
import { alpha } from "@mui/material";
import { Props } from "../AppIcon/AppIcon";
import { IconName } from "../AppIcon/config";

export const MUI_ICON_BUTTON_COLORS = [
  "inherit",
  "default",
  "primary",
  "secondary",
  "success",
  "error",
  "info",
  "warning",
  "white", // Added white to the colors
];

export interface AppIconButtonProps extends Omit<IconButtonProps, "color"> {
  color?: string; // Text color (icon color)
  bgcolor?: string; // Background color (background color of the button)
  icon?: IconName | string | Element;
  iconProps?: Partial<Props>;
  // Missing props
  component?: ElementType; // Could be RouterLink, AppLink, <a>, etc.
  to?: string; // Link prop
  href?: string; // Link prop
  openInNewTab?: boolean; // Link prop
  tooltipProps?: Partial<TooltipProps>;
  variant?: string;
}

/**
 * Renders MUI IconButton with SVG image by given Icon name
 * @param {string} [color] - text color (icon color). Non MUI values are also accepted.
 * @param {boolean} [disabled] - the IconButton is not active when true, also the Tooltip is not rendered.
 * @param {string} [href] - external link URI
 * @param {string} [icon] - name of Icon to render inside the IconButton
 * @param {object} [iconProps] - additional props to pass into the AppIcon component
 * @param {boolean} [openInNewTab] - link will be opened in new tab when true
 * @param {string} [size] - size of the button: 'small', 'medium' or 'large'
 * @param {Array<func| object| bool> | func | object} [sx] - additional CSS styles to apply to the button
 * @param {string} [title] - when set, the IconButton is rendered inside Tooltip with this text
 * @param {string} [to] - internal link URI
 * @param {object} [tooltipProps] - additional props to pass into the Tooltip component
 */
const AppIconButton: FunctionComponent<AppIconButtonProps> = ({
  color = "white", // Default text color (icon color) set to "white"
  bgcolor = "primary.main", // Default background color
  component,
  children,
  disabled,
  icon,
  iconProps,
  sx = {},
  title,
  variant = "outlined",
  tooltipProps,
  ...restOfProps
}) => {
  const componentToRender =
    !component && (restOfProps?.href || restOfProps?.to)
      ? AppLink
      : component ?? IconButton;

  const iconButtonToRender = useMemo(() => {
    const sxToRender = {
      ...sx,
      backgroundColor: bgcolor, // Set the background color
      color: color,
      ":hover": {
        backgroundColor: "orange", // Hover effect for background color
        color: "white",
      },
    };

    // Button styles based on variant
    let buttonProps: ButtonProps = {};
    if (variant === "text") {
      buttonProps = { variant: "text" };
    } else if (variant === "submit") {
      buttonProps = { variant: "contained" }; // You can adjust to "submit" for a button styled like a submit button
    } else if (variant === "outlined") {
      buttonProps = { variant: "outlined" };
    } else {
      buttonProps = { variant: "contained" };
    }

    return (
      <IconButton
        component={componentToRender}
        disabled={disabled}
        sx={sxToRender}
        {...restOfProps}
        {...buttonProps}
      >
        {icon && <AppIcon icon={icon} {...iconProps} />}
        {children}
      </IconButton>
    );
  }, [
    color,
    componentToRender,
    children,
    disabled,
    icon,
    sx,
    iconProps,
    restOfProps,
    bgcolor,
    variant,
  ]);

  // When title is set, wrap the IconButton with Tooltip.
  // Note: when IconButton is disabled the Tooltip is not working, so we don't need it
  return title && !disabled ? (
    <Tooltip title={title} {...tooltipProps}>
      {iconButtonToRender}
    </Tooltip>
  ) : (
    iconButtonToRender
  );
};

export default AppIconButton;
