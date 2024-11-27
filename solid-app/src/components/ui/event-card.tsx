import { Event } from "@/schema/Events";
import { useNavigate } from "@solidjs/router";
import moment from "moment";
import { FaRegularCircleCheck } from "solid-icons/fa";
import { createResource, For, JSX, Match, Show, Switch } from "solid-js";
import { twMerge } from "tailwind-merge";
import { getEventParticipants } from "~/api/calendar";
import { CalendarJournalType } from "~/routes/Team/[id]/Calendar";
import CgPillIcon from "../icon/cg-pill";
import CgSmileIcon from "../icon/cg-smile";
import LoNutritionIcon from "../icon/lo-nutrition";
import LoSleepIcon from "../icon/lo-sleep";
import LoNotesIcon from "../icon/lo-notes";

const EventCard = (props: {
  event: Event | CalendarJournalType;
  class?: string;
  style?: JSX.CSSProperties;
  teamId: number;
}) => {
  const navigate = useNavigate();
  const [response] = createResource(async () => {
    const response = await getEventParticipants(props.event.id, props.teamId);
    return response ?? [];
  });
  const getEventBackground = (event: Event | CalendarJournalType) => {
    switch (event.type) {
      case "task":
        return "bg-[#e2f4dc]";
      case "medication":
        return "bg-[#FFE3DE]";
      case "event":
        return "bg-[#f1eefc]";
      case "mood":
        return "bg-[#FFE6EF]";
      case "meal":
        return "bg-[#E2F4DC]";
      case "note":
        return "bg-[#FDF3C7]";
      case "sleep":
        return "bg-[#D1D8E8]";
    }
  };

  const getEventIcon = (event: Event | CalendarJournalType) => {
    switch (event.type) {
      case "task":
        return (
          <FaRegularCircleCheck class="text-lg ml-0.5 text-[#6FC94F] self-center" />
        );
      case "medication":
        return <CgPillIcon class="text-lg ml-0.5 self-center" />;
      case "event":
        return (
          <div
            class="w-0.5 bg-[#7859ea] rounded-[20px] absolute left-1.5"
            style={{ height: "calc(100% - 15px)" }}
          />
        );
      case "mood":
        return <CgSmileIcon class="text-lg ml-0.5 self-center" />;
      case "meal":
        return <LoNutritionIcon class="text-lg ml-0.5 self-center" />;
      case "note":
        return <LoNotesIcon class="text-lg ml-0.5 self-center" />;
      case "sleep":
        return <LoSleepIcon class="text-lg ml-0.5 self-center" />;
    }
  };

  const concatString = (title: string, length: number) => {
    if (title) {
      return title.length > length
        ? title.slice(0, length).concat("...")
        : title;
    }
  };

  return (
    <>
      <div
        class={twMerge(
          `relative self-stretch h-12 pl-1 pr-2 py-1 ${getEventBackground(
            props.event
          )} rounded-md justify-start items-center gap-1.5 inline-flex`,
          props?.class
        )}
        style={props.style || {}}
        onClick={() => {
          if (props.event.type === "task" || props.event.type === "event")
            navigate(`/team/${props.teamId}/calendar/event/${props.event.id}`);
        }}
      >
        {getEventIcon(props.event)}
        <div
          class={`grow shrink basis-0 h-7 justify-between items-center flex `}
        >
          <div class="grow shrink relative basis-0 h-8 flex-col justify-between items-start inline-flex">
            <div class="self-stretch h-[16px] text-[#1e1e1e]/75 text-base font-sf-pro leading-tight">
              {concatString(props.event.title, 23)}
            </div>
            <div class="flex space-x-1 justify-self-center">
              <Switch
                fallback={
                  <div class="self-stretch h-[13px] text-[#1e1e1e]/50 text-[13px] font-normal font-sf-pro leading-none">
                    {concatString(props.event.notes, 30)}
                  </div>
                }
              >
                <Match when={props.event.type === "event"}>
                  <For each={response()}>
                    {(data, i) => (
                      <Show when={data.status === "yes"}>
                        <div class="self-stretch h-[13px] text-[#1e1e1e]/50 text-[13px] font-normal font-sf-pro leading-none">
                          {data.participant.firstName}{" "}
                          {data.participant.lastName}
                          <Show when={response()!.length > 1}>
                            {i() === response.length ? "," : ""}
                          </Show>
                        </div>
                      </Show>
                    )}
                  </For>
                </Match>
              </Switch>
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
