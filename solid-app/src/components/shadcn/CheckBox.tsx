import {
  Checkbox,
  CheckboxControl,
  CheckboxLabel,
} from "~/components/ui/checkbox";

const CheckboxDemo = () => {
  return (
    <div class="flex items-center">
      <Checkbox class="flex items-center space-x-2">
        <CheckboxControl class="h-4 w-4 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 checked:bg-blue-600 checked:border-transparent" />
        <CheckboxLabel class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Accept terms and conditions
        </CheckboxLabel>
      </Checkbox>
    </div>
  );
};

export default CheckboxDemo;
