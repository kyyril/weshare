import { Dimensions } from "react-native";

const { width: deviceWidth, height: deviceHeight } = Dimensions.get("window");

export const hp = (percentage) => {
  return (percentage / 100) * deviceHeight;
};
export const wp = (percentage) => {
  return (percentage / 100) * deviceWidth;
};

export const stripHtmlTags = (html) => {
  return html.replace(/<[^>]*>?/gm, "");
};
