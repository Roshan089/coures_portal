"use client";

import { AnchorHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import MuiLink, { LinkProps as MuiLinkProps } from "@mui/material/Link";
import { APP_LINK_COLOR, APP_LINK_UNDERLINE } from "../../config";

export const EXTERNAL_LINK_PROPS = {
  target: "_blank",
  rel: "noopener noreferrer",
};

/**
 * Props for NextLinkComposed component
 */
interface NextLinkComposedProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">,
    Omit<NextLinkProps, "href" | "as" | "onClick" | "onMouseEnter"> {
  to: NextLinkProps["href"];
  linkAs?: NextLinkProps["as"];
  href?: NextLinkProps["href"];
}

/**
 * NextJS composed link to use with Material UI
 * @NextLinkComposed NextLinkComposed
 */
const NextLinkComposed = forwardRef<HTMLAnchorElement, NextLinkComposedProps>(
  (
    {
      to,
      linkAs,
      href,
      replace,
      scroll,
      passHref,
      shallow,
      prefetch,
      ...restOfProps
    },
    ref
  ) => {
    return (
      <NextLink
        legacyBehavior={true} // TODO: Remove when MUI becomes compatible with NextJs 13+
        href={to}
        prefetch={prefetch}
        as={linkAs}
        replace={replace}
        scroll={scroll}
        shallow={shallow}
        passHref={passHref}
      >
        <a {...restOfProps} ref={ref} />
      </NextLink>
    );
  }
);

/**
 * Props for AppLinkForNext component
 */
export type AppLinkForNextProps = {
  activeClassName?: string;
  as?: NextLinkProps["as"];
  href?: string | NextLinkProps["href"];
  noLinkStyle?: boolean;
  to?: string | NextLinkProps["href"];
  openInNewTab?: boolean;
} & Omit<NextLinkComposedProps, "to" | "linkAs" | "href"> &
  Omit<MuiLinkProps, "href">;

/**
 * Material UI link for NextJS
 * @component AppLinkForNext
 */
const AppLinkForNext = forwardRef<HTMLAnchorElement, AppLinkForNextProps>(
  (
    {
      activeClassName = "active",
      as: linkAs,
      className: classNameProps,
      href,
      noLinkStyle,
      color = APP_LINK_COLOR,
      underline = APP_LINK_UNDERLINE,
      to,
      sx,
      openInNewTab = Boolean(href),
      ...restOfProps
    },
    ref
  ) => {
    const currentPath = usePathname();
    const destination = to ?? href ?? "";
    const pathname =
      typeof destination === "string" ? destination : destination.pathname;
    const className = clsx(classNameProps, {
      [activeClassName]: pathname === currentPath && activeClassName,
    });

    const isExternal =
      typeof destination === "string" &&
      (destination.startsWith("http") || destination.startsWith("mailto:"));

    const propsToRender = {
      color,
      underline,
      ...(openInNewTab && EXTERNAL_LINK_PROPS),
      ...restOfProps,
    };

    if (isExternal) {
      if (noLinkStyle) {
        return (
          <a
            className={className}
            href={destination as string}
            ref={ref}
            {...propsToRender}
          />
        );
      }

      return (
        <MuiLink
          className={className}
          href={destination as string}
          ref={ref}
          sx={sx}
          {...propsToRender}
        />
      );
    }

    if (noLinkStyle) {
      return (
        <NextLinkComposed
          className={className}
          ref={ref}
          to={destination}
          {...propsToRender}
        />
      );
    }

    return (
      <MuiLink
        component={NextLinkComposed}
        linkAs={linkAs}
        className={className}
        ref={ref}
        to={destination}
        sx={sx}
        {...propsToRender}
      />
    );
  }
);

export default AppLinkForNext;
