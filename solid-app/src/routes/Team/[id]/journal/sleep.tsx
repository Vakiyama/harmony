import RadioGroupComponent from "~/components/shadcn/RadioGroup";
import DatePickerComponent from "~/components/shadcn/DatePicker";
import { createSleepAction } from "~/api/journal";
import { useAction, useNavigate, useParams } from "@solidjs/router";
import { createSignal } from "solid-js";
import ShowError from "~/routes/Team/[id]/journal/show-error";
import { Button } from "~/components/ui/button";
import AddNote from "~/routes/Team/[id]/journal/add-notes";
import Header from "./header";
import { Slider } from "~/components/ui/slider";
import { showNotification } from "~/routes/api/notificationStore";
import SleepIcon from "~/components/icon/sleep-icon";

export default function SleepTracker() {
  const [formRef, setFormRef] = createSignal<HTMLFormElement | undefined>();
  const [error, setError] = createSignal("");
  const navigate = useNavigate();
  const params = useParams();

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
        <div class="flex flex-col items-center gap-1 mt-16">
          <SleepIcon iconColor="#7F99DD" bgColor="#091E54" />
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
                class="border border-lofiGray rounded-md text-center p-2"
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
            <AddNote
              title="Add Notes"
              placeholder="What else would you like to note about their sleep?"
            />
            <div class="flex justify-center">
              <Button
                class="rounded-[100px] h-12 w-full mb-4 bg-primary-purple-300 text-black"
                variant="default"
                type="submit"
              >
                Finish Entry
              </Button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
