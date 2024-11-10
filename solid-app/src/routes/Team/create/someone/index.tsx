import { A, useAction } from "@solidjs/router";
import TeamTopNav from "~/components/team/team-top-nav";
import { Button } from "~/components/ui/button";
import UploadPhoto from "../../../../components/team/upload-photo";
import { createEffect, createSignal, For, Show } from "solid-js";
import UserInfo1 from "../../../../components/team/user-info-1";
import UserInfo2 from "../../../../components/team/user-info-2";
import UserHealth1 from "../../../../components/team/user-health-1";
import UserHealth2 from "../../../../components/team/user-health-2";
import AddMedication from "../../../../components/team/add-medication";
import AboutUser from "../../../../components/team/about-user";
import UserTypePick from "../../../../components/team/user-type-pick";
import aiButton from "~/components/svg/ai-icon";
import { useTeam } from "~/context/team-context";
import { createServerAction$ } from "solid-start/server";
import { db } from "~/api/db";
import { recipients } from "../../../../../drizzle/schema/Recipients";
import { teams } from "../../../../../drizzle/schema/Teams";
import { importantSurgeries } from "../../../../../drizzle/schema/ImportantSurgeries";
import { medications } from "../../../../../drizzle/schema/Medications";
import {
  createMedicationAction,
  createRecipientAction,
  createSurgeryAction,
  createTeamAction,
} from "~/api/team";
import {
  TextField,
  TextFieldLabel,
  TextFieldRoot,
} from "~/components/ui/textfield";
import UserRole from "../../../../components/team/user-role";
import TeamUserRole from "../../../../components/team/team-user-role";

type CreateRecipientActionResponse = {
  success?: boolean;
  error?: string;
  recipientId?: number;
  message?: string;
};

type CreateTeamActionResponse = {
  success?: boolean;
  error?: string;
  teamId?: number;
  message?: string;
};

type CreateSurgeryActionResponse = {
  success?: boolean;
  error?: string;
  message?: string;
};

type CreateMedicationActionResponse = {
  success?: boolean;
  error?: string;
  message?: string;
};

export default function CreateSomeone() {
  const [error, setError] = createSignal<string | null>(null);
  const [creating, setCreating] = createSignal(false);
  const team = useTeam();

  const recipientAction = useAction(createRecipientAction);

  const teamAction = useAction(createTeamAction);
  const surgeryAction = useAction(createSurgeryAction);
  const medicationAction = useAction(createMedicationAction);

  const handleNext = () => {
    if (team.currentStep() === 1 && !team.state.recipient.firstName) {
      setError("Please enter the recipient's name");
      return;
    }
    setError(null);
    team.nextStep();
  };

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    setCreating(true);
    try {
      // create recipient
      const recipientResult = (await recipientAction({
        recipientInput: team.state.recipient,
      })) as CreateRecipientActionResponse;

      if (!recipientResult.success || !recipientResult.recipientId) {
        throw new Error(recipientResult.error || "Failed to create recipient");
        // TODO: show error message notification
      }
      // TODO: show success message notificaition

      // create team
      const teamResult = (await teamAction({
        teamInput: {
          teamName: team.state.teamName,
          recipientId: recipientResult.recipientId,
        },
      })) as CreateTeamActionResponse;

      if (!teamResult.success || !teamResult.teamId) {
        throw new Error(teamResult.error || "Failed to create team");
        // TODO: show error message notification
      }
      // TODO: show success message notificaition

      // create important surgeries
      if (team.state.importantSurgeries.length > 0) {
        console.log("before creating", team.state.importantSurgeries);
        const surgeryResult = (await surgeryAction({
          surgeriesInput: {
            surgeries: team.state.importantSurgeries,
            recipientId: recipientResult.recipientId,
          },
        })) as CreateSurgeryActionResponse;

        if (!surgeryResult.success) {
          throw new Error(surgeryResult.error || "Failed to create surgeries");
          // TODO: show error message notification
        }
        // TODO: show success message notification
      }

      // create medications
      if (team.state.medications.length > 0) {
        const medicationResult = (await medicationAction({
          medicationInput: {
            medications: team.state.medications,
            teamId: teamResult.teamId,
          },
        })) as CreateMedicationActionResponse;

        if (!medicationResult.success) {
          throw new Error(
            medicationResult.error || "Failed to create medications"
          );
          // TODO: show error message notification
        }
        // TODO: show success message notification
      }
    } catch (error) {
      console.error("Error creating team or recipient:", error);
      setError("Failed to create team or recipient");
      setCreating(false);
    } finally {
      setCreating(false);
      team.resetForm();
      // TODO: navigate somewhere
    }
  };

  // createEffect(() => {
  //   setMedicationList(medications);
  // });
  return (
    <>
      <TeamTopNav
        backNavigation={team.prevStep}
        cancelNavigation={aiButton()}
      />
      <div>
        <form onSubmit={handleSubmit}>
          {/* step 1: team Name */}
          <Show when={team.currentStep() === 1}>
            <div class="relative flex flex-col min-h-screen mx-4">
              <div class="flex items-center justify-center mt-2">
                <p class="text-xs text-gray-400">2 of 8</p>
              </div>
              {/* Space */}
              <div class="flex-grow"></div>
              {/* pick person to care */}
              <div class="px-2">
                <p class="text-[23px] font-semi">
                  Who is receiving care? <span class="text-red-500">*</span>
                </p>
                <TextFieldRoot class="space-y-2 mt-5">
                  <TextField
                    name="firstName"
                    placeholder="Enter name"
                    required
                    onInput={(e) =>
                      team.updateRecipientField(
                        "firstName",
                        e.currentTarget.value
                      )
                    }
                  />
                  {error() && <p class="text-red-500 text-sm">{error()}</p>}
                </TextFieldRoot>
                <Button
                  type="button"
                  onClick={handleNext}
                  class="rounded-full w-full mt-4 bg-[#AE9BF2] text-black h-[50px]"
                >
                  Next
                </Button>
              </div>
              {/* Space for bottom */}
              <div class="h-[122px]"></div> {/* temporary */}
            </div>
          </Show>

          {/* step 2: upload photo */}
          <Show when={team.currentStep() === 2}>
            <UploadPhoto />
          </Show>

          {/* step 3: phoneNumber, email */}
          <Show when={team.currentStep() === 3}>
            <UserInfo1 />
          </Show>

          {/* step 4: userInfo2 */}
          <Show when={team.currentStep() === 4}>
            <UserInfo2 />
          </Show>

          {/* step 5: userHealth1 */}
          <Show when={team.currentStep() === 5}>
            <UserHealth1 />
          </Show>

          {/* step 6: userHealth2 */}
          <Show when={team.currentStep() === 6}>
            <UserHealth2 />
          </Show>

          {/* step 7: addMed */}
          <Show when={team.currentStep() === 7}>
            <AddMedication />
          </Show>

          {/* step 8: specify the role */}
          <Show when={team.currentStep() === 8}>
            <UserRole />
          </Show>

          {/* step 9: team Name */}
          <Show when={team.currentStep() === 9}>
            <TeamUserRole />
          </Show>

          <Button
            type="submit"
            class="flex mt-4 items-center justify-center"
            disabled={creating()}
          >
            {creating() ? "Creating" : "Create Team"}
          </Button>
        </form>
      </div>
    </>
  );
}
