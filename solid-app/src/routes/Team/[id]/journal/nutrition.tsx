import RadioGroupComponent from "~/components/shadcn/RadioGroup";
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
import PhotoUpload from "./upload";
import { showNotification } from "~/routes/api/notificationStore";
import NutritionIcon from "~/components/icon/nutrition-icon";
import { MealWithNoteUser } from "@/schema/Meals";
import { getRecipientName } from "~/api/team";

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
      showNotification("Nutrition Entry Posted");
      navigate(`/team/${params.id}/journal`);
    } else if (result.error) {
      console.error(result.error);
      setError(result.error);
    }
  };
  return (
    <main class="w-full h-full p-4 flex flex-col items-center justify-center space-y-2">
      <section class="mt-8 mb-8 flex flex-col w-full h-full justify-center text-start">
        <div class="flex flex-col items-center gap-1 mt-16 overflow-hidden">
          <NutritionIcon iconColor="#6FC94F" bgColor="#19370E" />
          <Header
            title={isEditing() ? "Edit Entry" : "Nutrition"}
            description="Log meals and snacks to track nutrition throughout the day."
          />
        </div>
        <div class="flex flex-col mt-2 gap-2 w-full overflow-y-scroll">
          <ShowError error={error()}></ShowError>
          <form
            ref={setFormRef}
            onSubmit={handleSubmit}
            method="post"
            class="flex flex-col mt-2 gap-2"
          >
            <div class="flex flex-col gap-2 justify-center w-full">
              <div class="flex flex-col gap-2">
                <Show when={(isEditing() && entry()) || !isEditing()}>
                  <label>Meal Type</label>
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
                  <label class="text-h4">Food Name</label>
                  <input
                    type="text"
                    id="foodName"
                    name="foodName"
                    class="border border-lofiGray rounded-md p-2"
                    placeholder="Food Name"
                    value={entry()?.foodName || ""}
                  />
                  <label class="text-h4">Drink Name</label>
                  <input
                    type="text"
                    id="drinkName"
                    name="drinkName"
                    class="border border-lofiGray rounded-md p-2"
                    placeholder="Drink Name"
                    value={entry()?.drinkName || ""}
                  />
                </Show>
              </div>
              <Show
                when={
                  (isEditing() && entry()) || (!isEditing() && recipientData())
                }
              >
                <label class="text-h4">{`How much did ${
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
              </Show>
            </div>
            <Show when={(isEditing() && entry()) || !isEditing()}>
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
              <div class="flex flex-col">
                <label class="text-h4">Photo</label>
                <PhotoUpload description="Tap to add a photo" />
              </div>
              <AddNote
                title="Add Notes"
                placeholder="What else would you like to note about their nutrition?"
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
