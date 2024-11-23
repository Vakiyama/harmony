import { A } from "@solidjs/router";

export default function EventCreateTopNav(props: {
  handleCreate: (e: Event) => void;
  name?: string;
  teamId: number;
}) {
  return (
    <div class="sticky top-0 w-full flex flex-row h-[104px] bg-[#fcfcfc] shadow-md border-b border-[#1e1e1e]/20">
      <div class="w-full flex flex-row justify-between items-end px-4 mb-4">
        <A
          class="text-[#1e1e1e] text-base font-normal font-sf-pro leading-tight"
          href={`/team/${props.teamId}/calendar`}
        >
          Back
        </A>
        <div class="relative">
          <div class="text-[#1e1e1e] text-[19px] font-medium font-grotesque">
            {props.name ? `${props.name}'s Care Team` : ""}
          </div>
        </div>
        <button
          class="text-[#1e1e1e] text-base font-normal font-sf-pro leading-tight"
          onClick={props.handleCreate}
        >
          Create
        </button>
      </div>
    </div>
  );
}
