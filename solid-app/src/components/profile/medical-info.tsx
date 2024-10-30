import {
  TextField,
  TextFieldLabel,
  TextFieldRoot,
} from "~/components/ui/textfield";
import MedicalDetail from "./medical-detail";
import TextFieldLine from "../shared/TextFieldLine";

export default function MedicalInfo() {
  const fields = [
    { label: "Heath Conditions", value: "Dementia" },
    { label: "PastInjuries", value: "Hip Fractures" },
    { label: "Important Surgeries", value: "Hip Surgery, 2021" },
    { label: "Mobility Needs", value: "Requires walking cane" },
    {
      label: "Dietary Restrictions/Preference",
      value: "Must have 85g protein each meal",
    },
  ];

  return (
    <>
      <div>
        {/* Medical Info */}
        <div>
          <p class="font-semibold text-md">Health Profile</p>
          {fields.map(({ label, value }, index) => (
            <TextFieldLine key={index} label={label} value={value} />
          ))}
        </div>
        <div class="mt-16">
          <p class="font-semibold text-md">Medication Details</p>

          <MedicalDetail
            medicineName="Advil"
            medicineDose="200mg"
            medicineInstructions="take after a meal"
            medicineLink="/profile/med-detail"
          />
          <MedicalDetail
            medicineName="Vyvanse"
            medicineDose="10mg"
            medicineInstructions="taken with water"
            medicineLink="/profile/med-detail"
          />
        </div>
      </div>
    </>
  );
}
