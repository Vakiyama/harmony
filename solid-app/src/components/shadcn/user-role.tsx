import {
  RadioGroup,
  RadioGroupItem,
  RadioGroupItemControl,
  RadioGroupItemLabel,
} from "~/components/ui/radio-group";
import { For } from "solid-js";
import { useCreateTeamForm } from "~/stores/teamFormStore";

const UserRole = () => {
  const { formData, updateField, updateRecipientField } = useCreateTeamForm();

  return (
    <RadioGroup
      // defaultValue="I work in a healthcare setting"
      class="grid gap-2 my-3"
      defaultValue={formData.userRole}
    >
      <For
        each={[
          "I work in a healthcare setting",
          "I am family, a friend, or a neighbour",
          "I play another role",
        ]}
      >
        {(userRole) => (
          <RadioGroupItem
            value={userRole}
            class="flex items-center gap-2"
            onChange={(e: Event) =>
              updateField("userRole", (e.target as HTMLInputElement).value)
            }
          >
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
