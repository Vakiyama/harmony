import { A } from "@solidjs/router";

export default function EventDetailsTopNav(props: {
  eventType: "task" | "event";
  setModalOpen: (e: Event) => void;
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
        <div class="text-[#1e1e1e] text-[19px] font-medium font-grotesque leading-[22.80px]">
          {props.eventType.charAt(0).toUpperCase() + props.eventType.slice(1)}{" "}
          Details
        </div>
        <button
          class="text-[#1e1e1e] text-base font-normal font-sf-pro leading-tight"
          onclick={props.setModalOpen}
        >
          Edit
        </button>
      </div>
    </div>
  );
}
