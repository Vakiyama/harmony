import type { DialogTriggerProps } from "@kobalte/core/dialog";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  TextField,
  TextFieldLabel,
  TextFieldRoot,
} from "~/components/ui/textfield";

const DialogDemo = () => {
  return (
    <Dialog>
      <DialogTrigger
        as={(props: DialogTriggerProps) => (
          <Button
            variant="outline"
            class="border border-gray-300 hover:border-gray-500 p-2 rounded-md"
            {...props}
          >
            Edit Profile
          </Button>
        )}
      />
      <DialogContent class="fixed inset-0 flex items-center justify-center">
        <div class="sm:max-w-[425px] bg-white rounded-lg shadow-lg p-6">
          <DialogHeader>
            <DialogTitle class="text-lg font-semibold">
              Edit Profile
            </DialogTitle>
            <DialogDescription class="text-sm text-gray-500">
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div class="grid gap-4 py-4">
            <TextFieldRoot class="grid grid-cols-3 items-center gap-4 md:grid-cols-4">
              <TextFieldLabel class="text-right font-medium">
                Name
              </TextFieldLabel>
              <TextField class="col-span-2 md:col-span-3 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </TextFieldRoot>
            <TextFieldRoot class="grid grid-cols-3 items-center gap-4 md:grid-cols-4">
              <TextFieldLabel class="text-right font-medium">
                Username
              </TextFieldLabel>
              <TextField class="col-span-2 md:col-span-3 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </TextFieldRoot>
          </div>
          <DialogFooter class="flex justify-end">
            <Button
              type="submit"
              class="bg-blue-600 text-white hover:bg-blue-700 p-2 border-gray-300 rounded-md border"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogDemo;
