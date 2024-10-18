import { createServerAction$ } from "solid-start/server";
import GeneralInput from "~/components/shadcn/general-input";
import MedicalInput from "~/components/shadcn/medical-input";
import { Button } from "~/components/ui/button";
import RadioRecipient from "~/components/shadcn/radio-recipient-pick";
import UserRole from "~/components/shadcn/user-role";
import TeamRole from "~/components/shadcn/team-role";
import TeamName from "~/components/shadcn/team-name-input";
import { createTeamAction } from "./api/team/create-team-action";
import { useCreateTeamForm } from "~/stores/teamFormStore";
import { createSignal } from "solid-js";
import { useAction } from "@solidjs/router";

export default function CreateTeamForm() {
  const { formData, updateField, updateRecipientField } = useCreateTeamForm();
  const [error, setError] = createSignal("");
  const myAction = useAction(createTeamAction);

  // handle the form
  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();

    const result = await myAction(formData);
    console.log(result);
    if (result.success === true) {
      setError("");
      console.log("Team created successfully");
    } else {
      setError(result.message);
    }
    console.log(result);
  };

  return (
    <div class="w-full p-10">
      <div class="flex flex-col items-center">
        <form onSubmit={handleSubmit} method="post">
          <h1 class="my-3">Create Team</h1>
          {/* Form to create team */}
          <TeamName />
          {/* <RadioRecipient /> */}
          <GeneralInput />
          {/* <MedicalInput /> */}
          <UserRole />
          <TeamRole />
          {/* <Button type="submit" disabled={creating.pending}>
            {creating.pending ? "Creating..." : "Create a team"}
          </Button> */}
          <Button type="submit">Create a team</Button>
        </form>
      </div>
    </div>
  );
}
