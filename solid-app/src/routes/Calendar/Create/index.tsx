import { createSignal } from "solid-js";
import { Button } from "~/components/ui/button";
import TextInput from "./TextInput";
import TextArea from "./TextAreaInput";
import { twMerge } from "tailwind-merge";
import TimeDateCalendar from "./TimeDateCalendar";
import SelectInput from "~/components/shadcn/Select";
import { getTeamMembersFromTeamId } from "~/api/calendar";
import { createAsync } from "@solidjs/router";
import { TeamMember } from "@/schema/TeamMembers";
import { User } from "@/schema/Users";

const CalendarCreateEvent = () => {
  const teamMembers = createAsync(
    async () => await getTeamMembersFromTeamId(2),
    { deferStream: true }
  );
  const [eventType, setEventType] = createSignal<"event" | "task">("event");
  const [title, setTitle] = createSignal("");
  const [note, setNote] = createSignal("");
  const [location, setLocation] = createSignal("");
  const [teamMember, setTeamMember] = createSignal<string | undefined>(
    undefined
  );
  const [timeStartDate, setTimeStartDate] = createSignal(
    new Date().toISOString()
  );
  const [timeStartTime, setTimeStartTime] = createSignal("");
  const [timeEndDate, setTimeEndDate] = createSignal(new Date().toISOString());
  const [timeEndTime, setTimeEndTime] = createSignal("");
  const timeEnd = () => `${timeEndDate()}T${timeEndTime()}`;
  const timeStart = () => `${timeStartDate()}T${timeStartTime()}`;
  const [repeat, setRepeat] = createSignal<
    "never" | "daily" | "weekly" | "monthly"
  >("never");

  function parseTeamMemberToOption(
    data:
      | {
          teammembers: TeamMember;
          users: User;
        }[]
      | undefined
  ) {
    if (!data) {
      return [];
    }
    return data.map((data) => {
      return {
        value: data.teammembers.id.toString(),
        label: data.users.displayName,
      };
    });
  }
  const teamMemberOptions = parseTeamMemberToOption(teamMembers());
  return (
    <div class="flex flex-col items-center mt-10 w-full">
      <form class="space-y-4 max-w-lg w-full">
        <div class="flex gap-4 justify-center">
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
        <p class="text-lg font-semibold">Assigned to</p>
        <SelectInput
          class="w-full p-1 rounded-lg py-6 ps-4 "
          placeholder="Person"
          options={teamMemberOptions}
          setSelectedOption={setTeamMember}
        />
        <TextArea
          label="Notes"
          placeholder="Notes"
          value={note}
          setValue={setNote}
        />
      </form>
    </div>
  );
};

export default CalendarCreateEvent;
