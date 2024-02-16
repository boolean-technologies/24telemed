import * as React from "react";
type ScreenShareIconProps = {
  fillcolor: string;
  style?: React.CSSProperties;
} & React.SVGProps<SVGSVGElement>;
const ScreenShareIcon = (props : ScreenShareIconProps) => (
  <svg
    className="MuiSvgIcon-root "
    viewBox="0 0 24 24"
    aria-hidden="true"
    style={{
      height: 48,
      width: 48,
    }}
    {...props}
  >
    <path
      fill="#fff"
      d="M20 18c1.1 0 1.99-.9 1.99-2L22 6a2 2 0 0 0-2-2H4c-1.11 0-2 .89-2 2v10a2 2 0 0 0 2 2H0v2h24v-2h-4zm-7-3.53v-2.19c-2.78 0-4.61.85-6 2.72.56-2.67 2.11-5.33 6-5.87V7l4 3.73-4 3.74z"
    />
  </svg>
);

export default ScreenShareIcon;