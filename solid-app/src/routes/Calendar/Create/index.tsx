import { createEffect, createSignal } from "solid-js";
import { Button } from "~/components/ui/button";
import TextInput from "./TextInput";
import TextArea from "./TextAreaInput";
import { twMerge } from "tailwind-merge";
import { DatePicker } from "~/components/ui/date-picker";
import TimeDateCalendar from "./TimeDateCalendar";

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
  createEffect(
    () => console.log(timeStart(), timeEnd()),
    [timeStart(), timeEnd()]
  );

  return (
    <div class="flex flex-col items-center mt-10">
      <form class="space-y-4 max-w-xl">
        <div class="flex w-full gap-4">
          <Button
            class={twMerge(
              "px-16",
              eventType() === "event" ? "bg-purple-200 hover:bg-purple-300" : ""
            )}
            variant="outline"
            onClick={() => setEventType("event")}
          >
            Event
          </Button>
          <Button
            class={twMerge(
              "px-16",
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
        <TextInput
          label="Location"
          placeholder="location"
          setValue={setLocation}
          value={location}
        />
        <TextArea
          label="Notes"
          placeholder="notes"
          value={note}
          setValue={setNote}
        />
        <input type="datetime-local" name="" id="" />
      </form>
    </div>
  );
};

export default UpdateModal;
