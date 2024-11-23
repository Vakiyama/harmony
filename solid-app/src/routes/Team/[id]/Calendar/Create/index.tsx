import { createEffect, createMemo, createSignal } from "solid-js";
import { Button } from "~/components/ui/button";
import TextInput from "./TextInput";
import TextArea from "./TextAreaInput";
import { twMerge } from "tailwind-merge";
import TimeDateCalendar from "./TimeDateCalendar";
import SelectInput from "~/components/shadcn/Select";
import {
  createEvent,
  getCalendarFromTeamId,
  getTeamMembersFromTeamId,
} from "~/api/calendar";
import { createAsync, useNavigate, useParams } from "@solidjs/router";
import type { TeamMember } from "@/schema/TeamMembers";
import { User } from "@/schema/Users";
import { mightFail } from "might-fail";
import SelectMultipleInput from "~/components/shadcn/MultiSelect";
import ShowError from "~/routes/Team/[id]/journal/show-error";
import EventCreateTopNav from "~/components/calendar/calendar-create-top-nav";
import { getTeamFromTeamId } from "~/api/team";
import { formatTimeForPicker } from "~/lib/formateDateLocal";

const getFormattedDate = (): string => new Date().toISOString().split("T")[0];

const CalendarCreateEvent = () => {
  const navigate = useNavigate();
  const params = useParams();
  const teamId = parseInt(params.id);
  const teamMembers = createAsync(
    async () => await getTeamMembersFromTeamId(teamId),
    { deferStream: true }
  );
  const placeholderTime = formatTimeForPicker(new Date(Date.now()));
  const placeholderTimeOneHour = formatTimeForPicker(
    new Date(Date.now() + 1000 * 60 * 60)
  );
  const team = createAsync(async () => await getTeamFromTeamId(teamId));
  const [eventType, setEventType] = createSignal<"event" | "task">("event");
  const [title, setTitle] = createSignal("");
  const [notes, setNotes] = createSignal("");
  const [location, setLocation] = createSignal("");
  const [teamMemberIds, setTeamMemberIds] = createSignal<number[]>([]);
  const [timeStartDate, setTimeStartDate] = createSignal<string | undefined>(
    getFormattedDate()
  );
  const [timeStartTime, setTimeStartTime] = createSignal<string>(
    placeholderTime as string
  );
  const [timeEndDate, setTimeEndDate] = createSignal<string | undefined>(
    getFormattedDate()
  );
  const [timeEndTime, setTimeEndTime] = createSignal<string>(
    placeholderTimeOneHour as string
  );
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
    if (!title() || title().trim() === "") {
      return setError("Title is required.");
    }
    if (!timeStartTime() || !timeStartDate) {
      return setError("Start time is required.");
    }
    if (!timeEndTime() || !timeEndDate) {
      return setError("End time is required.");
    }
    if (timeEnd() <= timeStart()) {
      return setError("End time must be after start time.");
    }

    const calendar = await getCalendarFromTeamId(teamId);

    const [createEventError, createEventResult] = await mightFail(
      createEvent(
        {
          calendarId: calendar.id,
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
    navigate(`/team/${teamId}/calendar`);
  }
  return (
    <>
      <EventCreateTopNav
        teamId={teamId}
        handleCreate={createEventHandler}
        name={team()?.data.recipients?.firstName}
      />
      <div class="flex flex-col items-center mt-3 w-full">
        <form class="space-y-4 max-w-lg w-full px-4">
          <ShowError error={error()}></ShowError>
          <div class="flex gap-4 justify-between">
            <Button
              class={twMerge(
                "w-[177px] h-[40px]",
                eventType() === "event"
                  ? "bg-purple-200 hover:bg-purple-300"
                  : ""
              )}
              variant="outline"
              onClick={() => setEventType("event")}
            >
              Event
            </Button>
            <Button
              class={twMerge(
                "px-20",
                eventType() === "task"
                  ? "bg-purple-200 hover:bg-purple-300"
                  : ""
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
        </form>
      </div>
    </>
  );
};

export default CalendarCreateEvent;
