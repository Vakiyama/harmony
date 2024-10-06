import type { AlertDialogTriggerProps } from "@kobalte/core/alert-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";

const AlertDialogDemo = () => {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        as={(props: AlertDialogTriggerProps) => (
          <Button
            variant="outline"
            className="border border-gray-300 rounded-md p-2 hover:bg-gray-100" // Tailwind styles for the button
            {...props}
          >
            Show Dialog
          </Button>
        )}
      />
      <AlertDialogContent class="bg-white p-6 rounded-md shadow-lg max-w-md mx-auto">
        <AlertDialogHeader class="mb-4">
          <AlertDialogTitle class="text-lg font-bold text-gray-900">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription class="text-gray-600">
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter class="flex justify-end space-x-4">
          <AlertDialogClose class="px-4 py-2 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300">
            Cancel
          </AlertDialogClose>
          <AlertDialogAction class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertDialogDemo;
