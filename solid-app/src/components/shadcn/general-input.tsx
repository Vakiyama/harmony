import {
  TextField,
  TextFieldLabel,
  TextFieldRoot,
} from "~/components/ui/textfield";
import GenderComboBox from "./gender-combo-box";
import PreferredLanguage from "./preferred-language";

export default function GenernalInput() {
  return (
    // <div class="w-full p-10">
    <div class="flex flex-col items-center mt-5">
      <h1>General Information</h1>
      {/* Form to create team */}
      <div class="grid gap-4 py-4">
        {/* Contact */}
        <TextFieldRoot class="grid grid-cols-3 items-center gap-4 md:grid-cols-4">
          <TextFieldLabel class="text-right">Name</TextFieldLabel>
          <TextField class="col-span-2 md:col-span-3" />
        </TextFieldRoot>
        <TextFieldRoot class="grid grid-cols-3 items-center gap-4 md:grid-cols-4">
          <TextFieldLabel class="text-right">Email</TextFieldLabel>
          <TextField class="col-span-2 md:col-span-3" />
        </TextFieldRoot>
        <TextFieldRoot class="grid grid-cols-3 items-center gap-4 md:grid-cols-4">
          <TextFieldLabel class="text-right">Phone number</TextFieldLabel>
          <TextField class="col-span-2 md:col-span-3" />
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
          <TextField class="col-span-2 md:col-span-3" />
        </TextFieldRoot>
        <TextFieldRoot class="grid grid-cols-3 items-center gap-4 md:grid-cols-4">
          <TextFieldLabel class="text-right">Hometown</TextFieldLabel>
          <TextField class="col-span-2 md:col-span-3" />
        </TextFieldRoot>
        <TextFieldRoot class="grid grid-cols-3 items-center gap-4 md:grid-cols-4">
          <TextFieldLabel class="text-right">Employment</TextFieldLabel>
          <TextField class="col-span-2 md:col-span-3" />
        </TextFieldRoot>
      </div>
    </div>
    // </div>
  );
}
