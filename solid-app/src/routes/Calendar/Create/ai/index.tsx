import { createEffect, createMemo, createSignal, onMount } from "solid-js";
import { Button } from "~/components/ui/button";

import { twMerge } from "tailwind-merge";
import SelectInput from "~/components/shadcn/Select";
import { createEvent, getTeamMembersFromTeamId } from "~/api/calendar";
import { createAsync, useNavigate } from "@solidjs/router";
import type { TeamMember } from "@/schema/TeamMembers";
import { User } from "@/schema/Users";
import { mightFail } from "might-fail";
import { isValidEnumValue } from "~/api/dbHelper";
import moment from "moment";
import TextInput from "../TextInput";
import TimeDateCalendar from "../TimeDateCalendar";
import TextArea from "../TextAreaInput";
import { TextField } from "@kobalte/core/text-field";

const CalendarCreateEvent = () => {
  const navigate = useNavigate();
  const teamMembers = createAsync(
    // temp get teamId first
    async () => await getTeamMembersFromTeamId(1),
    { deferStream: true }
  );

  const [eventType, setEventType] = createSignal<"event" | "task">("event");
  const [title, setTitle] = createSignal("Doctors appointment");

  const [location, setLocation] = createSignal("555 Seymour St Vancouver");
  const [teamMemberIds, setTeamMemberIds] = createSignal<number[]>([1]);
  const [startDate, setStartDate] = createSignal("");
  const [startTime, setStartTime] = createSignal("10:30");
  const [endDate, setEndDate] = createSignal("");
  const [endTime, setEndTime] = createSignal("10:50");

  onMount(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const formattedDate = tomorrow.toISOString().split("T")[0]; // YYYY-MM-DD format

    setStartDate(formattedDate);
    setEndDate(formattedDate);
  });
  const timeEnd = () => new Date(`${endDate()}T${endTime()}`);
  const timeStart = () => new Date(`${startDate()}T${startTime()}`);
  const [repeat, setRepeat] = createSignal<
    "never" | "daily" | "weekly" | "monthly"
  >("never");

  const parseTeamMemberToOption = (
    data: { teammembers: TeamMember; users: User }[] | undefined
  ) =>
    data
      ? data.map((data) => {
          return {
            value: data.teammembers.userId,
            label: data.users.displayName,
          };
        })
      : [];

  const teamMemberOptions = createMemo(() =>
    parseTeamMemberToOption(teamMembers())
  );

  async function createEventHandler(e: Event) {
    e.preventDefault();

    const [createEventError, createEventResult] = await mightFail(
      createEvent(
        {
          calendarId: 1,
          location: location(),
          title: title(),
          notes: "ask the doctor to renew her medications.",
          repeat: repeat(),
          type: eventType(),
          timeEnd: timeEnd(),
          timeStart: timeStart(),
        },
        teamMemberIds()
      )
    );
    if (createEventError) {
      return console.error(createEventError);
    }
    navigate("/calendar");
  }
  return (
    <div class="flex flex-col items-center mt-10 w-full">
      <form class="space-y-4 max-w-lg w-full px-4">
        <div class="flex gap-4 justify-between">
          <Button
            class={twMerge(
              "px-20",
              eventType() === "event" ? "bg-purple-200 hover:bg-purple-300" : ""
            )}
            variant="outline"
            onClick={() => setEventType("event")}
          >
            Event
          </Button>
          <Button
            class={twMerge(
              "px-20",
              eventType() === "task" ? "bg-purple-200 hover:bg-purple-300" : ""
            )}
            variant="outline"
            onClick={() => setEventType("task")}
          >
            Task
          </Button>
        </div>
        <TextInput
          label="Title"
          placeholder="Title"
          value={title}
          setValue={setTitle}
        />
        <TextInput
          label="Location"
          placeholder="Location"
          setValue={setLocation}
          value={location}
        />
        <p class="text-lg font-semibold">Time</p>
        <div class="flex justify-between items-center ">
          <p>Start Time</p>
          <input
            class="border px-5 py-3 rounded-lg focus:bg-purple-200 focus:border-none focus:outline-none !select-none"
            type="date"
            value={startDate()}
            onInput={(e) => setStartDate(e.target.value)}
          />
          <input
            class="border px-2 py-3 rounded-lg focus:bg-purple-200 focus:border-none focus:outline-none !select-none"
            type="time"
            value={startTime()}
            onInput={(e) => setStartTime(e.target.value)}
          />
        </div>
        <div class="flex justify-between items-center ">
          <p>End Time</p>
          <input
            class="border px-5 py-3 rounded-lg focus:bg-purple-200 focus:border-none focus:outline-none !select-none"
            type="date"
            value={endDate()}
            onInput={(e) => setEndDate(e.target.value)}
          />
          <input
            class="border px-2 py-3 rounded-lg focus:bg-purple-200 focus:border-none focus:outline-none !select-none"
            type="time"
            value={endTime()}
            onInput={(e) => setEndTime(e.target.value)}
          />
        </div>
        <p class="text-lg font-semibold">Repeat</p>
        <SelectInput
          class="w-full p-1 rounded-lg py-6 ps-4 "
          placeholder="Never"
          options={
            [
              { value: "never", label: "Never" },
              { value: "daily", label: "Daily" },
              { value: "weekly", label: "Weekly" },
              { value: "monthly", label: "Monthly" },
            ] as const
          }
          setSelectedOption={setRepeat}
        />
        <p class="text-lg font-semibold">Invitee</p>
        <SelectInput
          class="w-full p-1 rounded-lg py-6 ps-4 "
          placeholder="Tina"
          options={
            [
              { value: "never", label: "Never" },
              { value: "daily", label: "Daily" },
              { value: "weekly", label: "Weekly" },
              { value: "monthly", label: "Monthly" },
            ] as const
          }
          setSelectedOption={setRepeat}
        />

        <TextField class="flex flex-col ">
          <TextField.Label class="text-lg font-semibold">Notes</TextField.Label>
          <TextField.TextArea
            placeholder="ask the doctor to renew her medications."
            value="ask the doctor to renew her medications."
            class="border p-1 rounded-lg ps-4 h-40 text-black"
          />
        </TextField>
        <div class="flex justify-end w-full">
          <button
            class="border p-2 rounded-lg"
            type="submit"
            onClick={createEventHandler}
          >
            Create
          </button>
        </div>
      </form>
      {/* temp */}
      <div class="h-[88px]"></div>
    </div>
  );
};

export default CalendarCreateEvent;
