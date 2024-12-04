import { useAction } from "@solidjs/router";
import { createSignal, For, onMount, Setter } from "solid-js";
import { uploadPhotoAction } from "~/api/team";
import TextFieldLine from "~/components/shared/text-field-line";
import AddPhoto from "~/components/team/tab-upload-photo";
import { Button } from "~/components/ui/button";
import { FormState, useTeam } from "~/context/team-context";

const formFields: Array<{
  name: string;
  label: string;
  placeholder: string;
  required: boolean;
}> = [
  {
    name: "name",
    label: "Medication Name",
    placeholder: "Medication Name",
    required: true,
  },
  {
    name: "typeOfMedication",
    label: "Type of Medication",
    placeholder: "e.g. Oral Pill",
    required: false,
  },
  {
    name: "dosage",
    label: "Dosage",
    placeholder: "e.g. 100mg",
    required: true,
  },
  {
    name: "frequency",
    label: "Frequency",
    placeholder: "e.g. Twice a Day",
    required: true,
  },
  {
    name: "schedule",
    label: "Medication Schedule",
    placeholder: "e.g. Morning and Night",
    required: true,
  },
  {
    name: "instructions",
    label: "Instructions",
    placeholder: "Instructions for Medication",
    required: false,
  },
  {
    name: "sideEffects",
    label: "Side Effects",
    placeholder: "Medication Side Effects",
    required: false,
  },
  {
    name: "pharmacyInfo",
    label: "Pharmacy Information",
    placeholder: "Insert Pharmacy Contact address or contact",
    required: false,
  },
];

