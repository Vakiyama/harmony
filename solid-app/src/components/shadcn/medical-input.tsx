import {
  TextField,
  TextFieldLabel,
  TextFieldRoot,
} from "~/components/ui/textfield";
import GenderComboBox from "./gender-combo-box";
import PreferredLanguage from "./preferred-language";

export default function MedicalInput() {
  return (
    // <div class="w-full p-10">
    <div class="flex flex-col items-center">
      <h1>Medical Information</h1>
      <div class="grid gap-4 py-4">
        <TextFieldRoot class="grid grid-cols-3 items-center gap-4 md:grid-cols-4">
          <TextFieldLabel class="text-right">Health Condition</TextFieldLabel>
          <TextField class="col-span-2 md:col-span-3" />
        </TextFieldRoot>

        <TextFieldRoot class="grid grid-cols-3 items-center gap-4 md:grid-cols-4">
          <TextFieldLabel class="text-right">Past Injuries</TextFieldLabel>
          <TextField class="col-span-2 md:col-span-3" />
        </TextFieldRoot>

        <TextFieldRoot class="grid grid-cols-3 items-center gap-4 md:grid-cols-4">
          <TextFieldLabel class="text-right">Allegies</TextFieldLabel>
          <TextField class="col-span-2 md:col-span-3" />
        </TextFieldRoot>

        <TextFieldRoot class="grid grid-cols-3 items-center gap-4 md:grid-cols-4">
          <TextFieldLabel class="text-right">Medications</TextFieldLabel>
          <TextField class="col-span-2 md:col-span-3" />
        </TextFieldRoot>

        <TextFieldRoot class="grid grid-cols-3 items-center gap-4 md:grid-cols-4">
          <TextFieldLabel class="text-right">
            Important Surgeries
          </TextFieldLabel>
          <TextField class="col-span-2 md:col-span-3" />
        </TextFieldRoot>

        <TextFieldRoot class="grid grid-cols-3 items-center gap-4 md:grid-cols-4">
          <TextFieldLabel class="text-right">Mobility Needs</TextFieldLabel>
          <TextField class="col-span-2 md:col-span-3" />
        </TextFieldRoot>
        <TextFieldRoot class="grid grid-cols-3 items-center gap-4 md:grid-cols-4">
          <TextFieldLabel class="text-right">
            Dietary Restrictions
          </TextFieldLabel>
          <TextField class="col-span-2 md:col-span-3" />
        </TextFieldRoot>
      </div>
    </div>
    // </div>
  );
}
