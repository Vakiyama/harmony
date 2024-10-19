import { createEffect, createSignal } from "solid-js";
import { Button } from "~/components/ui/button";
import TextInput from "./TextInput";
import TextArea from "./TextAreaInput";
import { twMerge } from "tailwind-merge";
import TimeDateCalendar from "./TimeDateCalendar";
import SelectInput from "~/components/shadcn/Select";

const UpdateModal = () => {
  const [eventType, setEventType] = createSignal<"event" | "task">("event");
  const [title, setTitle] = createSignal("");
  const [note, setNote] = createSignal("");
  const [location, setLocation] = createSignal("");
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
          placeholder="title"
          value={title}
          setValue={setTitle}
        />
        <TextInput
          label="Location"
          placeholder="location"
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
          class="w-full "
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
        <TextArea
          label="Notes"
          placeholder="notes"
          value={note}
          setValue={setNote}
        />
      </form>
    </div>
  );
};

export default UpdateModal;
