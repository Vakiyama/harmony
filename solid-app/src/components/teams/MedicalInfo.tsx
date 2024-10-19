import {
  TextField,
  TextFieldLabel,
  TextFieldRoot,
} from "~/components/ui/textfield";
import MedicalDetail from "./MedicalDetail";

export default function MedicalInfo() {
  return (
    <>
      <div>
        {/* Contact Info */}
        <div>
          <p class="font-semibold text-md">Health Profile</p>

          <TextFieldRoot class="space-y-2 mt-3">
            <TextFieldLabel>Health Condition</TextFieldLabel>
            <TextField placeholder="Dementia" />
          </TextFieldRoot>

          <TextFieldRoot class="space-y-2 mt-3">
            <TextFieldLabel>Past Injuries</TextFieldLabel>
            <TextField placeholder="Hip Fractures" />
          </TextFieldRoot>

          {/* <TextFieldRoot class="space-y-2 mt-3">
            <TextFieldLabel>Allergies</TextFieldLabel>
            <TextField placeholder="List any known allergies" />
          </TextFieldRoot> */}

          {/* <TextFieldRoot class="space-y-2 mt-3">
            <TextFieldLabel>Medications</TextFieldLabel>
            <TextField placeholder="Enter current medications" />
          </TextFieldRoot> */}

          <TextFieldRoot class="space-y-2 mt-3">
            <TextFieldLabel>Important Surgeries</TextFieldLabel>
            <TextField placeholder="Hip Surgery, 2021" />
          </TextFieldRoot>

          <TextFieldRoot class="space-y-2 mt-3">
            <TextFieldLabel>Mobility Needs</TextFieldLabel>
            <TextField placeholder="Requires walking cane " />
          </TextFieldRoot>

          <TextFieldRoot class="space-y-2 mt-3">
            <TextFieldLabel>Dietary Restrictions/Preference</TextFieldLabel>
            <TextField placeholder="Must have 85g protein each meal" />
          </TextFieldRoot>
        </div>
        <div class="mt-16">
          <p class="font-semibold text-md">Medication Details</p>

          <MedicalDetail
            medicineName="Advil"
            medicineDose="200mg"
            medicineInstructions="take after a meal"
            medicineLink="/components"
          />
          <MedicalDetail
            medicineName="Vyvanse"
            medicineDose="10mg"
            medicineInstructions="taken with water"
            medicineLink="/components"
          />
        </div>
      </div>
    </>
  );
}
