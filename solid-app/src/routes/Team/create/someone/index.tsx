import { A } from "@solidjs/router";
import TextFieldLine from "~/components/shared/text-field-line";
import TeamTopNav from "~/components/team/team-top-nav";
import { Button } from "~/components/ui/button";
import UploadPhoto from "./upload-photo";
import { createSignal } from "solid-js";
import UserInfo1 from "./user-info-1";
import UserInfo2 from "./user-info-2";
import UserHealth1 from "./user-health-1";
import UserHealth2 from "./user-health-2";

export default function CreateSomeone() {
  const [formRef, setFormRef] = createSignal<HTMLFormElement | undefined>();
  const [currentStep, setCurrentStep] = createSignal(1);

  const nextStep = () => setCurrentStep(currentStep() + 1);
  const prevStep = () => setCurrentStep(currentStep() - 1);

  return (
    <>
      <TeamTopNav backNavigation={prevStep} cancelNavigation="/" />
      <div>
        <form onSubmit={() => {}}>
          {currentStep() === 1 && (
            <div class="relative flex flex-col min-h-screen mx-4">
              <div class="flex items-center justify-center mt-2">
                <p class="text-xs text-gray-400">2 of 8</p>
              </div>
              {/* Space */}
              <div class="flex-grow"></div>
              {/* pick person to care */}
              <div class="px-2">
                <p class="text-[23px] font-semi">Who is receiving care?</p>
                <TextFieldLine
                  key=""
                  name="recipient name"
                  label=""
                  placeholder="Enter name"
                />
                <Button
                  type="button"
                  onClick={nextStep}
                  class="rounded-full w-full mt-4 bg-[#AE9BF2] text-black h-[50px]"
                >
                  Next
                </Button>
              </div>
              {/* Space for bottom */}
              <div class="h-[122px]"></div> {/* temporary */}
            </div>
          )}
          {currentStep() === 2 && <UploadPhoto onClick={nextStep} />}
          {currentStep() === 3 && <UserInfo1 onClick={nextStep} />}
          {currentStep() === 4 && <UserInfo2 onClick={nextStep} />}
          {currentStep() === 5 && <UserHealth1 onClick={nextStep} />}
          {currentStep() === 6 && <UserHealth2 onClick={nextStep} />}
        </form>
      </div>
    </>
  );
}
