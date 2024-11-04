import RadioGroupComponent from "~/components/shadcn/RadioGroup";
import DatePickerComponent from "~/components/shadcn/DatePicker";
import { createMealAction } from "~/api/journal";
import { createSignal } from "solid-js";
import { useAction, useNavigate, useParams } from "@solidjs/router";
import ShowError from "~/routes/Team/[id]/journal/show-error";
import { Button } from "~/components/ui/button";
import AddNote from "~/routes/Team/[id]/journal/add-notes";
import Header from "./header";
import SelectInput from "~/components/shadcn/Select";
import PhotoUpload from "./upload";
import { showNotification } from "~/routes/api/notificationStore";
import NutritionIcon from "~/components/icon/nutrition-icon";

export default function NutritionTracker() {
  const [formRef, setFormRef] = createSignal<HTMLFormElement | undefined>();
  const [error, setError] = createSignal("");
  const navigate = useNavigate();
  const params = useParams();

  const myAction = useAction(createMealAction);
  type CreateMealActionResponse = {
    success?: boolean;
    error?: string;
  };
  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();

    const result: CreateMealActionResponse = await myAction(
      new FormData(event.target as HTMLFormElement)
    );

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
            title="Nutrition"
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
                <label>Meal Type</label>
                <SelectInput
                  options={["Breakfast", "Lunch", "Dinner", "Snack"]}
                  setSelectedOption={() => undefined}
                  placeholder="Select Meal Type"
                  class="w-full p-1 rounded-lg py-4 ps-4"
                  name="category"
                />
                <label class="text-h4">Food Name</label>
                <input
                  type="text"
                  id="foodName"
                  name="foodName"
                  class="border border-lofiGray rounded-md p-2"
                  placeholder="Food Name"
                />
                <label class="text-h4">Drink Name</label>
                <input
                  type="text"
                  id="drinkName"
                  name="drinkName"
                  class="border border-lofiGray rounded-md p-2"
                  placeholder="Drink Name"
                />
              </div>
              <label class="text-h4">How much did Lola eat?</label>
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
              />
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-h4">Date</label>
              <DatePickerComponent />
            </div>
            <div class="flex flex-col">
              <label class="text-h4">Photo</label>
              <PhotoUpload description="Tap to add a photo" />
            </div>
            <AddNote
              title="Add Notes"
              placeholder="What else would you like to note about their nutrition?"
            />
            <Button
              class="rounded-[100px] h-12 w-full mb-4 bg-primary-purple-300 text-black"
              variant="default"
              type="submit"
            >
              Finish Entry
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
}
