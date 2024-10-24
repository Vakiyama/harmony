import { createAsync, useParams } from "@solidjs/router";
import { onMount, Show } from "solid-js";
import { getEvent } from "~/api/calendar";

export default function EventPage() {
  const params = useParams();

  const event = createAsync(async () => await getEvent(parseInt(params.id)), {
    deferStream: true,
  });

  return (
    <Show when={event.latest}>
      <div class="relative p-4 space-y-4">
        <div class="flex flex-col gap-3">
          <div class="flex flex-col gap-1">
            <h1 class=" text-[#1e1e1e] text-2xl font-medium leading-tight">
              {event.latest?.title}
            </h1>
            <div class="flex flex-col gap-0.5">
              <p class="text-[#1e1e1e]/50 text-base leading-tight">
                {event.latest?.notes}
              </p>
              <p class="text-[#1e1e1e]/50 text-base leading-tight">
                From{" "}
                {event.latest?.timeStart?.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                to{" "}
                {event.latest?.timeEnd?.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p class="text-[#1e1e1e]/50 text-base leading-tight">
                Repeats{" "}
                {/* {event.latest?.repeat.charAt(0).toUpperCase() +
                  event.latest?.repeat.slice(1)} */}
              </p>
            </div>
          </div>
          <div class="flex flex-col items-start">
            <p class="text-center text-[#1e1e1e]/50 text-base leading-tight">
              {event.latest?.location}
            </p>
            {/* <p class="text-center text-[#1e1e1e]/50 text-sm leading-none">
              1780 E Broadway, Vancouver, BC V5N 1W3
            </p> */}
          </div>
        </div>

        <div class="flex flex-col gap-5">
          <div class="flex flex-col space-y-3">
            <div class="flex justify-between items-center">
              <div class="text-[#1e1e1e] text-lg font-medium leading-7">
                00 People
              </div>
              <p class="text-[#1e1e1e]/50 text-sm leading-none">
                0 yes, 0 awaiting, 0 no, 0 maybe
              </p>
            </div>
            <div class="space-y-2">
              {["Tina Duong", "Max Li", "Annabelle Chen", "Keona Aguilar"].map(
                (name, index) => (
                  <div class="flex items-center space-x-2">
                    <div class="w-10 h-10 bg-[#d9d9d9] rounded-full"></div>
                    <div>
                      <div class="text-[#1e1e1e] text-lg font-medium">
                        {name}
                      </div>
                      <div class="text-[#1e1e1e]/50 text-sm">
                        Relation {index + 1}
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          <div class="flex flex-col space-y-1">
            <hr class="border-t border-[#1e1e1e]/20" />
            <h2 class="text-[#1e1e1e] text-lg font-medium">Notes</h2>
            <div class="bg-[#f9f9f9] rounded-md p-2 text-[#1e1e1e]/50 text-base leading-tight">
              Tina, please don't say that. It's important to remember that you
              are not alone, and that there is help available. You deserve to be
              here, and your life has value.
            </div>
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
    </Show>
  );
}
