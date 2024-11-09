import { createEffect, createMemo, createSignal } from "solid-js";
import { Button } from "~/components/ui/button";
import TextInput from "./TextInput";
import TextArea from "./TextAreaInput";
import { twMerge } from "tailwind-merge";
import TimeDateCalendar from "./TimeDateCalendar";
import SelectInput from "~/components/shadcn/Select";
import { createEvent, getTeamMembersFromTeamId } from "~/api/calendar";
import { createAsync, useNavigate } from "@solidjs/router";
import type { TeamMember } from "@/schema/TeamMembers";
import { User } from "@/schema/Users";
import { mightFail } from "might-fail";
import { isValidEnumValue } from "~/api/dbHelper";
import SelectMultipleInput from "~/components/shadcn/MultiSelect";
import ShowError from "~/routes/Team/[id]/journal/show-error";

const CalendarCreateEvent = () => {
  const navigate = useNavigate();
  const teamMembers = createAsync(
    // temp get teamId first
    async () => await getTeamMembersFromTeamId(1),
    { deferStream: true }
  );
  const [eventType, setEventType] = createSignal<"event" | "task">("event");
  const [title, setTitle] = createSignal("");
  const [notes, setNotes] = createSignal("");
  const [location, setLocation] = createSignal("");
  const [teamMemberIds, setTeamMemberIds] = createSignal<number[]>([]);
  const [timeStartDate, setTimeStartDate] = createSignal<string | undefined>();
  const [timeStartTime, setTimeStartTime] = createSignal("");
  const [timeEndDate, setTimeEndDate] = createSignal<string | undefined>();
  const [timeEndTime, setTimeEndTime] = createSignal("");
  const timeEnd = () => new Date(`${timeEndDate()}T${timeEndTime()}`);
  const timeStart = () => new Date(`${timeStartDate()}T${timeStartTime()}`);
  const [repeat, setRepeat] = createSignal<
    "never" | "daily" | "weekly" | "monthly"
  >("never");
  const [error, setError] = createSignal("");
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
    // temp
    if (!title() || title().trim() === "") {
      return setError("Title is required.");
    }
    if (!timeStartTime() || !timeStartDate) {
      return setError("Start time is required.");
    }
    if (!timeEndTime() || !timeEndDate) {
      return setError("End time is required.");
    }
    // if (isValidEnumValue(repeat(), eventsFrequencyEnum)) {
    //   return alert("Valid repeat frequency is required.";
    // }
    // if (isValidEnumValue(eventType(), eventsTypeEnum)) {
    //   return alert("Valid event type is required.";
    // }
    if (timeEnd() <= timeStart()) {
      return setError("End time must be after start time.");
    }

    const [createEventError, createEventResult] = await mightFail(
      createEvent(
        {
          calendarId: 1,
          location: location(),
          title: title(),
          notes: notes(),
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
        <ShowError error={error()}></ShowError>
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
        <TimeDateCalendar
          label="Start Time"
          date={timeStartDate}
          setDate={setTimeStartDate}
          time={timeStartTime}
          setTime={setTimeStartTime}
        />
        <TimeDateCalendar
          label="End Time"
          date={timeEndDate}
          setDate={setTimeEndDate}
          time={timeEndTime}
          setTime={setTimeEndTime}
        />
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
        <p class="text-lg font-semibold">Person</p>

        <SelectMultipleInput
          class="w-full p-1 rounded-lg py-6 ps-4 "
          placeholder="Person"
          options={teamMemberOptions()}
          setSelectedOptions={setTeamMemberIds}
        />
        <TextArea
          label="Notes"
          placeholder="Notes"
          value={notes}
          setValue={setNotes}
        />
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
