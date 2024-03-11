import { createSvgIcon } from '../SvgIcon';

export const CancelIcon = createSvgIcon(
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="20" height="20" rx="10" fill="#1D1D1D" />
    <g clipPath="url(#clip0_38_802)">
      <path
        d="M14 6L6 14"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 6L14 14"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_38_802">
        <rect width="16" height="16" fill="white" transform="translate(2 2)" />
      </clipPath>
    </defs>
  </svg>,
  'Cancel'
);
