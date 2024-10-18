import {
  TextField,
  TextFieldLabel,
  TextFieldRoot,
} from "~/components/ui/textfield";
import GenderComboBox from "./gender-combo-box";
import PreferredLanguage from "./preferred-language";
import { useCreateTeamForm } from "~/stores/teamFormStore";

export default function GeneralInput() {
  const { formData, updateField, updateRecipientField } = useCreateTeamForm();

  return (
    // <div class="w-full p-10">
    <div class="flex flex-col items-center mt-5">
      <h1>General Information</h1>
      {/* Form to create team */}
      <div class="grid gap-4 py-4">
        {/* Contact */}
        <TextFieldRoot class="grid grid-cols-3 items-center gap-4 md:grid-cols-4">
          <TextFieldLabel class="text-right">First Name</TextFieldLabel>
          <TextField
            class="col-span-2 md:col-span-3"
            value={formData.recipient.firstName}
            onInput={(e) => {
              updateRecipientField(
                "firstName",
                (e.target as HTMLInputElement).value
              );
            }}
          />
        </TextFieldRoot>
        <TextFieldRoot class="grid grid-cols-3 items-center gap-4 md:grid-cols-4">
          <TextFieldLabel class="text-right">Last Name</TextFieldLabel>
          <TextField
            class="col-span-2 md:col-span-3"
            value={formData.recipient.lastName}
            onInput={(e) => {
              updateRecipientField(
                "lastName",
                (e.target as HTMLInputElement).value
              );
            }}
          />
        </TextFieldRoot>
        <TextFieldRoot class="grid grid-cols-3 items-center gap-4 md:grid-cols-4">
          <TextFieldLabel class="text-right">Email</TextFieldLabel>
          <TextField
            class="col-span-2 md:col-span-3"
            value={formData.recipient.email}
            onInput={(e) => {
              updateRecipientField(
                "email",
                (e.target as HTMLInputElement).value
              );
            }}
          />
        </TextFieldRoot>
        <TextFieldRoot class="grid grid-cols-3 items-center gap-4 md:grid-cols-4">
          <TextFieldLabel class="text-right">Phone number</TextFieldLabel>
          <TextField
            class="col-span-2 md:col-span-3"
            value={formData.recipient.phoneNumber}
            onInput={(e) => {
              updateRecipientField(
                "phoneNumber",
                (e.target as HTMLInputElement).value
              );
            }}
          />
        </TextFieldRoot>

        {/* Gender field */}
        <TextFieldRoot class="grid grid-cols-3 items-center gap-4 md:grid-cols-4">
          <TextFieldLabel class="text-right">Gender</TextFieldLabel>
          <GenderComboBox />
        </TextFieldRoot>

        {/* Language field */}
        <TextFieldRoot class="grid grid-cols-3 items-center gap-4 md:grid-cols-4">
          <TextFieldLabel class="text-right">Preferred Language</TextFieldLabel>
          <PreferredLanguage />
        </TextFieldRoot>

        <TextFieldRoot class="grid grid-cols-3 items-center gap-4 md:grid-cols-4">
          <TextFieldLabel class="text-right">Lives with</TextFieldLabel>
          <TextField
            class="col-span-2 md:col-span-3"
            value={formData.recipient.livesWith}
            onInput={(e) => {
              updateRecipientField(
                "livesWith",
                (e.target as HTMLInputElement).value
              );
            }}
          />
        </TextFieldRoot>
        <TextFieldRoot class="grid grid-cols-3 items-center gap-4 md:grid-cols-4">
          <TextFieldLabel class="text-right">Hometown</TextFieldLabel>
          <TextField
            class="col-span-2 md:col-span-3"
            value={formData.recipient.hometown}
            onInput={(e) => {
              updateRecipientField(
                "hometown",
                (e.target as HTMLInputElement).value
              );
            }}
          />
        </TextFieldRoot>
        <TextFieldRoot class="grid grid-cols-3 items-center gap-4 md:grid-cols-4">
          <TextFieldLabel class="text-right">Employment</TextFieldLabel>
          <TextField
            class="col-span-2 md:col-span-3"
            value={formData.recipient.employment}
            onInput={(e) => {
              updateRecipientField(
                "employment",
                (e.target as HTMLInputElement).value
              );
            }}
          />
        </TextFieldRoot>
      </div>
    </div>
    // </div>
  );
}
