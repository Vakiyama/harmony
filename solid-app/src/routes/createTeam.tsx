import GenernalInput from "~/components/shadcn/general-input";
import MedicalInput from "~/components/shadcn/medical-input";
import {
  TextField,
  TextFieldLabel,
  TextFieldRoot,
} from "~/components/ui/textfield";
import { Button } from "~/components/ui/button";
import RadioRecipient from "~/components/shadcn/radio-recipient-pick";

export default function createTeam() {
  return (
    <div class="w-full p-10">
      <div class="flex flex-col items-center">
        <h1 class="my-3">Create Team</h1>
        {/* Form to create team */}

        <TextFieldRoot class="grid grid-cols-3 items-center gap-4 md:grid-cols-4">
          <TextFieldLabel class="text-right">Team Name</TextFieldLabel>
          <TextField class="col-span-2 md:col-span-3" />
        </TextFieldRoot>

        <RadioRecipient />
        <GenernalInput />
        <MedicalInput />

        <Button>Create a team</Button>
      </div>
    </div>
  );
}
