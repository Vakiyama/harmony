import { createAsync, useParams } from "@solidjs/router";
import { createSignal, For, Show } from "solid-js";
import { getEvent, getEventParticipants } from "~/api/calendar";
import { FaSolidAngleDown } from "solid-icons/fa";
import { formatDateToLongForm } from "~/lib/formateDateLocal";

export default function EventPage() {
  const params = useParams();

  const event = createAsync(async () => await getEvent(parseInt(params.id)), {
    deferStream: true,
  });
  const participants = createAsync(
    async () => await getEventParticipants(parseInt(params.id)),
    {
      deferStream: true,
    }
  );

  const [isOpen, setIsOpen] = createSignal(false);
  console.log(participants.latest);
  return (
    <Show when={event.latest}>
      <div class="h-full flex flex-col p-4 justify-between">
        <div class="flex flex-col gap-3">
          <div class="flex flex-col gap-1">
            <h1 class=" text-[#1e1e1e] text-2xl font-medium leading-tight">
              {event()?.title}
            </h1>
            <div class="flex flex-col gap-0.5">
              <p class="text-[#1e1e1e]/50 text-base leading-tight">
                {formatDateToLongForm(event()?.timeStart)}
              </p>
              <p class="text-[#1e1e1e]/50 text-base leading-tight">
                From{" "}
                {event()?.timeStart?.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                to{" "}
                {event()?.timeEnd?.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p class="text-[#1e1e1e]/50 text-base leading-tight">
                Repeats{" "}
                {/* {event()?.repeat.charAt(0).toUpperCase() +
                  event()?.repeat.slice(1)} */}
              </p>
            </div>
          </div>
          <div class="flex flex-col items-start">
            <p class="text-center text-[#1e1e1e]/50 text-base leading-tight">
              {event()?.location}
            </p>
            {/* <p class="text-center text-[#1e1e1e]/50 text-sm leading-none">
              1780 E Broadway, Vancouver, BC V5N 1W3
            </p> */}
          </div>
        </div>

        <div class="flex flex-col gap-5">
          <div class="flex flex-col space-y-3">
            <div class="flex justify-between items-center">
              <div class="flex flex-col ">
                <div class="text-[#1e1e1e] text-lg font-medium leading-7">
                  {participants()?.length}{" "}
                  {participants()?.length === 1 ? "Person" : "People"}
                </div>
                <p class="text-[#1e1e1e]/50 text-sm leading-none">
                  0 yes, 0 awaiting, 0 no, 0 maybe
                </p>
              </div>
              {/* temp */}
              <button onClick={() => setIsOpen(!isOpen())}>↓</button>
              {/* <FaSolidAngleDown /> */}
            </div>
            <Show when={isOpen()}>
              <div class="space-y-2">
                <For each={participants()}>
                  {(participant) => (
                    <div class="flex items-center space-x-2">
                      <Show
                        when={participant.participant.photo}
                        fallback={
                          <div class="w-10 h-10 bg-[#d9d9d9] rounded-full"></div>
                        }
                      >
                        <img
                          class="w-10 h-10 rounded-full"
                          src={participant.participant.photo ?? "temp"}
                          alt="temp alt"
                        />
                      </Show>

                      <div>
                        <div class="text-[#1e1e1e] text-lg font-medium">
                          {participant.participant.firstName}{" "}
                          {participant.participant.lastName}
                        </div>
                        <div class="text-[#1e1e1e]/50 text-sm">
                          {participant.role}
                        </div>
                      </div>
                    </div>
                  )}
                </For>
              </div>
            </Show>
          </div>

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
    </Show>
  );
}
