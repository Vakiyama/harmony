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
import SwitchDemo from "~/components/shadcn/Switch";
import TableDemo from "~/components/shadcn/Table";
import TabsDemo from "~/components/shadcn/Tabs";
import ToastComponent from "~/components/shadcn/Toast";

export default function Components() {
  return (
    <div class="w-full p-10 space-y-2">
      <h1 class="flex justify-center mb-10">Components</h1>
      <div class="flex flex-wrap gap-5">
        <div class="mr-5 w-full sm:w-auto mb-10">
          <div class="mb-3">Date Picker</div>
          <DatePickerDemo />
        </div>
        <div class="mr-5 w-full sm:w-auto mb-10">
          <div class="mb-3">Alert Dialog</div>
          <AlertDialogDemo />
        </div>
        <div class="mr-5 w-full sm:w-auto mb-10">
          <div class="mb-3">Button</div>
          <ButtonDemo />
        </div>

        <div class="mr-5 w-full sm:w-auto mb-10">
          <div class="mb-3">Checkbox</div>
          <CheckboxDemo />
        </div>
        <div class="mr-5 w-full sm:w-auto mb-10">
          <div class="mb-3">Dialog</div>
          <DialogDemo />
        </div>
        <div class="mr-5 w-full sm:w-auto mb-10">
          <div class="mb-3">Image</div>
          <ImageDemo />
        </div>
        <div class="mr-5 w-full sm:w-auto mb-10">
          <div class="mb-3">Radio Group</div>
          <RadioGroupDemo id="demo" name="demo" options={["1", "2", "3"]}/>
        </div>
        <div class="mr-5 w-full sm:w-auto mb-10">
          <div class="mb-3">Select</div>
          <SelectDemo options={["1", "2", "3"]} placeholder="demo"/>
        </div>
        <div class="mr-5 w-full sm:w-auto mb-10">
          <div class="mb-3">Separator</div>
          <SeparatorDemo />
        </div>
        <div class="mr-5 w-full sm:w-auto mb-10">
          <div class="mb-3">Skeleton</div>
          <SkeletonDemo />
        </div>
        <div class="mr-5 w-full sm:w-auto mb-10">
          <div class="mb-3">Toast</div>
          <ToastComponent title="demo" description="demo" buttonLabel="Demo"/>
        </div>
        <div class="mr-5 w-full sm:w-auto mb-10">
          <div class="mb-3">Switch</div>
          <SwitchDemo />
        </div>
        <div class="mr-5 w-full sm:w-auto mb-10">
          <div class="mb-3">Tabs</div>
          <TabsDemo />
        </div>
        <div class="mr-5 w-full sm:w-auto mb-10">
          <div class="mb-3">Table</div>
          <TableDemo />
        </div>
        <div class="mr-5 w-full sm:w-auto mb-10">
          <div class="mb-3">Card</div>
          <CardDemo />
        </div>
      </div>
    </div>
  );
}
