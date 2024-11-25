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
import { createEffect, createMemo, createSignal, Show } from "solid-js";
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
import moment from "moment";

export default function SleepTracker() {
  const currentHour = moment().hour();
  const params = useParams();
  const location = useLocation();
  const existingEntry = location.search.split("?edit=")[1];
  const [formRef, setFormRef] = createSignal<HTMLFormElement | undefined>();
  const [error, setError] = createSignal("");
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
  createEffect(() => console.log(recipientData(), sleepData()));
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
            <div class="flex flex-col gap-6 justify-center">
              <Show
                when={
                  (isEditing() && entry() && recipientData()) ||
                  (!isEditing() && recipientData())
                }
              >
                <div class="mx-9 flex flex-col justify-center items-center">
                  <label class="text-h4 mb-4 font-grotesque leading-[120%] font-medium text-[#1E1E1E]">
                    {`How was ${
                      recipientData()?.recipient
                        ? recipientData()?.recipient?.firstName ||
                          recipientData()?.recipient?.lastName
                        : ""
                    }'s sleep?`}
                  </label>
                  <Slider
                    id="quality"
                    name="quality"
                    minValue={1}
                    maxValue={5}
                    defaultValue={wellBeing() || 3}
                  />
                </div>
                <div>
                  <label class="text-h4 mb-4 font-grotesque leading-[120%] font-medium text-[#1E1E1E]">
                    Night or Day
                  </label>
                  <RadioGroupComponent
                    id="timeFrame"
                    name="timeFrame"
                    options={["Night", "Day"]}
                    defaultValue={
                      entry()
                        ? entry()?.timeFrame
                        : currentHour >= 6 && currentHour < 18
                        ? "Day"
                        : "Night"
                    }
                  />
                </div>
                <div class="flex flex-col">
                  <label class="text-h4 mb-4 font-grotesque leading-[120%] font-medium text-[#1E1E1E]">
                    Hours Slept
                  </label>
                  <input
                    name="duration"
                    type="number"
                    step="0.01"
                    min={0}
                    class="border border-lofiGray rounded-md text-middle p-2"
                    placeholder="Duration in hours (e.g. 5)"
                    value={entry()?.duration}
                  />
                </div>
                <div>
                  <label class="text-h4 mb-4 font-grotesque leading-[120%] font-medium text-[#1E1E1E]">
                    Date
                  </label>
                  <DatePickerComponent
                    value={entry()?.date.toLocaleDateString("en-us", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  />
                </div>
                <div>
                  <label class="text-h4 mb-4 font-grotesque leading-[120%] font-medium text-[#1E1E1E]">
                    Trouble going to sleep or staying up?
                  </label>
                  <RadioGroupComponent
                    id="troubleSleeping"
                    name="troubleSleeping"
                    options={["Yes", "No"]}
                    defaultValue={
                      entry() ? (entry()?.troubleSleeping ? "Yes" : "No") : "No"
                    }
                  />
                </div>
              </Show>
              <Show when={(isEditing() && entry()) || !isEditing()}>
                <AddNote
                  title="Additional Notes"
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
                    class="bg-transparent shadow-none font-sf-pro font-medium text-base hover:bg-transparent"
                  >
                    Delete Entry
                  </Button>
                )}
              </Show>
            </div>
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
