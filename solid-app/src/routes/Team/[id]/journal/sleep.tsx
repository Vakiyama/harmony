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
import { getRecipientName } from "~/api/team";
import {
  qualityEnum,
  SleepWithNoteUser,
} from "../../../../../drizzle/schema/Sleeps";

export default function SleepTracker() {
  const params = useParams();
  const location = useLocation();
  const existingEntry = location.search.split("?edit=")[1];
  const [formRef, setFormRef] = createSignal<HTMLFormElement | undefined>();
  const [error, setError] = createSignal("");
  const navigate = useNavigate();
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
      showNotification("Sleep Entry Posted");
      navigate(`/team/${params.id}/journal`);
    } else if (result.error) {
      console.error(result.error);
      setError(result.error);
    }
  };
  return (
    <main class="w-full h-full p-4 flex flex-col items-center justify-center space-y-2">
      <section class="mt-8 mb-8 flex flex-col w-full justify-center text-start">
        <div class="flex flex-col items-center gap-1">
          <svg
            width="50"
            height="50"
            viewBox="0 0 50 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M41.6667 19.9083V6.25H37.5V10.4167H12.5V6.25H8.33335V19.9104C5.85419 21.3542 4.16669 24.0125 4.16669 27.0833V35.4167C4.16669 35.9692 4.38618 36.4991 4.77688 36.8898C5.16758 37.2805 5.69749 37.5 6.25002 37.5H8.33335V45.8333H12.5V37.5H37.5V45.8333H41.6667V37.5H43.75C44.3026 37.5 44.8325 37.2805 45.2232 36.8898C45.6139 36.4991 45.8334 35.9692 45.8334 35.4167V27.0833C45.8334 24.0125 44.1438 21.3542 41.6667 19.9083ZM22.9167 18.75H12.5V14.5833H22.9167V18.75ZM37.5 18.75H27.0834V14.5833H37.5V18.75Z"
              fill="black"
            />
          </svg>
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
                <label class="text-h4">Night or Day</label>
                <RadioGroupComponent
                  id="timeFrame"
                  name="timeFrame"
                  options={["Night", "Day"]}
                  defaultValue={entry()?.timeFrame}
                />
                <label class="text-h4">Hours Slept</label>
                <input
                  name="duration"
                  type="number"
                  class="border border-black50 rounded-md text-center p-2"
                  placeholder="00:00"
                  value={entry()?.duration}
                />
                <label class="text-h4">Date</label>
                <DatePickerComponent
                  value={entry()?.date.toLocaleDateString("en-us", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                />
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
                placeholder="User Input"
                content={entry()?.note?.note || ""}
              />
              <div class="flex justify-center">
                <Button
                  class="rounded-[100px] h-12 w-full mb-4 bg-lofiGray text-black"
                  variant="default"
                  type="submit"
                >
                  Done
                </Button>
              </div>
              {/* Change this to show a confirmation */}
              {isEditing() ? (
                <button onClick={() => deleteAction(parseInt(existingEntry))}>
                  Delete Entry
                </button>
              ) : null}
              <div class="h-[88px]"></div> {/* temporary  */}
            </Show>
          </form>
        </div>
      </section>
    </main>
  );
}
