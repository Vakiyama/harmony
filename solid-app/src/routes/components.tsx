import { createAsync, type RouteDefinition } from "@solidjs/router";
import { getUser, logout } from "~/api";
import AlertDialogDemo from "~/components/shadcn/AlertDialog";
import ButtonDemo from "~/components/shadcn/Button";
import CardDemo from "~/components/shadcn/Card";
import CheckboxDemo from "~/components/shadcn/CheckBox";
import DatePickerDemo from "~/components/shadcn/DatePicker";

export const route = {
  preload() {
    getUser(); // Preload user data
  },
} satisfies RouteDefinition;

export default function Components() {
  const user = createAsync(async () => getUser(), { deferStream: true });

  return (
    <div class="w-full p-10 space-y-2">
      <h1 class="flex justify-center mb-10">Components</h1>
      <div class="flex flex-direction-row">
        <div class="mr-5">
          <div class="mb-3">Date Picker</div>
          <DatePickerDemo />
        </div>
        <div class="mr-5">
          <div class="mb-3">Alert Dialog</div>
          <AlertDialogDemo />
        </div>
        <div class="mr-5">
          <div class="mb-3">Button</div>
          <ButtonDemo />
        </div>
        <div class="mr-5">
          <div class="mb-3">Card</div>
          <CardDemo />
        </div>
        <div class="mr-5">
          <div class="mb-3">Checkbox</div>
          <CheckboxDemo />
        </div>
      </div>
    </div>
  );
}
