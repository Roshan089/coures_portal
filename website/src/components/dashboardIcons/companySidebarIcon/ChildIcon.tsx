import { FunctionComponent } from "react";
import { IconProps } from "@/components/common/AppIcon/utils";

const ChildIcon: FunctionComponent<IconProps> = () => {
  return (
    <svg
      width="5"
      height="5"
      viewBox="0 0 5 5"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="2.5" cy="2.5" r="2" stroke="#687B9D" />
    </svg>
  );
};

export default ChildIcon;
