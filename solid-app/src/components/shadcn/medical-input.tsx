import {
  TextField,
  TextFieldLabel,
  TextFieldRoot,
} from "~/components/ui/textfield";
import { formData, setFormData } from "~/stores/teamFormStore";

export default function MedicalInput() {
  const handleInputChange =
    (field: keyof typeof formData.medicalInfo) => (e: Event) => {
      setFormData("medicalInfo", field, (e.target as HTMLInputElement).value);
    };
  return (
    // <div class="w-full p-10">
    <div class="flex flex-col items-center">
      <h1>Medical Information</h1>
      <div class="grid gap-4 py-4">
        <TextFieldRoot class="grid grid-cols-3 items-center gap-4 md:grid-cols-4">
          <TextFieldLabel class="text-right">Health Condition</TextFieldLabel>
          <TextField
            class="col-span-2 md:col-span-3"
            value={formData.medicalInfo.healthCondition}
            onChange={handleInputChange("healthCondition")}
          />
        </TextFieldRoot>

        <TextFieldRoot class="grid grid-cols-3 items-center gap-4 md:grid-cols-4">
          <TextFieldLabel class="text-right">Past Injuries</TextFieldLabel>
          <TextField
            class="col-span-2 md:col-span-3"
            value={formData.medicalInfo.pastInjuries}
            onChange={handleInputChange("pastInjuries")}
          />
        </TextFieldRoot>

        <TextFieldRoot class="grid grid-cols-3 items-center gap-4 md:grid-cols-4">
          <TextFieldLabel class="text-right">Allegies</TextFieldLabel>
          <TextField
            class="col-span-2 md:col-span-3"
            value={formData.medicalInfo.allergies}
            onChange={handleInputChange("allergies")}
          />
        </TextFieldRoot>

        <TextFieldRoot class="grid grid-cols-3 items-center gap-4 md:grid-cols-4">
          <TextFieldLabel class="text-right">Medications</TextFieldLabel>
          <TextField
            class="col-span-2 md:col-span-3"
            value={formData.medicalInfo.medications}
            onChange={handleInputChange("medications")}
          />
        </TextFieldRoot>

        <TextFieldRoot class="grid grid-cols-3 items-center gap-4 md:grid-cols-4">
          <TextFieldLabel class="text-right">
            Important Surgeries
          </TextFieldLabel>
          <TextField
            class="col-span-2 md:col-span-3"
            value={formData.medicalInfo.importantSurgeries}
            onChange={handleInputChange("importantSurgeries")}
          />
        </TextFieldRoot>

        <TextFieldRoot class="grid grid-cols-3 items-center gap-4 md:grid-cols-4">
          <TextFieldLabel class="text-right">Mobility Needs</TextFieldLabel>
          <TextField
            class="col-span-2 md:col-span-3"
            value={formData.medicalInfo.mobilityNeeds}
            onChange={handleInputChange("mobilityNeeds")}
          />
        </TextFieldRoot>
        <TextFieldRoot class="grid grid-cols-3 items-center gap-4 md:grid-cols-4">
          <TextFieldLabel class="text-right">
            Dietary Restrictions
          </TextFieldLabel>
          <TextField
            class="col-span-2 md:col-span-3"
            value={formData.medicalInfo.dietaryRestrictions}
            onChange={handleInputChange("dietaryRestrictions")}
          />
        </TextFieldRoot>
      </div>
    </div>
    // </div>
  );
}
