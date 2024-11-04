export default function SleepIcon(props: {
  width?: string;
  height?: string;
  iconColor?: string;
  bgColor?: string;
}) {
  return (
    <svg
      width={props.width || "68"}
      height={props.height || "68"}
      viewBox="0 0 68 68"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="0.275024"
        width="67.45"
        height="67.45"
        rx="33.725"
        fill={props.bgColor || "none"}
      />
      <path
        d="M50.6667 27.5917V13.9333H46.5V18.1H21.5V13.9333H17.3334V27.5938C14.8542 29.0375 13.1667 31.6958 13.1667 34.7667V43.1C13.1667 43.6525 13.3862 44.1825 13.7769 44.5732C14.1676 44.9639 14.6975 45.1833 15.25 45.1833H17.3334V53.5167H21.5V45.1833H46.5V53.5167H50.6667V45.1833H52.75C53.3026 45.1833 53.8325 44.9639 54.2232 44.5732C54.6139 44.1825 54.8334 43.6525 54.8334 43.1V34.7667C54.8334 31.6958 53.1438 29.0375 50.6667 27.5917ZM31.9167 26.4333H21.5V22.2667H31.9167V26.4333ZM46.5 26.4333H36.0834V22.2667H46.5V26.4333Z"
        fill={props.iconColor || "#000000"}
      />
    </svg>
  );
}
