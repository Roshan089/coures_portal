import { LinkToPage } from "@/utils";
import List from "@mui/material/List";
import { FunctionComponent, MouseEventHandler } from "react";
import SideBarNavItem from "./SideBarNavItem";

interface Props {
  items: Array<LinkToPage>;
  showIcons?: boolean;
  onClick?: MouseEventHandler;
}

/**
 * Renders list of Navigation Items inside SideBar.
 * Supports nested navigation items.
 */
const SideBarNavList: FunctionComponent<Props> = ({
  items,
  onClick,
  ...restOfProps
}) => {
  return (
    <List component="nav" {...restOfProps}>
      {items.map(({ icon, path, title, children }) => (
        <SideBarNavItem
          key={`${title}-${path}`}
          icon={icon}
          path={path}
          title={title}
          onClick={onClick}
        >
          {children}
        </SideBarNavItem>
      ))}
    </List>
  );
};

export default SideBarNavList;
