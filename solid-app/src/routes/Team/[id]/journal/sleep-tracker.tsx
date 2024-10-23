import RadioGroupComponent from "~/components/shadcn/RadioGroup";
import DatePickerComponent from "~/components/shadcn/DatePicker";
import { createSleepAction } from "~/api/journal";
import { useAction } from "@solidjs/router";
import { createSignal } from "solid-js";
import ShowError from "~/routes/Team/[id]/journal/show-error";
import { Button } from "~/components/ui/button";
import AddNote from "~/routes/Team/[id]/journal/add-notes";
import Header from "./header";
import { Slider } from "~/components/ui/slider";
import PageHeader from "./page-header";

export default function SleepTracker() {
  const [formRef, setFormRef] = createSignal<HTMLFormElement | undefined>();
  const [error, setError] = createSignal("");
  const myAction = useAction(createSleepAction);
  type CreateSleepActionResponse = {
    success?: boolean;
    error?: string;
  };
  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();

    const result: CreateSleepActionResponse = await myAction(
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
            title="Sleep"
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
              <label class="text-h4">Sleep Quality</label>
              <Slider
                id="quality"
                name="quality"
                minValue={1}
                maxValue={5}
                defaultValue={3}
              />
              <label class="text-h4">Night or Day</label>
              <RadioGroupComponent
                id="timeFrame"
                name="timeFrame"
                options={["Night", "Day"]}
              />
              <label class="text-h4">Hours Slept</label>
              <input
                name="duration"
                type="number"
                class="border border-black50 rounded-md text-center p-2"
                placeholder="00:00"
              />
              <label class="text-h4">Date</label>
              <DatePickerComponent />
              <label>Trouble going to sleep or staying up?</label>
              <RadioGroupComponent
                id="troubleSleeping"
                name="troubleSleeping"
                options={["Yes", "No"]}
              />
            </div>
            <AddNote title="Add Notes" placeholder="User Input" />
            <div class="flex justify-center">
              <Button
                class="rounded-[100px] h-12 w-full mb-4 bg-lofiGray text-black"
                variant="default"
                type="submit"
              >
                Done
              </Button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
