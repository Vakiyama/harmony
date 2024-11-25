import { useAction, useNavigate } from "@solidjs/router";
import { createEffect, createSignal, Show } from "solid-js";
import { useTeam } from "~/context/team-context";
import { showNotification } from "~/routes/api/notificationStore";

import TeamTopNav from "~/components/team/team-top-nav";
import { Button } from "~/components/ui/button";
import UploadPhoto from "../../../../components/team/upload-photo";
import UserInfo1 from "../../../../components/team/user-info-1";
import UserInfo2 from "../../../../components/team/user-info-2";
import UserHealth1 from "../../../../components/team/user-health-1";
import UserHealth2 from "../../../../components/team/user-health-2";
import UserRelationship from "../../../../components/team/user-relationship";
import AddMedication from "../../../../components/team/add-medication";
import { TextField, TextFieldRoot } from "~/components/ui/textfield";
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
import ShowError from "../../[id]/journal/show-error";

export default function CreateSomeone() {
  const navigate = useNavigate();
  const [error, setError] = createSignal<string | null>(null);
  const [isCreating, setIsCreating] = createSignal(false);
  const [teamError, setTeamError] = createSignal("");

  const team = useTeam();
  const [back, setBack] = createSignal<() => void>(() => {});
  const [closeAddMed, setCloseAddMed] = createSignal<boolean>(false);

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

  const cleanup = () => {
    team.prevSubStep();
    setCloseAddMed(true);
  };
  createEffect(() => {
    const currentStep = team.currentStep();
    if (currentStep === 7.5) {
      return setBack(() => cleanup);
    }
    setBack(() => team.prevStep);
  });

  const handleSubmit = async (event?: MouseEvent) => {
    setIsCreating(true);
    setTeamError("");
    try {
      // create recipient
      const recipientResult = (await recipientAction({
        recipientInput: team.state.recipient,
      })) as CreateRecipientActionResponse;

      if (!recipientResult.success || !recipientResult.recipientId) {
        setTeamError(recipientResult.error || "Failed to create recipient");
        throw new Error(recipientResult.error || "Failed to create recipient");
      }
      showNotification("Recipient created successfully");

      // create team
      const teamResult = (await teamAction({
        teamInput: {
          teamName: team.state.teamName,
          recipientId: recipientResult.recipientId,
          memberRelationship: team.state.memberRelationship,
        },
      })) as CreateTeamActionResponse;

      if (!teamResult.success || !teamResult.teamId) {
        setTeamError(teamResult.error || "Failed to create team");
        throw new Error(teamResult.error || "Failed to create team");
      }
      showNotification("Team created successfully");

      // create important surgeries
      if (
        team.state.importantSurgeries.length > 0 &&
        team.state.importantSurgeries[0].name !== "" &&
        team.state.importantSurgeries[0].year !== ""
      ) {
        console.log("before creating", team.state.importantSurgeries);
        const surgeryResult = (await surgeryAction({
          surgeriesInput: {
            surgeries: team.state.importantSurgeries,
            recipientId: recipientResult.recipientId,
          },
        })) as CreateSurgeryActionResponse;

        if (!surgeryResult.success) {
          console.log(surgeryResult.error || "Failed to create surgeries");
          // setTeamError(surgeryResult.error || "Failed to create surgeries");
        }
        showNotification("Surgeries added successfully");
      }

      // create past injuries
      if (
        team.state.pastInjuries.length > 0 &&
        team.state.pastInjuries[0].name.trim() !== ""
      ) {
        console.log("before creating", team.state.pastInjuries);
        const injuryResult = (await injuryAction({
          injuriesInput: {
            injuries: team.state.pastInjuries,
            recipientId: recipientResult.recipientId,
          },
        })) as CreateInjuryActionResponse;

        if (!injuryResult.success) {
          console.log(injuryResult.error || "Failed to create injuries");
          // setTeamError(injuryResult.error || "Failed to create injuries");
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
          console.log(medicationResult.error || "Failed to create medications");
          // setTeamError(medicationResult.error ||"Failed to create medication");
        }
        showNotification("Medications added successfully");
      }
      showNotification("Created Team successfully");
      await new Promise((resolve) => setTimeout(resolve, 3000));
      team.resetForm();
      window.location.href = "/";
    } catch (error) {
      console.error("Error creating team or recipient:", error);
      setTeamError("Failed to create team");
      setIsCreating(false);
    } finally {
      setIsCreating(false);
    }
  };
  return (
    <>
      <Show when={back()}>
        <TeamTopNav
          leftNavigation={() => {
            if (team.currentStep() === 1) {
              return navigate("/team/create");
            }
            return back()();
          }}
          rightText={team.currentStep() === 10 ? "Create Team" : aiButton()}
          rightAction={team.currentStep() === 10 ? handleSubmit : undefined}
          isCreating={isCreating()}
        />
      </Show>
      <form onSubmit={(e) => e.preventDefault()} class="h-full flex flex-col">
        <div class="flex items-center justify-center">
          <ShowError error={teamError()}></ShowError>
        </div>
        {/* step 1: team Name */}
        <Show when={team.currentStep() === 1}>
          <p class="flex justify-center text-subtitle13 text-stepsGray mt-3">
            2 of 8
          </p>
          {/* pick person to care */}
          <div class="flex items-center justify-end flex-col h-full mb-[46px] mx-3">
            <div class="flex flex-col justify-end w-full">
              <p class="text-[23px] font-medium font-grotesque leading-[120%]">
                Who is receiving care? <span class="text-red-500">*</span>
              </p>
              <TextFieldRoot class="space-y-2 mt-3 text-base">
                <TextField
                  name="firstName"
                  placeholder="Name"
                  required
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
                class="rounded-full w-full mt-4 bg-primary-purple-300 text-black text-base h-12"
              >
                Next
              </Button>
            </div>
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
        <Show when={team.currentStep() === 7 || team.currentStep() === 7.5}>
          <AddMedication
            closeAddMed={closeAddMed}
            setCloseAddMed={setCloseAddMed}
          />
        </Show>

        {/* step 8: specify the role */}
        <Show when={team.currentStep() === 8}>
          <UserRelationship />
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
    </>
  );
}
