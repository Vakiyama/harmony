export default function ReallyTerrible(props: {
  width?: string;
  height?: string;
  labelClass?: string;
  iconColour?: string;
}) {
  return (
    <>
      <svg
        fill="none"
        stroke-width="2"
        xmlns="http://www.w3.org/2000/svg"
        class="icon icon-tabler icon-tabler-mood-annoyed"
        width={props.width || "32px"}
        height={props.height || "32px"}
        viewBox="2 2 20 20"
        stroke={props.iconColour || "currentColor"}
        stroke-linecap="round"
        stroke-linejoin="round"
        style="overflow: visible; color: currentcolor;"
      >
        <path stroke="none" d="M0 0h24v24H0z"></path>
        <path d="M12 21a9 9 0 1 1 0 -18a9 9 0 0 1 0 18z"></path>
        <path d="M15 14c-2 0 -3 1 -3.5 2.05"></path>
        <path d="M9 10h-.01"></path>
        <path d="M15 10h-.01"></path>
      </svg>
      <p class={props.labelClass || "mt-2 text-subtitle"}>REALLY TERRIBLE</p>
    </>
  );
}
