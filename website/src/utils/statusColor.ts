export enum StatusColors {
  Open = "#4BFF93",
  Closed = "#FF7B7B",
  Pending = "yellow",
  Saved = "blue",
  Accepted = "#4BFF93",
  Rejected = "#FF7B7B",
 
  
  
}

export const getStatusColor = (status: keyof typeof StatusColors | string) => {
  // Return the color from the dynamic status-color map, defaulting to gray if not found
  return status in StatusColors
    ? StatusColors[status as keyof typeof StatusColors]
    : "gray";
};
