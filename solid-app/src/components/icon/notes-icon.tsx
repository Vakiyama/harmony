export default function NotesIcon(props: {
  width?: string;
  height?: string;
  iconColor?: string;
  bgColor?: string;
  class?: string;
}) {
  return (
    <svg
      width={props.width || "68"}
      height={props.height || "68"}
      viewBox="0 0 68 68"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class={props.class || ""}
    >
      <rect
        x="0.275024"
        width="67.45"
        height="67.45"
        rx="33.725"
        fill={props.bgColor || "none"}
      />
      <path
        d="M19.7143 13.7251C16.5625 13.7251 14 16.2876 14 19.4394V48.0108C14 51.1626 16.5625 53.7251 19.7143 53.7251H39.7143V43.7251C39.7143 41.359 41.6339 39.4394 44 39.4394H54V19.4394C54 16.2876 51.4375 13.7251 48.2857 13.7251H19.7143ZM54 42.2965H44C43.2143 42.2965 42.5714 42.9394 42.5714 43.7251V53.7251L45.4286 50.868L51.1429 45.1537L54 42.2965Z"
        fill={props.iconColor || "#000000"}
      />
    </svg>
  );
}
