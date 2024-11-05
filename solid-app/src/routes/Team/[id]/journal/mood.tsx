import RadioGroupComponent from "~/components/shadcn/RadioGroup";
import DatePickerComponent from "~/components/shadcn/DatePicker";
import {
  createMoodAction,
  deleteMoodAction,
  getMoodById,
  updateMoodAction,
} from "~/api/journal";
import { createMemo, createSignal, Show } from "solid-js";
import {
  createAsync,
  useAction,
  useLocation,
  useNavigate,
  useParams,
} from "@solidjs/router";
import ShowError from "~/routes/Team/[id]/journal/show-error";
import { Button } from "~/components/ui/button";
import AddNote from "~/routes/Team/[id]/journal/add-notes";
import Header from "./header";
import { Slider } from "~/components/ui/slider";
import { showNotification } from "~/routes/api/notificationStore";
import MoodIcon from "~/components/icon/mood-icon";
import { MoodsWithNoteUser } from "@/schema/Moods";
import { qualityEnum } from "../../../../../drizzle/schema/Sleeps";
import { getRecipientName } from "~/api/team";

export default function MoodTracker() {
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
    Omit<MoodsWithNoteUser, "user"> | undefined
  >();
  const recipient = createAsync(
    async () => await getRecipientName(parseInt(params.id))
  );
  const moodData = createAsync(
    async () => await getMoodById(parseInt(existingEntry))
  );
  createMemo(() => {
    setEntry(moodData());
    const index = qualityEnum.findIndex((str) => {
      return str === moodData()?.wellBeing;
    });
    setWellBeing(index + 1);
  });
  const recipientData = createMemo(() => recipient());
  const createAction = useAction(createMoodAction);
  const updateAction = useAction(updateMoodAction);
  const deleteAction = useAction(deleteMoodAction);
  type MoodActionResponse = {
    success?: boolean;
    error?: string;
    message?: string;
  };
  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();

    let result: MoodActionResponse;
    const formData = new FormData(event.target as HTMLFormElement);
    formData.append("teamId", params.id);
    if (isEditing()) {
      formData.append("moodId", existingEntry);
      result = await updateAction(formData);
    } else {
      result = await createAction(formData);
    }

    if (result.success) {
      setError("");
      formRef()?.reset();
      showNotification("Mood Entry Posted");
      navigate(`/team/${params.id}/journal`);
    } else if (result.error) {
      console.error(result.error);
      setError(result.error);
    }
  };
  return (
    <main class="w-full h-full p-4 flex flex-col items-center justify-center space-y-2">
      <section class="mt-8 mb-8 flex flex-col w-full justify-center text-start">
        <div class="flex flex-col items-center gap-1 mt-16">
          <MoodIcon iconColor="#FE83B0" bgColor="#761739" />
          <Header
            title={isEditing() ? "Edit Entry" : "Mood"}
            description="Keep track of daily moods to see how the day went."
          />
        </div>
        <div class="flex flex-col mt-2 gap-2 w-full">
          <ShowError error={error()}></ShowError>
          <form
            ref={setFormRef}
            onSubmit={handleSubmit}
            method="post"
            class="flex flex-col mt-2 gap-5"
          >
            <div class="flex flex-col gap-2 items-center justify-center">
              <Show
                when={
                  (isEditing() && entry() && recipientData()) ||
                  (!isEditing() && recipientData())
                }
              >
                <label class="text-h4">{`How is ${
                  recipientData()?.recipient?.firstName ||
                  recipientData()?.recipient?.lastName
                } doing?`}</label>
                <Slider
                  id="wellBeing"
                  name="wellBeing"
                  minValue={1}
                  maxValue={5}
                  defaultValue={wellBeing() || 3}
                />
              </Show>
            </div>
            <Show when={(isEditing() && entry()) || !isEditing()}>
              <div>
                <label class="text-h4">Time of Day</label>
                <RadioGroupComponent
                  id="timeFrame"
                  name="timeFrame"
                  options={["Morning", "Afternoon", "Night"]}
                  defaultValue={entry()?.timeFrame}
                />
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-h4">Date</label>
                <DatePickerComponent
                  value={entry()?.date.toLocaleDateString("en-us", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                />
              </div>
              <AddNote
                title="What have you noticed?"
                placeholder="What else have you noticed about their mood?"
                content={entry()?.note?.note || ""}
              />
              <Button
                class="rounded-[100px] h-12 w-full mb-4 bg-primary-purple-300 text-black"
                variant="default"
                type="submit"
              >
                Finish Entry
              </Button>
              {/* Change this to show a confirmation */}
              {isEditing() ? (
                <button onClick={() => deleteAction(parseInt(existingEntry))}>
                  Delete Entry
                </button>
              ) : null}
            </Show>
          </form>
        </div>
      </section>
    </main>
  );
}
