import {
  createTakenMedicationAction,
  deleteTakenMedicationAction,
  getMedicationsFromTeamId,
  getTakenMedicationById,
  updateTakenMedicationAction,
} from "~/api/journal";
import { createMemo, createSignal, Show } from "solid-js";
import {
  createAsync,
  useNavigate,
  useAction,
  useParams,
  useLocation,
} from "@solidjs/router";
import ShowError from "~/routes/Team/[id]/journal/show-error";
import { Button } from "~/components/ui/button";
import AddNote from "~/routes/Team/[id]/journal/add-notes";
import Header from "./header";
import SelectInput, { SelectOptions } from "~/components/shadcn/Select";
import TimePicker from "~/components/ui/time-picker";
import { Medications } from "@/schema/Medications";
import { showNotification } from "~/routes/api/notificationStore";
import DatePickerComponent from "~/components/shadcn/DatePicker";
import {
  TakenMedications,
  TakenMedsWithNoteUser,
} from "@/schema/TakenMedications";
import { formatTimeForPicker } from "~/lib/formateDateLocal";

export default function Medication() {
  const params = useParams();
  const location = useLocation();
  const existingEntry = location.search.split("?edit=")[1];
  const medicationData = createAsync(
    async () => await getTakenMedicationById(parseInt(existingEntry)),
    {
      deferStream: true,
    }
  );
  const medications = createAsync(
    async () => await getMedicationsFromTeamId(parseInt(params.id)),
    { deferStream: true }
  );
  const [isEditing, setIsEditing] = createSignal<boolean>(false);
  if (existingEntry) {
    setIsEditing(true);
  }
  const [entry, setEntry] = createSignal<
    Omit<TakenMedsWithNoteUser, "user"> | undefined
  >(undefined);
  const [formRef, setFormRef] = createSignal<HTMLFormElement | undefined>();
  const [error, setError] = createSignal("");
  const [time, setTime] = createSignal("");
  const navigate = useNavigate();
  const formatOptions = (data: Medications[] | undefined) => {
    return data
      ? data.map((data) => {
          return { value: String(data.id), label: data.name };
        })
      : [];
  };
  const [med, setMed] = createSignal<SelectOptions<string> | undefined>(
    undefined
  );
  const [medType, setMedType] = createSignal<SelectOptions<string> | undefined>(
    undefined
  );
  const medicationOptions = createMemo(() => formatOptions(medications()));
  createMemo(() => {
    setEntry(medicationData());
    if (entry()) {
      const time = formatTimeForPicker(entry()?.date);
      if (time) {
        setTime(time);
      }
      const med = medicationOptions().filter((med) => {
        if (med.label === entry()!.medications!.name) {
          return med;
        }
      })[0];
      setMedType({ value: entry()!.type, label: entry()!.type });
      setMed(med);
    }
  });
  const createAction = useAction(createTakenMedicationAction);
  const updateAction = useAction(updateTakenMedicationAction);
  const deleteAction = useAction(deleteTakenMedicationAction);
  type MedicationActionResponse = {
    success?: boolean;
    error?: string;
    message?: string;
  };
  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    formData.append("teamId", params.id);
    let result: MedicationActionResponse;
    if (isEditing()) {
      formData.append("takenMedicationId", existingEntry);
      result = await updateAction(formData);
    } else {
      result = await createAction(formData);
    }

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
        <div class="flex flex-col items-center gap-1">
          <svg
            width="50"
            height="50"
            viewBox="0 0 50 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M26.3688 5.74375C28.7132 3.39962 31.8927 2.08281 35.208 2.08301C38.5233 2.0832 41.7028 3.40039 44.0469 5.74479C46.391 8.08919 47.7078 11.2688 47.7076 14.5841C47.7074 17.8994 46.3902 21.0788 44.0458 23.4229L23.4208 44.0479C21.0764 46.392 17.8968 47.7089 14.5816 47.7087C11.2663 47.7085 8.08684 46.3913 5.74271 44.0469C3.39858 41.7025 2.08177 38.5229 2.08197 35.2076C2.08217 31.8923 3.39935 28.7129 5.74375 26.3687L26.3688 5.74375ZM41.0979 20.475L32.2604 29.3146L20.475 17.5292L29.3146 8.69166C30.0851 7.90355 31.0043 7.27612 32.019 6.84571C33.0337 6.4153 34.1237 6.19045 35.2259 6.18418C36.328 6.17792 37.4205 6.39036 38.44 6.80921C39.4595 7.22807 40.3858 7.845 41.1653 8.6243C41.9447 9.40361 42.5618 10.3298 42.9808 11.3492C43.3999 12.3687 43.6125 13.4611 43.6064 14.5633C43.6004 15.6655 43.3757 16.7555 42.9455 17.7702C42.5152 18.785 41.8859 19.7043 41.0979 20.475Z"
              fill="black"
            />
          </svg>
          <Header
            title={isEditing() ? "Edit Entry" : "Medication Taken"}
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
          <div class="flex flex-col gap-2 text-h4">
            <Show
              when={
                (isEditing() && med()) || (!isEditing() && medicationOptions())
              }
            >
              <label>Select Medication</label>
              <SelectInput
                name="medication"
                class="w-full p-1 rounded-lg py-6 ps-4 "
                placeholder="Selection a medication"
                options={medicationOptions()}
                defaultValue={med()}
                setSelectedOption={() => {}}
              />
            </Show>
            <Show
              when={
                (isEditing() && medType()) || (!isEditing() && medicationTypes)
              }
            >
              <label>Medication Type</label>
              <SelectInput
                name="medicationType"
                class="w-full p-1 rounded-lg py-6 ps-4 "
                placeholder="Select a medication type"
                options={medicationTypes}
                defaultValue={medType()}
                setSelectedOption={() => undefined}
              />
            </Show>
          </div>
          <div class="flex flex-col gap-2 justify-center">
            <label class="text-h4">Date & Time Taken</label>
            <div class="flex flex-row gap-2 items-center">
              <DatePickerComponent
                value={entry()?.date.toLocaleDateString("en-us", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              />
              <TimePicker time={time} setTime={setTime} name="time" />
            </div>
          </div>
          <AddNote
            title="Additional Notes"
            placeholder="i.e. Take two tablets up to 4 times daily with food."
            content={entry()?.note?.note || ""}
          />
          <Button
            class="rounded-[100px] h-12 w-full mb-4 bg-lofiGray text-black"
            variant="default"
            type="submit"
          >
            Done
          </Button>
          {/* Change this to show a confirmation */}
          {isEditing() ? (
            <button onClick={() => deleteAction(parseInt(existingEntry))}>
              Delete Entry
            </button>
          ) : null}
        </form>
      </section>
    </main>
  );
}
