import { Event } from "@/schema/Events";
import { useNavigate } from "@solidjs/router";
import { formatDateToLocaleString } from "~/lib/formateDateLocal";

const EventCard = (props: { event: Event }) => {
  const navigate = useNavigate();

  return (
    <div
      class="h-12 pl-1 pr-2 py-1 bg-[#e0e0e0] rounded-md justify-start items-center gap-1.5 inline-flex"
      onClick={() => {
        navigate(`/calendar/event/${props.event.id}`);
      }}
    >
      <div class="w-0.5 h-10 bg-[#1e1e1e]/75 rounded-[20px]" />
      <div class="grow shrink basis-0 h-7 justify-between items-center flex">
        <div class="grow shrink basis-0 h-7 flex-col justify-between items-start inline-flex">
          <div class="self-stretch h-3 text-[#1e1e1e]/75 text-base font-['SF Pro'] leading-tight">
            {props.event.title}
          </div>
          {/* <For each={props.members}>
            {(member) => (
              <div class="self-stretch h-[9px] text-[#1e1e1e]/50 text-[13px] font-normal font-['SF Pro'] leading-none">
                {member.id}
              </div>
            )}
          </For> */}
        </div>
        <div class="w-[123px] h-7 flex-col justify-between items-end inline-flex">
          <div class="self-stretch h-2.5 text-right text-[#1e1e1e]/75 text-[13px] font-normal font-['SF Pro'] uppercase leading-none">
            {formatDateToLocaleString(props.event.timeStart)}
          </div>
          <div class="self-stretch h-3 text-right text-[#1e1e1e]/75 text-[13px] font-normal font-['SF Pro'] uppercase leading-none">
            {formatDateToLocaleString(props.event.timeEnd)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