export default function MedicationDetails({
  onMedicationAdded,
}: {
  onMedicationAdded: () => void;
}) {
  const team = useTeam();
  const [error, setError] = createSignal<{ [key: string]: string } | null>(
    null
  );
  const [localMedication, setLocalMedication] = createSignal({
    schedule: "",
    instructions: "",
    name: "",
    dosage: "",
    frequency: "",
    typeOfMedication: "",
    sideEffects: "",
    pharmacyInfo: "",
    pharmacyImg: "",
  });
  const [previewUrl, setPreviewUrl] = createSignal<string | null>(null);
  const [selectedFile, setSelectedFile] = createSignal<File | null>(null);
  const photoAction = useAction(uploadPhotoAction);

  const handleFileChange = async (e: Event) => {
    const fileInput = e.target as HTMLInputElement;
    if (fileInput?.files?.[0]) {
      const file = fileInput.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setError((prev) => ({
          ...prev,
          pharmacyImg: "File size exceeds 5MB. Please choose a smaller file",
        }));
        return;
      }
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setPreviewUrl(previewUrl);
      setLocalMedication((prev) => ({
        ...prev,
        pharmacyImg: previewUrl,
      }));
    }
  };

  const handleAddMedication = async () => {
    setError(null);
    let fieldErrors: { [key: string]: string } = {};

    if (!localMedication().name) {
      fieldErrors["name"] = "Medication name is required";
    }
    if (!localMedication().dosage) {
      fieldErrors["dosage"] = "Medication dosage is required";
    }
    if (!localMedication().frequency) {
      fieldErrors["frequency"] = "Medication frequency is required";
    }
    if (!localMedication().schedule) {
      fieldErrors["schedule"] = "Medication schedule is required";
    }
    if (!localMedication().pharmacyImg) {
      fieldErrors["pharmacyImg"] = "Please select a photo for the pharmacy";
    }

    if (Object.keys(fieldErrors).length) {
      setError(fieldErrors);
      return;
    }

    const file = selectedFile();
    if (!file) {
      // setError("Please select a file");
      return;
    }
    const formData = new FormData();
    formData.append("photo", file);

    try {
      const result = await photoAction(formData);
      if (result.error) {
        setError({ pharmaycyImg: result.error });
        return;
      }
      setLocalMedication((prev) => ({
        ...prev,
        pharmacyImg: result,
      }));
      // setIsUploading(true);

      team.addMedication();
      const currentMedicationIndex = team.state.medications.length - 1;
      Object.keys(localMedication()).forEach((key) => {
        team.updateMedication(
          currentMedicationIndex,
          key as keyof FormState["medications"][0],
          localMedication()[key as keyof typeof localMedication]
        );
      });
      onMedicationAdded();
      setLocalMedication({
        schedule: "",
        instructions: "",
        name: "",
        dosage: "",
        frequency: "",
        typeOfMedication: "",
        sideEffects: "",
        pharmacyInfo: "",
        pharmacyImg: "",
      });
      setPreviewUrl(null);
      setSelectedFile(null);
    } catch (err) {
      console.error("Upload error:", err);
      setError({ pharmacyImg: "Faile to upload image" });
    } finally {
      setPreviewUrl(null);
      setSelectedFile(null);
      setError(null);
    }
  };

  return (
    <>
      {/* Health profile part */}
      <div class="flex items-center justify-start flex-col h-full mt-4 mx-3">
        <p class="self-start text-h2 font-grotesque leading-[120%] font-medium">
          Medication Details
        </p>
        <div class="w-full">
          {/* Render surgery input fields */}
          <For each={formFields}>
            {(field, index) => {
              return (
                <>
                  <TextFieldLine
                    name={field.name}
                    label={field.label}
                    onInput={(e) => {
                      setLocalMedication((prev) => ({
                        ...prev,
                        [field.name]: e.currentTarget.value,
                      }));
                    }}
                    placeholder={field.placeholder}
                    classRoot={(index() === 0 ? "mt-3" : "mt-6") + " space-y-0"}
                    classLabel="text-h4 font-grotesque leading-[120%] inline-block mb-2"
                    required={field.required}
                  />
                  {error()?.[field.name] ? (
                    <div class="text-red-600 text-sm mt-1">
                      {error()?.[field.name]}
                    </div>
                  ) : null}
                </>
              );
            }}
          </For>
          <p class="text-h4 font-grotesque leading-[120%] mb-2 mt-6">
            Medication Photo
          </p>
          {/* <AddPhoto medicationIndex={team.state.medications.length - 1} /> */}

          <div class="border-[1px] border-photoBoxGray w-full h-[310px] rounded-[8px] mt-6 flex flex-col justify-center ">
            <label
              for="photo-upload"
              class="flex flex-col h-full items-center justify-center"
            >
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                name="photo"
                hidden
                onChange={handleFileChange}
              />

              {previewUrl() ? (
                <img
                  src={previewUrl() || ""}
                  alt="Preview"
                  class="w-auto h-full rounded-[8px]"
                />
              ) : (
                <>
                  <svg
                    width="16"
                    height="14"
                    viewBox="0 0 16 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    class="mb-[5px]"
                  >
                    <path
                      d="M0.00201416 2C0.00201416 1.46957 0.212728 0.960859 0.587801 0.585786C0.962873 0.210714 1.47158 0 2.00201 0H14.002C14.5324 0 15.0412 0.210714 15.4162 0.585786C15.7913 0.960859 16.002 1.46957 16.002 2V12C16.002 12.5304 15.7913 13.0391 15.4162 13.4142C15.0412 13.7893 14.5324 14 14.002 14H2.00201C1.47158 14 0.962873 13.7893 0.587801 13.4142C0.212728 13.0391 0.00201416 12.5304 0.00201416 12V2ZM1.00201 11V12C1.00201 12.2652 1.10737 12.5196 1.29491 12.7071C1.48244 12.8946 1.7368 13 2.00201 13H14.002C14.2672 13 14.5216 12.8946 14.7091 12.7071C14.8967 12.5196 15.002 12.2652 15.002 12V8.5L11.225 6.553C11.1312 6.50602 11.0251 6.48973 10.9215 6.50642C10.818 6.52311 10.7223 6.57194 10.648 6.646L6.93801 10.356L4.27801 8.584C4.18197 8.52006 4.06678 8.4913 3.95195 8.5026C3.83713 8.5139 3.72975 8.56456 3.64801 8.646L1.00201 11ZM6.00201 4.5C6.00201 4.10218 5.84398 3.72064 5.56267 3.43934C5.28137 3.15804 4.89984 3 4.50201 3C4.10419 3 3.72266 3.15804 3.44135 3.43934C3.16005 3.72064 3.00201 4.10218 3.00201 4.5C3.00201 4.89782 3.16005 5.27936 3.44135 5.56066C3.72266 5.84196 4.10419 6 4.50201 6C4.89984 6 5.28137 5.84196 5.56267 5.56066C5.84398 5.27936 6.00201 4.89782 6.00201 4.5Z"
                      fill="#5A5A5A"
                    />
                  </svg>
                  <p class="text-subtitle13 text-photoBoxLabel">
                    Tab to add a photo
                  </p>
                </>
              )}
            </label>
          </div>
        </div>
        {/* Button */}
        <div class="flex flex-col justify-end w-full flex-grow">
          <Button
            onClick={handleAddMedication}
            class="rounded-full w-full bg-primary-purple-300 text-black text-base h-12 mt-6 mb-[46px]"
          >
            Add Medication
          </Button>
        </div>
      </div>
    </>
  );
}
