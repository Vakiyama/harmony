import { A, useAction } from "@solidjs/router";
import TeamTopNav from "~/components/team/team-top-nav";
import { Button } from "~/components/ui/button";
import UploadPhoto from "./upload-photo";
import { createSignal, For, Show } from "solid-js";
import UserInfo1 from "./user-info-1";
import UserInfo2 from "./user-info-2";
import UserHealth1 from "./user-health-1";
import UserHealth2 from "./user-health-2";
import AddMedication from "./add-medication";
import TeamUserRole from "./team-user-role";
import AboutUser from "./about-user";
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

export default function CreateSomeone() {
  // const [formRef, setFormRef] = createSignal<HTMLFormElement | undefined>();
  const [error, setError] = createSignal();
  const team = useTeam();

  const myAction = useAction(createRecipientAction);
  type CreateRecipientActionResponse = {
    success?: boolean;
    error?: string;
  };

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    console.log(team.state.recipient);

    // const result: CreateRecipientActionResponse = await myAction(
    //   new FormData(event.target as HTMLFormElement)
    // );

    // if (result.success) {
    //   setError("");
    //   // formRef()?.reset();
    //   console.log("Success");
    //   // showNotification("Note Entry Posted");
    //   // navigate("/team/1/journal");
    // } else if (result.error) {
    //   console.error(result.error);
    //   setError(result.error);
    // }
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
                  // onClick={team.nextStep}
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
            <UploadPhoto onClick={() => team.nextStep()} />
          </Show>

          {/* step 3: team Name */}
          <Show when={team.currentStep() === 3}>
            <UserInfo1 onClick={() => team.nextStep()} />
          </Show>

          {/* step 4: team Name */}
          <Show when={team.currentStep() === 4}>
            <UserInfo2 onClick={() => team.nextStep()} />
          </Show>

          {/* step 5: team Name */}
          <Show when={team.currentStep() === 5}>
            <UserHealth1 onClick={() => team.nextStep()} />
          </Show>

          {/* step 6: team Name */}
          {/* <Show when={team.state.currentStep === 6}>
            <UserHealth2
              onClick={team.nextStep}
              addMore={team.addSurgery}
              onInput={() => {}}
            />
          </Show> */}
          {/* step 7: team Name */}
          {/* step 8: team Name */}
          {/* step 9: team Name */}
          {/* step 10: team Name */}

          {/*  */}
          {/* {currentStep() === 7 && <AddMedication onClick={nextStep} />} */}
          <Button
            type="submit"
            class="flex mt-4 items-center justify-center"
            // disabled={creating.pending}
          >
            Create Team
            {/* {creating.pending ? "Creating" : "Create Team"} */}
          </Button>
          {/* {currentStep() === 8 && <UserTypePick />}
          {currentStep() === 9 && <AboutUser onClick={nextStep} />} */}
        </form>
      </div>
    </>
  );
}
