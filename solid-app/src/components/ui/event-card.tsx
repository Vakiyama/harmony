import { Event } from "@/schema/Events";
import { useNavigate } from "@solidjs/router";
import moment from "moment";
import { FaRegularCircleCheck } from "solid-icons/fa";
import { createResource, For, Show } from "solid-js";
import { getEventParticipants } from "~/api/calendar";

const EventCard = (props: { event: Event }) => {
  // temp
  const teamId = 1;
  const navigate = useNavigate();
  const [response] = createResource(async () => {
    const response = await getEventParticipants(props.event.id, teamId);
    return response ?? [];
  });

  const getEventBackground = (event: Event) => {
    if (event.type === "task") {
      return "bg-[#e2f4dc]";
    }
    return "bg-[#f1eefc]";
  };

  const concatTitle = (title: string) => {
    return title.length > 23 ? title.slice(0, 23).concat("...") : title;
  };
  return (
    <>
      <div
        class={`relative self-stretch h-12 pl-1 pr-2 py-1 ${getEventBackground(
          props.event
        )} rounded-md justify-start items-center gap-1.5 inline-flex`}
        onClick={() => {
          navigate(`/calendar/event/${props.event.id}`);
        }}
      >
        {props.event.type === "event" ? (
          <div class="w-0.5 h-10 bg-[#7859ea] rounded-[20px]" />
        ) : (
          <FaRegularCircleCheck class="text-lg ml-0.5 text-[#6FC94F]" />
        )}
        <div class="grow shrink basis-0 h-7 justify-between items-center flex">
          <div class="grow shrink relative basis-0 h-7 flex-col justify-between items-start inline-flex">
            <div class="self-stretch h-3 text-[#1e1e1e]/75 text-base font-sf-pro leading-tight">
              {concatTitle(props.event.title)}
            </div>
            <div class="flex space-x-1">
              <For each={response()}>
                {(data, i) => (
                  <Show when={data.status !== "yes"}>
                    <div class="self-stretch h-[9px] text-[#1e1e1e]/50 text-[13px] font-normal font-sf-pro leading-none">
                      {data.participant.firstName} {data.participant.lastName}
                      <Show when={response()!.length > 1}>
                        {i() === response.length ? "," : ""}
                      </Show>
                    </div>
                  </Show>
                )}
              </For>
            </div>
          </div>
          <div class="w-[123px] h-7 flex-col justify-between absolute right-2 items-end inline-flex">
            <div class="self-stretch h-2.5 text-right text-[#1e1e1e]/50 text-[13px] font-normal font-sf-pro uppercase leading-none">
              {moment(props.event.timeStart).format("h:mm A")}
            </div>
            {props.event.timeEnd && (
              <div class="self-stretch h-3 text-right text-[#1e1e1e]/50 text-[13px] font-normal font-sf-pro uppercase leading-none">
                {moment(props.event.timeEnd).format("h:mm A")}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EventCard;
