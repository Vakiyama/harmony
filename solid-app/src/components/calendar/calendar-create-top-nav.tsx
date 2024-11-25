import { A } from "@solidjs/router";
import TopNav from "../shared/TopNav";

export default function EventCreateTopNav(props: {
  handleCreate: (e: Event) => void;
  name?: string;
  teamId: number;
}) {
  return (
    <TopNav
      name={props.name ? `${props.name}'s Care Team` : ""}
      leftNavigation="Calendar"
      rightNavigation={
        <button
          class="text-[#1e1e1e] text-base font-normal font-sf-pro leading-tight"
          onClick={props.handleCreate}
        >
          Create
        </button>
      }
    />
  );
}
