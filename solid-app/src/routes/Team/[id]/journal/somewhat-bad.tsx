export default function SomewhatBad(props: {
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
        class="icon icon-tabler icon-tabler-mood-confuzed"
        width={props.width || "32px"}
        height={props.height || "32px"}
        viewBox="2 2 20 20"
        stroke={props.iconColour || "currentColor"}
        stroke-linecap="round"
        stroke-linejoin="round"
        style="overflow: visible; color: currentcolor;"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
        <path d="M9 10l.01 0"></path>
        <path d="M15 10l.01 0"></path>
        <path d="M9.5 16a10 10 0 0 1 6 -1.5"></path>
      </svg>
      <p class={props.labelClass || "mt-2 text-subtitle"}>SOMEWHAT BAD</p>
    </>
  );
}
