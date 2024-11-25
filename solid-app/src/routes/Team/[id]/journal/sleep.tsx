import RadioGroupComponent from "~/components/shadcn/RadioGroup";
import DatePickerComponent from "~/components/shadcn/DatePicker";
import {
  createSleepAction,
  deleteSleepAction,
  getSleepById,
  updateSleepAction,
} from "~/api/journal";
import {
  createAsync,
  useAction,
  useLocation,
  useNavigate,
  useParams,
} from "@solidjs/router";
import { createMemo, createSignal, Show } from "solid-js";
import ShowError from "~/routes/Team/[id]/journal/show-error";
import { Button } from "~/components/ui/button";
import AddNote from "~/routes/Team/[id]/journal/add-notes";
import Header from "./header";
import { Slider } from "~/components/ui/slider";
import { showNotification } from "~/routes/api/notificationStore";
import SleepIcon from "~/components/icon/sleep-icon";
import { getRecipientName } from "~/api/team";
import {
  qualityEnum,
  SleepWithNoteUser,
} from "../../../../../drizzle/schema/Sleeps";
import DeleteConfirmation from "~/components/shared/delete-confirmation";
import TimePicker from "~/components/ui/time-picker";

export default function SleepTracker() {
  const params = useParams();
  const location = useLocation();
  const existingEntry = location.search.split("?edit=")[1];
  const [formRef, setFormRef] = createSignal<HTMLFormElement | undefined>();
  const [error, setError] = createSignal("");
  const [time, setTime] = createSignal("");
  const navigate = useNavigate();
  const [showDeleteConfirmation, setShowDeleteConfirmation] =
    createSignal(false);
  const [isEditing, setIsEditing] = createSignal<boolean>(false);
  const [wellBeing, setWellBeing] = createSignal<number | undefined>();
  if (existingEntry) {
    setIsEditing(true);
  }
  const [entry, setEntry] = createSignal<
    Omit<SleepWithNoteUser, "user" | "recipient"> | undefined
  >();
  const recipient = createAsync(
    async () => await getRecipientName(parseInt(params.id))
  );
  const sleepData = createAsync(
    async () => await getSleepById(parseInt(existingEntry))
  );
  const recipientData = createMemo(() => recipient());
  createMemo(() => {
    setEntry(sleepData());
    const index = qualityEnum.findIndex((str) => {
      return str === sleepData()?.quality;
    });
    setWellBeing(index + 1);
  });
  const createAction = useAction(createSleepAction);
  const updateAction = useAction(updateSleepAction);
  const deleteAction = useAction(deleteSleepAction);
  type SleepActionResponse = {
    success?: boolean;
    error?: string;
  };
  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();

    let result: SleepActionResponse;
    const formData = new FormData(event.target as HTMLFormElement);
    formData.append("teamId", params.id);
    if (isEditing()) {
      formData.append("sleepId", existingEntry);
      result = await updateAction(formData);
    } else {
      result = await createAction(formData);
    }

    if (result.success) {
      setError("");
      formRef()?.reset();
      showNotification(
        isEditing() ? "Sleep Entry Updated" : "Sleep Entry Posted"
      );
      navigate(`/team/${params.id}/journal`);
    } else if (result.error) {
      console.error(result.error);
      setError(result.error);
    }
  };

  const handleDelete = async () => {
    const result = await deleteAction(parseInt(existingEntry));
    if (result.success) {
      showNotification("Sleep Entry Deleted");
      navigate(`/team/${params.id}/journal`);
    } else {
      console.error("Error deleting entry:", result.error);
    }
  };

  return (
    <main class="mx-2 flex flex-col items-center justify-center mb-4">
      <section class="flex flex-col w-full justify-center text-start">
        <div class="flex flex-col items-center gap-1">
          <SleepIcon iconColor="#7F99DD" bgColor="#091E54" />
          <Header
            title={isEditing() ? "Edit Entry" : "Sleep"}
            description="Log sleep hours to track nightly rest patterns."
          />
        </div>
        <div class="flex flex-col mt-2 gap-2 w-full">
          <ShowError error={error()}></ShowError>
          <form
            ref={setFormRef}
            onSubmit={handleSubmit}
            class="flex flex-col mt-2 gap-2"
            method="post"
          >
            <div class="flex flex-col gap-2 justify-center">
              <Show when={(isEditing() && entry()) || !isEditing()}>
                <label class="text-h4">Sleep Quality</label>
                <Slider
                  id="quality"
                  name="quality"
                  minValue={1}
                  maxValue={5}
                  defaultValue={wellBeing() || 3}
                />
                <label class="text-h4">Hours Slept</label>
                <input
                  name="duration"
                  type="text"
                  class="border border-lofiGray rounded-md text-center p-2"
                  placeholder="00:00"
                  value={entry()?.duration}
                />
                <label class="text-h4">Date & Time Taken</label>
                <div class="flex flex-row gap-2 items-center">
                  <div class="flex-1">
                    <DatePickerComponent
                      value={entry()?.date.toLocaleDateString("en-us", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    />
                  </div>
                  <TimePicker
                    time={time}
                    setTime={setTime}
                    name="time"
                    class="flex-1"
                  />
                </div>
                <label>Trouble going to sleep or staying up?</label>
                <RadioGroupComponent
                  id="troubleSleeping"
                  name="troubleSleeping"
                  options={["Yes", "No"]}
                  defaultValue={
                    entry()
                      ? entry()?.troubleSleeping
                        ? "Yes"
                        : "No"
                      : undefined
                  }
                />
              </Show>
            </div>
            <Show when={(isEditing() && entry()) || !isEditing()}>
              <AddNote
                title="Add Notes"
                placeholder="What else would you like to note about their sleep?"
                content={entry()?.note?.note || ""}
              />
              <div class="flex justify-center">
                <Button
                  class="rounded-[100px] h-12 w-full bg-primary-purple-300 text-black"
                  variant="default"
                  type="submit"
                >
                  Finish Entry
                </Button>
              </div>
              {isEditing() && (
                <Button
                  onClick={() => setShowDeleteConfirmation(true)}
                  class="bg-transparent shadow-none font-sf-pro font-medium text-base text-error hover:bg-transparent"
                >
                  Delete Entry
                </Button>
              )}
            </Show>
          </form>
        </div>
        <Show when={showDeleteConfirmation()}>
          <DeleteConfirmation
            title="Journal Entry"
            description="this entry"
            buttonText="Entry"
            onCancel={() => setShowDeleteConfirmation(false)}
            onClose={() => setShowDeleteConfirmation(false)}
            onDelete={handleDelete}
          />
        </Show>
      </section>
    </main>
  );
}
