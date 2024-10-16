import {
  RadioGroup,
  RadioGroupItem,
  RadioGroupItemControl,
  RadioGroupItemLabel,
} from "~/components/ui/radio-group";
import { For } from "solid-js";

const UserRole = () => {
  return (
    <RadioGroup
      defaultValue="I work in a healthcare setting"
      class="grid gap-2 my-3"
    >
      <For
        each={[
          "I work in a healthcare setting",
          "I am family, a friend, or a neighbour",
          "I play another role",
        ]}
      >
        {(userRole) => (
          <RadioGroupItem value={userRole} class="flex items-center gap-2">
            <RadioGroupItemControl class="h-4 w-4 border border-gray-300 rounded-full checked:bg-black-600 checked:border-transparent" />
            <RadioGroupItemLabel class="text-sm text-gray-700 hover:text-blue-600 cursor-pointer">
              {userRole}
            </RadioGroupItemLabel>
          </RadioGroupItem>
        )}
      </For>
    </RadioGroup>
  );
};

export default UserRole;
