import RadioGroupComponent from "~/components/shadcn/RadioGroup";
import DatePickerComponent from "~/components/shadcn/DatePicker";
import { createMoodAction } from "~/api/journal";
import { createSignal } from "solid-js";
import { useAction, useNavigate, useParams } from "@solidjs/router";
import ShowError from "~/routes/Team/[id]/journal/show-error";
import { Button } from "~/components/ui/button";
import AddNote from "~/routes/Team/[id]/journal/add-notes";
import Header from "./header";
import { Slider } from "~/components/ui/slider";
import { showNotification } from "~/routes/api/notificationStore";
import MoodIcon from "~/components/icon/mood-icon";

export default function MoodTracker() {
  const [formRef, setFormRef] = createSignal<HTMLFormElement | undefined>();
  const [error, setError] = createSignal("");
  const navigate = useNavigate();
  const params = useParams();

  const myAction = useAction(createMoodAction);
  type CreateMoodActionResponse = {
    success?: boolean;
    error?: string;
  };
  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();

    const result: CreateMoodActionResponse = await myAction(
      new FormData(event.target as HTMLFormElement)
    );

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
            title="Mood"
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
              <label class="text-h4">How is Lola doing?</label>
              <Slider
                id="wellBeing"
                name="wellBeing"
                minValue={1}
                maxValue={5}
                defaultValue={3}
              />
            </div>
            <div>
              <label class="text-h4">Time of Day</label>
              <RadioGroupComponent
                id="timeFrame"
                name="timeFrame"
                options={["Morning", "Afternoon", "Night"]}
              />
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-h4">Date</label>
              <DatePickerComponent />
            </div>
            <AddNote
              title="What have you noticed?"
              placeholder="What else have you noticed about their mood?"
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
