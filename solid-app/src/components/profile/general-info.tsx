import {
  TextField,
  TextFieldLabel,
  TextFieldRoot,
} from "~/components/ui/textfield";

export default function GeneralInfo() {
  return (
    <>
      <div>
        {/* Contact Info */}
        <div>
          <p class="font-semibold text-md">Contact Information</p>

          <TextFieldRoot class="space-y-2 mt-3">
            <TextFieldLabel>Phone Number</TextFieldLabel>
            <TextField placeholder="778-123-4567" />
          </TextFieldRoot>

          <TextFieldRoot class="space-y-2 mt-3">
            <TextFieldLabel>Email</TextFieldLabel>
            <TextField placeholder="email@here.com" />
          </TextFieldRoot>
        </div>
        {/* Overview */}
        <div class="mt-8">
          <p class="font-semibold text-md">Overview</p>

          <TextFieldRoot class="space-y-2 mt-3">
            <TextFieldLabel>Gender</TextFieldLabel>
            <TextField placeholder="Female" />
          </TextFieldRoot>

          <TextFieldRoot class="space-y-2 mt-3">
            <TextFieldLabel>Preferred Language</TextFieldLabel>
            <TextField placeholder="Tagalog" />
          </TextFieldRoot>

          <TextFieldRoot class="space-y-2 mt-3">
            <TextFieldLabel>Lives With</TextFieldLabel>
            <TextField placeholder="Daughter" />
          </TextFieldRoot>

          <TextFieldRoot class="space-y-2 mt-3">
            <TextFieldLabel>Employment</TextFieldLabel>
            <TextField placeholder="Retired" />
          </TextFieldRoot>
        </div>
      </div>
    </>
  );
}
