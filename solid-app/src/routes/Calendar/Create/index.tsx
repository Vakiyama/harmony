import { createMemo, createSignal } from "solid-js";
import { Button } from "~/components/ui/button";
import TextInput from "./TextInput";
import TextArea from "./TextAreaInput";
import { twMerge } from "tailwind-merge";
import TimeDateCalendar from "./TimeDateCalendar";
import SelectInput from "~/components/shadcn/Select";
import { createEvent, getTeamMembersFromTeamId } from "~/api/calendar";
import { createAsync, redirect, useNavigate } from "@solidjs/router";
import { TeamMember } from "@/schema/TeamMembers";
import { User } from "@/schema/Users";
import { mightFail } from "might-fail";

const CalendarCreateEvent = () => {
  const teamMembers = createAsync(
    // get teamId first
    async () => await getTeamMembersFromTeamId(1),
    { deferStream: true }
  );
  const [eventType, setEventType] = createSignal<"event" | "task">("event");
  const [title, setTitle] = createSignal("");
  const [notes, setNotes] = createSignal("");
  const [location, setLocation] = createSignal("");
  const [teamMemberId, setTeamMemberId] = createSignal<number | undefined>(
    undefined
  );
  const [timeStartDate, setTimeStartDate] = createSignal<string | undefined>(
    undefined
  );
  const [timeStartTime, setTimeStartTime] = createSignal("");
  const [timeEndDate, setTimeEndDate] = createSignal<string | undefined>(
    undefined
  );
  const [timeEndTime, setTimeEndTime] = createSignal("");
  const timeEnd = () => new Date(`${timeEndDate()}T${timeEndTime()}`);
  const timeStart = () => new Date(`${timeStartDate()}T${timeStartTime()}`);
  const [repeat, setRepeat] = createSignal<
    "never" | "daily" | "weekly" | "monthly"
  >("never");
  const navigate = useNavigate();
  const parseTeamMemberToOption = (
    data: { teammembers: TeamMember; users: User }[] | undefined
  ) =>
    data
      ? data.map((data) => {
          return {
            value: data.teammembers.id,
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
      createEvent({
        calendarId: 1,
        location: location(),
        title: title(),
        notes: notes(),
        repeat: repeat(),
        type: eventType(),
        timeEnd: timeEnd(),
        timeStart: timeStart(),
      })
    );
    if (createEventError) {
      return console.error(createEventError);
    }
    navigate("/calendar");
  }
  return (
    <div class="flex flex-col items-center mt-10 w-full">
      <form class="space-y-4 max-w-lg w-full">
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
        <p class="text-lg font-semibold">Invitee</p>
        <SelectInput
          class="w-full p-1 rounded-lg py-6 ps-4 "
          placeholder="Person"
          options={teamMemberOptions()}
          setSelectedOption={setTeamMemberId}
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
    </div>
  );
};

export default CalendarCreateEvent;
