import { RadioGroupContext } from "@ark-ui/solid";
import { createAsync, type RouteDefinition } from "@solidjs/router";
import { getUser, logout } from "~/api";
import AlertDialogDemo from "~/components/shadcn/AlertDialog";
import ButtonDemo from "~/components/shadcn/Button";
import CardDemo from "~/components/shadcn/Card";
import CheckboxDemo from "~/components/shadcn/CheckBox";
import DatePickerDemo from "~/components/shadcn/DatePicker";
import DialogDemo from "~/components/shadcn/Dialog";
import ImageDemo from "~/components/shadcn/Image";
import RadioGroupDemo from "~/components/shadcn/RadioGroup";
import SelectDemo from "~/components/shadcn/Select";
import SeparatorDemo from "~/components/shadcn/Separator";
import SkeletonDemo from "~/components/shadcn/Skelaton";

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
      <div class="flex flex-wrap justify-center gap-5">
        <div class="mr-5 w-full sm:w-auto">
          <div class="mb-3">Date Picker</div>
          <DatePickerDemo />
        </div>
        <div class="mr-5 w-full sm:w-auto">
          <div class="mb-3">Alert Dialog</div>
          <AlertDialogDemo />
        </div>
        <div class="mr-5 w-full sm:w-auto">
          <div class="mb-3">Button</div>
          <ButtonDemo />
        </div>
        <div class="mr-5 w-full sm:w-auto">
          <div class="mb-3">Card</div>
          <CardDemo />
        </div>
        <div class="mr-5 w-full sm:w-auto">
          <div class="mb-3">Checkbox</div>
          <CheckboxDemo />
        </div>
        <div class="mr-5 w-full sm:w-auto">
          <div class="mb-3">Dialog</div>
          <DialogDemo />
        </div>
        <div class="mr-5 w-full sm:w-auto">
          <div class="mb-3">Image</div>
          <ImageDemo />
        </div>
        <div class="mr-5 w-full sm:w-auto">
          <div class="mb-3">Radio Group</div>
          <RadioGroupDemo />
        </div>
        <div class="mr-5 w-full sm:w-auto">
          <div class="mb-3">Select</div>
          <SelectDemo />
        </div>
        <div class="mr-5 w-full sm:w-auto">
          <div class="mb-3">Separator</div>
          <SeparatorDemo />
        </div>
        <div class="mr-5 w-full sm:w-auto">
          <div class="mb-3">Skeleton</div>
          <SkeletonDemo />
        </div>
      </div>
    </div>
  );
}
