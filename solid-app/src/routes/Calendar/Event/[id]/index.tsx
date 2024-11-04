import { createAsync, useParams } from "@solidjs/router";
import {
  createResource,
  createSignal,
  For,
  Match,
  Show,
  Switch,
} from "solid-js";
import { getEvent, getEventParticipants } from "~/api/calendar";
import { FaSolidAngleDown } from "solid-icons/fa";
import { formatDateToLongForm } from "~/lib/formateDateLocal";
import BsQuestionCircleFill from "~/components/svg/BsQuestionCircleFill";
import IoCheckmarkCircle from "~/components/svg/IoCheckmarkCircle";
import FaSolidCircleXmark from "~/components/svg/FaSolidCircleXmark";
import EventDetailsTopNav from "~/components/calendar/calendar-detail-top-nav";
import FaSolidLocationDot from "~/components/icon/location-icon";
import placeholder from "./placeholder.png";
export default function EventPage() {
  const params = useParams();

  const event = createAsync(async () => await getEvent(parseInt(params.id)), {
    deferStream: true,
  });
  const [participants] = createResource(async () => {
    const response = await getEventParticipants(parseInt(params.id));
    return response;
  });

  const [isOpen, setIsOpen] = createSignal(false);

  const statusCount = {
    yes: 0,
    maybe: 0,
    no: 0,
    null: 0,
  };

  if (participants()) {
    for (const participant of participants()!) {
      const status = participant.status;
      if (status === "yes") {
        statusCount.yes++;
      } else if (status === "maybe") {
        statusCount.maybe++;
      } else if (status === "no") {
        statusCount.no++;
      } else {
        statusCount.null++;
      }
    }
  }

  return (
    <Show when={event()}>
      <EventDetailsTopNav />
      <div class="h-full flex flex-col p-4 justify-between">
        <div class="flex flex-col gap-3">
          <div class="flex flex-col gap-1 ">
            <h1 class="text-[#1e1e1e] text-[28px] font-grotesque font-medium leading-tight">
              {event()?.title}
            </h1>
            <div class="flex flex-col gap-0.5">
              <p class="text-[#1e1e1e]/50 text-base leading-tight font-sf-pro">
                {formatDateToLongForm(event()?.timeStart)}
              </p>
              <p class="text-[#1e1e1e]/50 text-base leading-tight font-sf-pro">
                From{" "}
                {event()?.timeStart?.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                <Show when={event()?.timeEnd}>
                  to{" "}
                  {event()?.timeEnd?.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Show>
              </p>
              <p class="text-[#7859ea] text-base leading-tight font-sf-pro">
                Repeats {event()?.repeat.charAt(0).toUpperCase()}
                {event()?.repeat.slice(1)}
              </p>
            </div>
          </div>
          <div class="flex flex-col space-y-4">
            <div class="flex items-center space-x-2">
              <FaSolidLocationDot />
              <div class="flex flex-col items-start">
                <p class="text-center text-[#1e1e1e] text-base font-sf-pro leading-tight">
                  {event()?.location}
                </p>
                <p class="text-center text-[#1e1e1e]/50 text-sm font-sf-pro leading-none">
                  1780 E Broadway, Vancouver, BC V5N 1W3
                </p>
              </div>
            </div>
            {/* temp */}
            <div class="flex items-center justify-center">
              <img
                class="max-h-96 max-w-96 rounded-lg border border-[#1e1e1e]/20"
                src={placeholder}
              />
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-5">
          <div class="flex flex-col space-y-3">
            <button
              class="flex justify-between items-center"
              onClick={() => setIsOpen(!isOpen())}
            >
              <div class="flex flex-col ">
                <div class="text-[#1e1e1e] text-left text-lg font-medium leading-7 font-grotesque">
                  {participants()?.length}{" "}
                  {participants()?.length === 1 ? "Person" : "People"}
                </div>
                <p class="text-[#1e1e1e]/50 text-sm leading-none font-sf-pro">
                  {statusCount.yes} yes, {statusCount.null} awaiting,{" "}
                  {statusCount.no} no, {statusCount.maybe} maybe
                </p>
              </div>
              <FaSolidAngleDown />
            </button>
            <Show when={isOpen()}>
              <div class="space-y-2">
                <For each={participants()}>
                  {(participant) => (
                    <div class="flex items-center space-x-2 ">
                      <div class="relative">
                        <Show
                          when={participant.participant.photo}
                          fallback={
                            <div class="w-10 h-10 bg-[#d9d9d9] rounded-full"></div>
                          }
                        >
                          <img
                            class="w-10 h-10 rounded-full"
                            src={participant.participant.photo!}
                            alt="temp alt"
                          />
                          <div class="absolute right-0 bottom-0 z-20">
                            <Switch>
                              <Match when={participant.status === "yes"}>
                                <IoCheckmarkCircle />
                              </Match>
                              <Match when={participant.status === "maybe"}>
                                <BsQuestionCircleFill />
                              </Match>
                              <Match when={participant.status === "no"}>
                                <FaSolidCircleXmark />
                              </Match>
                            </Switch>
                          </div>
                        </Show>
                      </div>
                      <div>
                        <div class="text-[#1e1e1e] text-lg font-medium font-grotesque">
                          {participant.participant.firstName}{" "}
                          {participant.participant.lastName}
                        </div>
                        <div class="text-[#1e1e1e]/50 text-sm font-sf-pro">
                          {participant.role}
                        </div>
                      </div>
                    </div>
                  )}
                </For>
              </div>
            </Show>
          </div>
          <div>
            <div class="flex flex-col space-y-1">
              <hr class="border-t border-[#1e1e1e]/20" />
              <h2 class="text-[#1e1e1e] text-lg font-medium">Notes</h2>
              <div class="bg-[#f9f9f9] rounded-md p-2 text-[#1e1e1e]/50 text-base leading-tight">
                {event()?.notes}
              </div>
            </div>
            <div class="flex justify-end space-x-4 bg-[#fcfcfc] border-t border-[#1e1e1e] p-3">
              {["Yes", "No", "Maybe"].map((response) => (
                <button class="bg-[#1e1e1e]/20 rounded-full px-4 py-2 text-[#1e1e1e] text-lg font-medium">
                  {response}
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* temp */}
        <div class="h-[60px]"></div>
      </div>
    </Show>
  );
}
