import {
  RadioGroup,
  RadioGroupItem,
  RadioGroupItemControl,
  RadioGroupItemLabel,
} from "~/components/ui/radio-group";
import { For } from "solid-js";
import { useCreateTeamForm } from "~/stores/teamFormStore";

const TeamRole = () => {
  const { formData, updateField, updateRecipientField } = useCreateTeamForm();

  return (
    <RadioGroup defaultValue={formData.teamRole} class="grid gap-2 my-3">
      <For each={["Admin", "Member"]}>
        {(teamRole) => (
          <RadioGroupItem
            value={teamRole}
            class="flex items-center gap-2"
            onChange={(e: Event) =>
              updateField("teamRole", (e.target as HTMLInputElement).value)
            }
          >
            <RadioGroupItemControl class="h-4 w-4 border border-gray-300 rounded-full checked:bg-black-600 checked:border-transparent" />
            <RadioGroupItemLabel class="text-sm text-gray-700 hover:text-blue-600 cursor-pointer">
              {teamRole}
            </RadioGroupItemLabel>
          </RadioGroupItem>
        )}
      </For>
    </RadioGroup>
  );
};

export default TeamRole;
