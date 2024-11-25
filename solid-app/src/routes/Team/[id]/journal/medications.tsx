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
import { type Medications } from "@/schema/Medications";
import { showNotification } from "~/routes/api/notificationStore";
import DatePickerComponent from "~/components/shadcn/DatePicker";
import { TakenMedsWithNoteUser } from "@/schema/TakenMedications";
import { formatTimeForPicker } from "~/lib/formateDateLocal";
import MedicationIcon from "~/components/icon/medication-icon";
import RadioGroupComponent from "~/components/shadcn/RadioGroup";
import DeleteConfirmation from "~/components/shared/delete-confirmation";
import { twMerge } from "tailwind-merge";

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
  const [showDeleteConfirmation, setShowDeleteConfirmation] =
    createSignal(false);

  const [entry, setEntry] = createSignal<
    Omit<TakenMedsWithNoteUser, "user"> | undefined
  >(undefined);
  const [formRef, setFormRef] = createSignal<HTMLFormElement | undefined>();
  const [error, setError] = createSignal("");
  const [time, setTime] = createSignal<string | null>("");
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
    setTime(formatTimeForPicker(medicationData()?.date) || null);
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
      showNotification(
        isEditing() ? "Medication Entry Updated" : "Medication Entry Posted"
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
      showNotification("Medication Entry Deleted");
      navigate(`/team/${params.id}/journal`);
    } else {
      console.error("Error deleting entry:", result.error);
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
    <main class="flex flex-col items-center justify-center mb-4 mx-2">
      <section class="flex flex-col w-full justify-center text-start">
        <div class="flex flex-col items-center gap-1">
          <MedicationIcon iconColor="#FE7258" bgColor="#5B0E00" />
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
          <div class="flex flex-col gap-5 text-h4">
            <Show when={(isEditing() && entry()) || !isEditing()}>
              <RadioGroupComponent
                id="takenOrMissed"
                name="takenOrMissed"
                options={["Taken", "Missed"]}
                defaultValue={
                  entry() ? (entry()?.hasMissed ? "Missed" : "Taken") : "Taken"
                }
              />
            </Show>
            <Show
              when={
                (isEditing() && med()) || (!isEditing() && medicationOptions())
              }
            >
              <div>
                <label>Select Medication</label>
                <SelectInput
                  name="medication"
                  class={twMerge("w-full p-1 rounded-lg py-4 ps-4")}
                  placeholder="Select a medication"
                  options={medicationOptions()}
                  defaultValue={med()}
                  setSelectedOption={() => {}}
                />
              </div>
            </Show>
            <div>
              <Show
                when={
                  (isEditing() && medType()) ||
                  (!isEditing() && medicationTypes)
                }
              >
                <label>Medication Type</label>
                <SelectInput
                  name="medicationType"
                  class="w-full p-1 rounded-lg py-4 ps-4 "
                  placeholder="Select a medication type"
                  options={medicationTypes}
                  defaultValue={medType()}
                  setSelectedOption={() => undefined}
                />
              </Show>
            </div>
            <div class="flex flex-col gap-2 justify-center">
              <Show when={(isEditing() && entry()) || !isEditing()}>
                <label class="text-h4">Date & Time Taken</label>
                <div class="flex flex-row gap-2 items-center">
                  <div class="flex-1">
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
                    class="flex-1"
                  />
                </div>
              </Show>
            </div>
            <Show when={(isEditing() && entry()) || !isEditing()}>
              <AddNote
                title="Additional Notes"
                placeholder="i.e. Take two tablets up to 4 times daily with food."
                content={entry()?.note?.note || ""}
              />
              <Button
                class="rounded-[100px] h-12 w-full bg-primary-purple-300 text-black"
                variant="default"
                type="submit"
              >
                Finish Entry
              </Button>
              {isEditing() && (
                <Button
                  onClick={() => setShowDeleteConfirmation(true)}
                  class="bg-transparent shadow-none font-sf-pro font-medium text-base text-error hover:bg-transparent mb-4"
                >
                  Delete Entry
                </Button>
              )}
            </Show>
          </div>
        </form>
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
      </section>
    </main>
  );
}
