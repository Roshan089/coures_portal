import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  Code,
  LooksOne,
  LooksTwo,
  FormatQuote,
  FormatListNumbered,
  FormatListBulleted,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  FormatAlignJustify,
} from "@mui/icons-material";

export const ICON_MAPPING: Record<string, React.ElementType> = {
  bold: FormatBold,
  italic: FormatItalic,
  underline: FormatUnderlined,
  code: Code,
  "heading-one": LooksOne,
  "heading-two": LooksTwo,
  "block-quote": FormatQuote,
  "numbered-list": FormatListNumbered,
  "bulleted-list": FormatListBulleted,

  // Add alignment icons
  left: FormatAlignLeft,
  center: FormatAlignCenter,
  right: FormatAlignRight,
  justify: FormatAlignJustify,
};
