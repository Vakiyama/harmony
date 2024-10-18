import { createSignal } from "solid-js";
import {
  TextField,
  TextFieldLabel,
  TextFieldRoot,
} from "~/components/ui/textfield";
import { useCreateTeamForm } from "~/stores/teamFormStore";

export default function TeamName() {
  const { formData, updateField, updateRecipientField } = useCreateTeamForm();

  return (
    <TextFieldRoot class="grid grid-cols-3 items-center gap-4 md:grid-cols-4">
      <TextFieldLabel class="text-right">Team Name</TextFieldLabel>
      <TextField
        class="col-span-2 md:col-span-3"
        value={formData.teamName}
        onInput={(e) =>
          updateField("teamName", (e.target as HTMLInputElement).value)
        }
      />
    </TextFieldRoot>
  );
}
