import { useAction, useNavigate } from "@solidjs/router";
import { createEffect, createSignal, For, Show } from "solid-js";
import { useTeam } from "~/context/team-context";
import { showNotification } from "~/routes/api/notificationStore";

import TeamTopNav from "~/components/team/team-top-nav";
import { Button } from "~/components/ui/button";
import UploadPhoto from "../../../../components/team/upload-photo";
import UserInfo1 from "../../../../components/team/user-info-1";
import UserInfo2 from "../../../../components/team/user-info-2";
import UserHealth1 from "../../../../components/team/user-health-1";
import UserHealth2 from "../../../../components/team/user-health-2";
import AddMedication from "../../../../components/team/add-medication";
import { TextField, TextFieldRoot } from "~/components/ui/textfield";
import UserRole from "../../../../components/team/user-role";
import TeamUserRole from "../../../../components/team/team-user-role";
import ReviewTeamInfo from "~/components/team/review-team-info";
import Notification from "~/components/shared/notification";
import aiButton from "~/components/svg/ai-icon";

import {
  createMedicationAction,
  createPastInjuryAction,
  createRecipientAction,
  createSurgeryAction,
  createTeamAction,
} from "~/api/team";

import {
  notificationMessage,
  isNotificationVisible,
  hideNotification,
} from "~/routes/api/notificationStore";

import {
  CreateRecipientActionResponse,
  CreateTeamActionResponse,
  CreateSurgeryActionResponse,
  CreateInjuryActionResponse,
  CreateMedicationActionResponse,
} from "~/types/types";

export default function CreateSomeone() {
  const [error, setError] = createSignal<string | null>(null);
  const [isCreating, setIsCreating] = createSignal(false);
  const team = useTeam();
  const navigate = useNavigate();

  const recipientAction = useAction(createRecipientAction);

  const teamAction = useAction(createTeamAction);
  const surgeryAction = useAction(createSurgeryAction);
  const injuryAction = useAction(createPastInjuryAction);
  const medicationAction = useAction(createMedicationAction);

  const handleNext = () => {
    if (!team.state.recipient.firstName.trim()) {
      setError("Please enter the recipient's name");
      return;
    }
    setError(null);
    team.nextStep();
  };

  const handleSubmit = async (event?: MouseEvent) => {
    // event.preventDefault();
    setIsCreating(true);
    try {
      // create recipient
      const recipientResult = (await recipientAction({
        recipientInput: team.state.recipient,
      })) as CreateRecipientActionResponse;

      if (!recipientResult.success || !recipientResult.recipientId) {
        showNotification("Failed to create recipient");
        throw new Error(recipientResult.error || "Failed to create recipient");
      }
      showNotification("Recipient created successfully");

      // create team
      const teamResult = (await teamAction({
        teamInput: {
          teamName: team.state.teamName,
          recipientId: recipientResult.recipientId,
        },
      })) as CreateTeamActionResponse;

      if (!teamResult.success || !teamResult.teamId) {
        showNotification("Failed to create team");
        throw new Error(teamResult.error || "Failed to create team");
      }
      showNotification("Team created successfully");

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
          showNotification("Failed to create surgeries");
          throw new Error(surgeryResult.error || "Failed to create surgeries");
        }
        showNotification("Surgeries added successfully");
      }

      // create past injuries
      if (team.state.pastInjuries.length > 0) {
        console.log("before creating", team.state.pastInjuries);
        const injuryResult = (await injuryAction({
          injuriesInput: {
            injuries: team.state.pastInjuries,
            recipientId: recipientResult.recipientId,
          },
        })) as CreateInjuryActionResponse;

        if (!injuryResult.success) {
          showNotification("Failed to create injuries");
          throw new Error(injuryResult.error || "Failed to create injuries");
        }
        showNotification("Past injuries added successfully");
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
          showNotification("Failed to create medications");
          throw new Error(
            medicationResult.error || "Failed to create medications"
          );
        }
        showNotification("Medications added successfully");
      }
      showNotification("Created Team successfully");
      await new Promise((resolve) => setTimeout(resolve, 3000));
      team.resetForm();
      //landing needs to rerender
      window.location.href = "/landing";
    } catch (error) {
      console.error("Error creating team or recipient:", error);
      showNotification("Failed to create team or recipient");
      setError("Failed to create team or recipient");
      setIsCreating(false);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <TeamTopNav
        leftNavigation={team.prevStep}
        rightText={team.currentStep() === 10 ? "Create Team" : aiButton()}
        rightAction={team.currentStep() === 10 ? handleSubmit : undefined}
        isCreating={isCreating()}
      />
      <div>
        <form onSubmit={(e) => e.preventDefault()} class="mt-24">
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
                    // required
                    onInput={(e) =>
                      team.updateRecipientField(
                        "firstName",
                        e.currentTarget.value
                      )
                    }
                    value={team.state.recipient.firstName}
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
          {/* step 10: review */}
          <Show when={team.currentStep() === 10}>
            <ReviewTeamInfo />
          </Show>
        </form>

        {isNotificationVisible() && (
          <Notification
            title={notificationMessage()}
            onClose={hideNotification}
          />
        )}
      </div>
    </>
  );
}
