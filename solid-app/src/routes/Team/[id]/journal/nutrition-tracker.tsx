import RadioGroupComponent from "~/components/shadcn/RadioGroup";
import DatePickerComponent from "~/components/shadcn/DatePicker";
import { createMealAction } from "~/api/journal";
import { createSignal } from "solid-js";
import { useAction } from "@solidjs/router";
import ShowError from "~/routes/Team/[id]/journal/show-error";
import { Button } from "~/components/ui/button";
import AddNote from "~/routes/Team/[id]/journal/add-notes";
import Header from "./header";
import PageHeader from "./page-header";
import SelectInput from "~/components/shadcn/Select";
import PhotoUpload from "./upload";

export default function NutritionTracker() {
  const [formRef, setFormRef] = createSignal<HTMLFormElement | undefined>();
  const [error, setError] = createSignal("");
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
    } else if (result.error) {
      console.error(result.error);
      setError(result.error);
    }
  };
  return (
    <main class="w-full h-full p-4 flex flex-col items-center justify-center space-y-2">
      <PageHeader />
      <section class="mt-8 mb-8 flex flex-col w-full justify-center text-start overflow-y-auto overflow-x-hidden">
        <div class="flex flex-col items-center gap-1">
          <svg
            width="50"
            height="50"
            viewBox="0 0 50 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M42.8711 16.2393C41.0478 13.0586 38.2363 11.2773 34.5146 10.9434C32.5439 10.7676 30.7061 11.2725 28.9258 11.7617C27.5439 12.1416 26.2383 12.5 25 12.5C23.7617 12.5 22.4609 12.1406 21.0879 11.7607C19.3027 11.2725 17.457 10.7588 15.4795 10.9443C11.9258 11.2773 9.08203 13.1035 7.24609 16.2256C5.54883 19.1172 4.6875 23.1211 4.6875 28.125C4.6875 32.0703 6.15234 36.9619 8.59375 41.2109C9.8457 43.3838 13.1836 48.4375 17.1055 48.4375C20.1104 48.4375 21.71 47.5156 22.8779 46.8428C23.6885 46.376 24.1777 46.0938 24.9961 46.0938C25.8145 46.0938 26.3037 46.376 27.1143 46.8428C28.2861 47.5156 29.8828 48.4375 32.8906 48.4375C36.8135 48.4375 40.1504 43.3828 41.4023 41.2109C43.8506 36.9629 45.3086 32.0713 45.3086 28.125C45.3125 22.9912 44.5137 19.1035 42.8711 16.2393ZM21.0937 34.375C19.7998 34.375 18.75 32.2764 18.75 29.6875C18.75 27.0986 19.7998 25 21.0937 25C22.3877 25 23.4375 27.0986 23.4375 29.6875C23.4375 32.2764 22.3877 34.375 21.0937 34.375ZM28.9062 34.375C27.6123 34.375 26.5625 32.2764 26.5625 29.6875C26.5625 27.0986 27.6123 25 28.9062 25C30.2002 25 31.25 27.0986 31.25 29.6875C31.25 32.2764 30.2002 34.375 28.9062 34.375Z"
              fill="black"
            />
            <path
              d="M25.8887 10.9307C27.1738 10.7598 29.5859 10.1661 31.6338 8.1192C33.1613 6.58807 34.1251 4.58469 34.3682 2.43561C34.3821 2.3209 34.3704 2.20454 34.3339 2.0949C34.2974 1.98526 34.2371 1.88508 34.1572 1.80158C34.0773 1.71807 33.98 1.65332 33.872 1.61199C33.7641 1.57066 33.6484 1.55378 33.5332 1.56256C32.292 1.65534 29.9434 2.13581 27.7979 4.28229C26.2214 5.83143 25.2324 7.88026 25 10.0782C24.988 10.1963 25.003 10.3156 25.0439 10.427C25.0849 10.5384 25.1507 10.6391 25.2364 10.7212C25.322 10.8034 25.4253 10.865 25.5383 10.9013C25.6514 10.9376 25.7712 10.9477 25.8887 10.9307Z"
              fill="black"
            />
          </svg>
          <Header
            title="Nutrition"
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
            <div class="flex flex-col gap-2 justify-center">
              <div class="flex flex-col gap-2">
                <label>Meal Type</label>
                <SelectInput
                  options={["Breakfast", "Lunch", "Dinner", "Snack"]}
                  placeholder="Select Meal Type"
                  name="category"
                />
                <label class="text-h4">Food Name</label>
                <input
                  type="text"
                  id="foodName"
                  name="foodName"
                  class="border border-black50 rounded-md p-2"
                  placeholder="Food Name"
                />
                <label class="text-h4">Drink Name</label>
                <input
                  type="text"
                  id="drinkName"
                  name="drinkName"
                  class="border border-black50 rounded-md p-2"
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
                placeholder="Select Amount Eaten"
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
            <AddNote title="Add Notes" placeholder="Note..." />
            <Button
              class="rounded-[100px] h-12 w-full mb-4 bg-lofiGray text-black"
              variant="default"
              type="submit"
            >
              Done
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
}
