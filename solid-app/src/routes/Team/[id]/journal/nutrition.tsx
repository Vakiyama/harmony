import DatePickerComponent from "~/components/shadcn/DatePicker";
import {
  createMealAction,
  deleteMealAction,
  getMealById,
  updateMealAction,
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
import SelectInput from "~/components/shadcn/Select";
import Upload from "./upload";
import { showNotification } from "~/routes/api/notificationStore";
import NutritionIcon from "~/components/icon/nutrition-icon";
import { MealWithNoteUser } from "@/schema/Meals";
import { getRecipientName } from "~/api/team";
import DeleteConfirmation from "~/components/shared/delete-confirmation";
import AddPhotoModal from "~/components/shared/add-photo-modal";
import TimePicker from "~/components/ui/time-picker";
import { formatTimeForPicker } from "~/lib/formateDateLocal";

export default function NutritionTracker() {
  const params = useParams();
  const location = useLocation();
  const existingEntry = location.search.split("?edit=")[1];
  const [formRef, setFormRef] = createSignal<HTMLFormElement | undefined>();
  const [error, setError] = createSignal("");
  const navigate = useNavigate();
  const mealData = createAsync(
    async () => await getMealById(parseInt(existingEntry)),
    {
      deferStream: true,
    }
  );
  const [time, setTime] = createSignal<string | null>("");
  const [showAddPhoto, setShowAddPhoto] = createSignal(false);

  const [showDeleteConfirmation, setShowDeleteConfirmation] =
    createSignal(false);

  const [isEditing, setIsEditing] = createSignal<boolean>(false);
  if (existingEntry) {
    setIsEditing(true);
  }
  const [entry, setEntry] = createSignal<
    Omit<MealWithNoteUser, "user" | "recipient"> | undefined
  >(undefined);
  const recipient = createAsync(
    async () => await getRecipientName(parseInt(params.id))
  );
  const recipientData = createMemo(() => recipient());
  createMemo(() => {
    setEntry(mealData());
    setTime(formatTimeForPicker(mealData()?.date) || null);
  });
  const createAction = useAction(createMealAction);
  const updateAction = useAction(updateMealAction);
  const deleteAction = useAction(deleteMealAction);
  type MealActionResponse = {
    success?: boolean;
    error?: string;
    message?: string;
  };
  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    let result: MealActionResponse;
    const formData = new FormData(event.target as HTMLFormElement);
    formData.append("teamId", params.id);
    if (isEditing()) {
      formData.append("mealId", existingEntry);
      result = await updateAction(formData);
    } else {
      result = await createAction(formData);
    }

    if (result.success) {
      setError("");
      formRef()?.reset();
      showNotification(
        isEditing() ? "Nutrition Entry Updated" : "Nutrition Entry Posted"
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
      showNotification("Nutrition Entry Deleted");
      navigate(`/team/${params.id}/journal`);
    } else {
      console.error("Error deleting entry:", result.error);
    }
  };

  return (
    <main class="mx-2 flex flex-col items-center justify-center mb-4">
      <section class="flex flex-col w-full justify-center text-start">
        <div class="flex flex-col items-center gap-1">
          <NutritionIcon iconColor="#6FC94F" bgColor="#19370E" />
          <Header
            title={isEditing() ? "Edit Entry" : "Nutrition"}
            description="Log meals and snacks to track nutrition throughout the day."
          />
        </div>
        <div class="flex flex-col mt-2 gap-2 w-full">
          <ShowError error={error()}></ShowError>
          <form
            ref={setFormRef}
            onSubmit={handleSubmit}
            method="post"
            class="flex flex-col mt-2 gap-2"
          >
            <div class="flex flex-col justify-center w-full">
              <Show when={(isEditing() && entry()) || !isEditing()}>
                <div class="flex flex-col mt-4 mb-4">
                  <label class="text-h4 font-grotesque leading-[120%] font-medium mb-1">
                    Meal Type
                  </label>
                  <SelectInput
                    options={["Breakfast", "Lunch", "Dinner", "Snack"]}
                    setSelectedOption={() => undefined}
                    placeholder="Select Meal Type"
                    class="w-full p-1 rounded-lg py-4 ps-4"
                    name="category"
                    defaultValue={{
                      value: entry()?.category || "",
                      label: entry()?.category || "",
                    }}
                  />
                </div>
                <div class="flex flex-col mb-4">
                  <label class="text-h4 font-grotesque leading-[120%] font-medium mb-1">
                    Food Name
                  </label>
                  <input
                    type="text"
                    id="foodName"
                    name="foodName"
                    class="border border-lofiGray rounded-md p-2"
                    placeholder="Food Name"
                    value={entry()?.foodName || ""}
                  />
                </div>
                <div class="flex flex-col mb-4">
                  <label class="text-h4 font-grotesque leading-[120%] font-medium mb-1">
                    Drink Name
                  </label>
                  <input
                    type="text"
                    id="drinkName"
                    name="drinkName"
                    class="border border-lofiGray rounded-md p-2"
                    placeholder="Drink Name"
                    value={entry()?.drinkName || ""}
                  />
                </div>
              </Show>

              <Show
                when={
                  (isEditing() && entry()) || (!isEditing() && recipientData())
                }
              >
                <div class="flex flex-col mb-4">
                  <label class="text-h4 font-grotesque leading-[120%] font-medium mb-1">{`How much did ${
                    recipientData()?.recipient?.firstName ||
                    recipientData()?.recipient?.lastName
                  }  eat?`}</label>
                  <SelectInput
                    options={[
                      "None",
                      "Less than half",
                      "Half",
                      "More than half",
                      "All",
                    ]}
                    setSelectedOption={() => undefined}
                    placeholder="Select Amount Eaten"
                    class="w-full p-1 rounded-lg py-4 ps-4"
                    name="consumption"
                    defaultValue={{
                      value: entry()?.consumption || "",
                      label: entry()?.consumption || "",
                    }}
                  />
                </div>
              </Show>
            </div>
            <Show when={(isEditing() && entry()) || !isEditing()}>
              <div class="flex flex-col mb-4">
                <label class="text-h4 font-grotesque leading-[120%] font-medium mb-1">
                  Date & Time Taken
                </label>
                <div class="flex flex-row gap-2 items-center">
                  <div class="flex-2">
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
                    class="flex-1 py-1"
                  />
                </div>
              </div>

              {/* <div
                class="flex flex-col mb-8"
                onClick={() => setShowAddPhoto(true)}
              >
                <label class="text-h4 font-grotesque leading-[120%] font-medium mb-1">
                  Photo
                </label>
                <Upload type="photo" description="Tap to add a photo" />
              </div> */}
              <AddNote
                title="Add Notes"
                placeholder="What else would you like to note about their nutrition?"
                content={entry()?.note?.note || ""}
              />
              <Button
                class="rounded-[100px] h-12 w-full bg-primary-purple-300 text-black mt-6"
                variant="default"
                type="submit"
              >
                Finish Entry
              </Button>
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
        <Show when={showAddPhoto()}>
          <AddPhotoModal
            onCancel={() => setShowAddPhoto(false)}
            onClose={() => setShowAddPhoto(false)}
            // onCamera={() => }
            // onFromGallery={() => }
          />
        </Show>
      </section>
    </main>
  );
}
