import * as React from "react";
import Svg, { Path, Circle } from "react-native-svg";

const VideoIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={24}
    height={24}
    color="#000000"
    fill="none"
    {...props}
  >
    <Path
      d="M2 11C2 7.70017 2 6.05025 3.02513 5.02513C4.05025 4 5.70017 4 9 4H10C13.2998 4 14.9497 4 15.9749 5.02513C17 6.05025 17 7.70017 17 11V13C17 16.2998 17 17.9497 15.9749 18.9749C14.9497 20 13.2998 20 10 20H9C5.70017 20 4.05025 20 3.02513 18.9749C2 17.9497 2 16.2998 2 13V11Z"
      stroke="currentColor"
      strokeWidth={props.strokeWidth}
    />
    <Path
      d="M17 8.90585L17.1259 8.80196C19.2417 7.05623 20.2996 6.18336 21.1498 6.60482C22 7.02628 22 8.42355 22 11.2181V12.7819C22 15.5765 22 16.9737 21.1498 17.3952C20.2996 17.8166 19.2417 16.9438 17.1259 15.198L17 15.0941"
      stroke="currentColor"
      strokeWidth={props.strokeWidth}
      strokeLinecap="round"
    />
    <Circle
      cx="11.5"
      cy="9.5"
      r="1.5"
      stroke="currentColor"
      strokeWidth={props.strokeWidth}
    />
  </Svg>
);

export default VideoIcon;
