import {
  createTakenMedicationAction,
  getMedicationsFromTeamId,
} from "~/api/journal";
import { createMemo, createSignal } from "solid-js";
import {
  createAsync,
  useNavigate,
  useAction,
  useParams,
} from "@solidjs/router";
import ShowError from "~/routes/Team/[id]/journal/show-error";
import { Button } from "~/components/ui/button";
import AddNote from "~/routes/Team/[id]/journal/add-notes";
import Header from "./header";
import SelectInput from "~/components/shadcn/Select";
import TimePicker from "~/components/ui/time-picker";
import { Medications } from "@/schema/Medications";
import { showNotification } from "~/routes/api/notificationStore";
import DatePickerComponent from "~/components/shadcn/DatePicker";
import MedicationIcon from "~/components/icon/medication-icon";
import RadioGroupComponent from "~/components/shadcn/RadioGroup";

export default function Medication() {
  const medications = createAsync(
    async () => await getMedicationsFromTeamId(1),
    { deferStream: true }
  );
  const [formRef, setFormRef] = createSignal<HTMLFormElement | undefined>();
  const [error, setError] = createSignal("");
  const [time, setTime] = createSignal("");
  const navigate = useNavigate();
  const params = useParams();
  const formatOptions = (data: Medications[] | undefined) => {
    return data
      ? data.map((data) => {
          return { value: String(data.id), label: data.name };
        })
      : [];
  };
  const medicationOptions = createMemo(() => formatOptions(medications()));

  const myAction = useAction(createTakenMedicationAction);
  type CreateMedicationActionResponse = {
    success?: boolean;
    error?: string;
  };
  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();

    const result: CreateMedicationActionResponse = await myAction(
      new FormData(event.target as HTMLFormElement)
    );

    if (result.success) {
      setError("");
      formRef()?.reset();
      showNotification("Medication Entry Posted");
      navigate(`/team/${params.id}/journal`);
    } else if (result.error) {
      console.error(result.error);
      setError(result.error);
    }
  };

  const medicationTypes = [
    "Tablet",
    "Capsule",
    "Liquid",
    "Injection",
    "Topical",
    "Inhaler",
  ];

  return (
    <main class="w-full h-full p-4 flex flex-col items-center justify-center space-y-2">
      <section class="mt-8 mb-8 flex flex-col w-full justify-center text-start">
        <div class="flex flex-col items-center gap-1 mt-16">
          <MedicationIcon iconColor="#FE7258" bgColor="#5B0E00" />
          <Header
            title="Medication Taken"
            description="Log medication taken to keep track of the treatment schedule."
          />
        </div>
        <form
          ref={setFormRef}
          onSubmit={handleSubmit}
          method="post"
          class="flex flex-col mt-2 gap-2 w-full"
        >
          <ShowError error={error()}></ShowError>
          <div class="flex flex-col gap-5 text-h4">
            <RadioGroupComponent
              id="takenOrMissed"
              name="takenOrMissed"
              options={["Taken", "Missed"]}
              defaultValue="Taken"
            />
            <div>
              <label>Select Medication</label>
              <SelectInput
                name="medication"
                class="w-full p-1 rounded-lg py-4 ps-4"
                placeholder="Selection a medication"
                options={medicationOptions()}
                setSelectedOption={() => {}}
              />
            </div>
            <div>
              <label>Medication Type</label>
              <SelectInput
                name="medicationType"
                class="w-full p-1 rounded-lg py-4 ps-4 "
                placeholder="Select a medication type"
                options={medicationTypes}
                setSelectedOption={() => undefined}
              />
            </div>
            <div class="flex flex-col gap-2 justify-center">
              <label class="text-h4">Date & Time Taken</label>
              <div class="flex flex-row gap-2 items-center">
                <div class="flex-1">
                  <DatePickerComponent />
                </div>
                <TimePicker
                  time={time}
                  setTime={setTime}
                  name="time"
                  class="flex-1"
                />
              </div>
            </div>
            <AddNote
              title="Additional Notes"
              placeholder="i.e. Take two tablets up to 4 times daily with food."
            />
            <Button
              class="rounded-[100px] h-12 w-full mb-4 bg-primary-purple-300 text-black"
              variant="default"
              type="submit"
            >
              Finish Entry
            </Button>
          </div>
        </form>
      </section>
    </main>
  );
}
