import { createEffect, createMemo, createSignal, Show } from "solid-js";
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
import { getTeamFromTeamId } from "~/api/team";
import { formatTimeForPicker } from "~/lib/formateDateLocal";
import { showNotification } from "~/routes/api/notificationStore";
import TopNav from "~/components/shared/TopNav";

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
    showNotification(`${eventType() === "event" ? "Event" : "Task"} Created`);
    navigate(`/team/${teamId}/calendar`);
  }
  return (
    <>
      <Show when={team()}>
        <TopNav
          name={
            team()?.data.recipients
              ? `${team()?.data.recipients?.firstName}'s Care Team`
              : ""
          }
          leftNavigation="Calendar"
        />
      </Show>
      <div class="relative top-[95px] flex flex-col items-center w-full h-full overflow-y-auto px-3">
        <form class="space-y-[18px] max-w-lg w-full h-[100%]">
          <ShowError error={error()}></ShowError>
          <div class="flex gap-3 justify-between mt-3">
            <Button
              class={twMerge(
                "w-1/2 h-12",
                eventType() === "event"
                  ? "bg-purple-200 hover:bg-purple-300"
                  : ""
              )}
              variant="outline"
              onClick={() => setEventType("event")}
            >
              <p class="font-medium leading-[120%] font-sf-pro text-base selected:font-weight-[590px]">
                Event
              </p>
            </Button>
            <Button
              class={twMerge(
                "w-1/2 h-12",
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
          <div class="flex flex-col">
            <p class="text-lg font-semibold">Time</p>
            <div class="flex flex-col gap-3">
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
            </div>
          </div>
          <div class="flex flex-col">
            <p class="text-lg font-semibold">Repeat</p>
            <SelectInput
              class="w-full rounded-lg"
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
          </div>
          <div class="flex flex-col">
            <p class="text-lg font-semibold">Person</p>

            <SelectMultipleInput
              class="w-full p-1 rounded-lg py-6 ps-4 "
              placeholder="Person"
              options={teamMemberOptions()}
              setSelectedOptions={setTeamMemberIds}
            />
          </div>
          <TextArea
            label="Notes"
            placeholder="Notes"
            value={notes}
            setValue={setNotes}
            class="h-28"
          />
          <Button
            class="rounded-[100px] h-12 w-full bg-primary-purple-300 text-black"
            variant="default"
            onClick={createEventHandler}
          >
            Create
          </Button>
        </form>
      </div>
    </>
  );
};

export default CalendarCreateEvent;
