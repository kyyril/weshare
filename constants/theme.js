export const theme = {
  colors: {
    bg: "rgba(13, 13, 13, 0.9)", // dark semi-transparent background (glassmorph)
    glass: "rgba(30, 30, 30, 0.57)", // for card or modal background
    primary: "#7F5AF0", // neon purple (modern)
    secondary: "#2CB67D", // neon green (fresh)
    accent: "#F25F4C", // neon orange/red (energetic)
    blue: "#3D5AFE", // neon blue (backup color)
    pink: "#FF6EC7", // neon pink
    dark: "#0D0D0D", // base dark
    darkLight: "#1A1A1A", // lighter dark for sections
    gray: "#6B7280", // muted dark gray
    text: "#F9FAFB", // almost white text
    textLight: "#9CA3AF", // soft light gray text
    textDark: "#FFFFFF", // pure white
    rose: "#FF4D6D", // vibrant pinkish red
    roseLight: "#FF7B9C", // soft pink red
  },
  fonts: {
    medium: "500",
    semibold: "600",
    bold: "700",
    extraBold: "800",
  },
  radius: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 22,
    full: 9999, // for fully rounded glass
  },
  effects: {
    blur: "backdrop-blur-md", // medium glass blur
    glassShadow: "0 4px 30px rgba(0, 0, 0, 0.5)", // subtle shadow for glass
    neonShadow: "0 0 20px rgba(127, 90, 240, 0.7)", // purple neon glow
    multiColorBackground:
      "linear-gradient(135deg, rgba(127,90,240,0.4), rgba(44,182,125,0.4), rgba(242,95,76,0.4))", // radiant background
  },
};
