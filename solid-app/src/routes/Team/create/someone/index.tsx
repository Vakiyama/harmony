import { A, useAction } from "@solidjs/router";
import TeamTopNav from "~/components/team/team-top-nav";
import { Button } from "~/components/ui/button";
import UploadPhoto from "../../../../components/team/upload-photo";
import { createSignal, For, Show } from "solid-js";
import UserInfo1 from "../../../../components/team/user-info-1";
import UserInfo2 from "../../../../components/team/user-info-2";
import UserHealth1 from "../../../../components/team/user-health-1";
import UserHealth2 from "../../../../components/team/user-health-2";
import AddMedication from "../../../../components/team/add-medication";
import AboutUser from "../../../../components/team/about-user";
import UserTypePick from "./user-type-pick";
import aiButton from "~/components/svg/ai-icon";
import { useTeam } from "~/context/team-context";
import { createServerAction$ } from "solid-start/server";
import { db } from "~/api/db";
import { recipients } from "../../../../../drizzle/schema/Recipients";
import { teams } from "../../../../../drizzle/schema/Teams";
import { importantSurgeries } from "../../../../../drizzle/schema/ImportantSurgeries";
import { medications } from "../../../../../drizzle/schema/Medications";
import { createRecipientAction } from "~/api/team";
import {
  TextField,
  TextFieldLabel,
  TextFieldRoot,
} from "~/components/ui/textfield";
import UserRole from "./user-role";
import TeamUserRole from "../../../../components/team/team-user-role";

export default function CreateSomeone() {
  const [error, setError] = createSignal();
  const [creating, setCreating] = createSignal(false);
  const team = useTeam();
  const recipientInput = team.state.recipient;

  const recipientAction = useAction(createRecipientAction);
  type CreateActionResponse = {
    success?: boolean;
    error?: string;
  };

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    console.log(team.state.recipient);

    const result: CreateActionResponse = await recipientAction({
      recipientInput,
    });

    if (result.success) {
      setError("");
      team.resetForm();
      console.log("Success");
      // TODO
      // showNotification("Note Entry Posted");
      // navigate("/team/1/journal");
    } else if (result.error) {
      console.error(result.error);
      setError(result.error);
    }
  };
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
                <p class="text-[23px] font-semi">Who is receiving care?</p>
                <TextFieldRoot class="space-y-2 mt-5">
                  <TextField
                    name="firstName"
                    placeholder="Enter name"
                    onInput={(e) =>
                      team.updateRecipientField(
                        "firstName",
                        e.currentTarget.value
                      )
                    }
                  />
                </TextFieldRoot>
                <Button
                  type="button"
                  onClick={() => {
                    team.nextStep();
                  }}
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
            // disabled={creating.pending}
          >
            {creating() ? "Creating" : "Create Team"}
          </Button>
        </form>
      </div>
    </>
  );
}
