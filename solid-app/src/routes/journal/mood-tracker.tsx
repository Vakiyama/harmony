import RadioGroupComponent from "~/components/shadcn/RadioGroup";
import DatePickerComponent from "~/components/shadcn/DatePicker";
import { createMoodAction } from "~/api/journal";
import { createSignal } from "solid-js";
import { useAction } from "@solidjs/router";
import ShowError from "~/routes/journal/show-error";
import { Button } from "~/components/ui/button";
import AddNote from "~/routes/journal/add-notes";
import Header from "./header";

export default function MoodTracker() {
  const [formRef, setFormRef] = createSignal<HTMLFormElement | undefined>();
  const [error, setError] = createSignal("");
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
    } else if (result.error) {
      console.error(result.error);
      setError(result.error);
    }
  };
  return (
    <main class="absolute top-[3rem] w-full h-[calc(100%-3rem)] p-4 flex items-center justify-center space-y-2 overflow-hidden">
      <section class="mt-8 mb-8 flex flex-col w-full max-w-[368px] justify-center text-start">
        <div class="flex flex-col gap-1">
          <svg
            width="50"
            height="50"
            viewBox="0 0 50 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_536_636)">
              <path
                d="M35.4167 6.95843C38.5589 8.77272 41.1728 11.3762 42.9996 14.5111C44.8264 17.6461 45.8028 21.2038 45.8321 24.8321C45.8614 28.4603 44.9426 32.0333 43.1667 35.1974C41.3908 38.3614 38.8193 41.0068 35.7068 42.8716C32.5942 44.7364 29.0487 45.756 25.421 45.8294C21.7934 45.9028 18.2095 45.0275 15.0241 43.2902C11.8387 41.5529 9.16223 39.0137 7.25972 35.9241C5.35721 32.8345 4.2946 29.3016 4.17708 25.6751L4.16666 25.0001L4.17708 24.3251C4.29375 20.7272 5.34072 17.2209 7.21591 14.148C9.0911 11.0752 11.7305 8.54063 14.8769 6.79152C18.0232 5.04242 21.5691 4.13843 25.1688 4.16768C28.7685 4.19693 32.2992 5.15843 35.4167 6.95843ZM31.6667 29.7626C31.2721 29.3759 30.7401 29.1617 30.1877 29.1672C29.6353 29.1726 29.1076 29.3973 28.7208 29.7918C28.2359 30.2869 27.657 30.6802 27.0181 30.9488C26.3791 31.2173 25.6931 31.3556 25 31.3556C24.3069 31.3556 23.6209 31.2173 22.9819 30.9488C22.343 30.6802 21.7641 30.2869 21.2792 29.7918C20.8904 29.4064 20.3656 29.1895 19.8182 29.188C19.2709 29.1865 18.7449 29.4005 18.354 29.7837C17.9631 30.1669 17.7388 30.6885 17.7295 31.2358C17.7201 31.7831 17.9266 32.3121 18.3042 32.7084C19.177 33.5991 20.2188 34.3067 21.3686 34.7898C22.5183 35.2729 23.7529 35.5217 25 35.5217C26.2471 35.5217 27.4817 35.2729 28.6314 34.7898C29.7812 34.3067 30.823 33.5991 31.6958 32.7084C32.0826 32.3139 32.2967 31.7819 32.2913 31.2295C32.2858 30.677 32.0611 30.1494 31.6667 29.7626ZM18.7708 18.7501L18.5062 18.7647C17.979 18.8274 17.4955 19.0891 17.1547 19.4963C16.8139 19.9035 16.6414 20.4254 16.6726 20.9555C16.7037 21.4856 16.936 21.9838 17.3221 22.3483C17.7083 22.7129 18.219 22.9162 18.75 22.9168L19.0146 22.9022C19.5419 22.8395 20.0253 22.5778 20.3661 22.1706C20.7069 21.7634 20.8794 21.2414 20.8483 20.7113C20.8172 20.1813 20.5848 19.6831 20.1987 19.3185C19.8126 18.954 19.3018 18.7507 18.7708 18.7501ZM31.2708 18.7501L31.0062 18.7647C30.479 18.8274 29.9955 19.0891 29.6547 19.4963C29.3139 19.9035 29.1414 20.4254 29.1726 20.9555C29.2037 21.4856 29.436 21.9838 29.8221 22.3483C30.2083 22.7129 30.719 22.9162 31.25 22.9168L31.5146 22.9022C32.0419 22.8395 32.5253 22.5778 32.8661 22.1706C33.2069 21.7634 33.3794 21.2414 33.3483 20.7113C33.3172 20.1813 33.0848 19.6831 32.6987 19.3185C32.3126 18.954 31.8018 18.7507 31.2708 18.7501Z"
                fill="black"
              />
            </g>
            <defs>
              <clipPath id="clip0_536_636">
                <rect width="50" height="50" fill="white" />
              </clipPath>
            </defs>
          </svg>
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
            class="flex flex-col mt-2 gap-2"
          >
            <div class="flex flex-col gap-2 justify-center">
              <label class="text-h4">How is x doing?</label>
              <RadioGroupComponent
                id="wellBeing"
                name="wellBeing"
                options={["Poor", "Mid", "Good"]}
              />
              <label class="text-h4">Time of Day</label>
              <RadioGroupComponent
                id="timeFrame"
                name="timeFrame"
                options={["Morning", "Afternoon", "Evening"]}
              />
            </div>
            <div class="flex gap-2 items-center">
              <label class="text-h4">Date</label>
              <DatePickerComponent />
            </div>
            <AddNote
              title="What have you noticed?"
              placeholder="Describe the situation"
            />
            <Button
              class="rounded-button h-12 w-full mb-4"
              variant="default"
              type="submit"
            >
              Save
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
}
