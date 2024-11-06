import { A } from "@solidjs/router";
import TextFieldLine from "~/components/shared/text-field-line";
import TeamTopNav from "~/components/team/team-top-nav";
import { Button } from "~/components/ui/button";
import UploadPhoto from "./upload-photo";
import { createSignal, For } from "solid-js";
import UserInfo1 from "./user-info-1";
import UserInfo2 from "./user-info-2";
import UserHealth1 from "./user-health-1";
import UserHealth2 from "./user-health-2";
import AddMedication from "./add-medication";
import TeamUserRole from "./team-user-role";
import AboutUser from "./about-user";
import UserTypePick from "./user-type-pick";
import aiButton from "~/components/svg/ai-icon";

export default function CreateSomeone() {
  const [formRef, setFormRef] = createSignal<HTMLFormElement | undefined>();
  const [currentStep, setCurrentStep] = createSignal(1);

  const nextStep = () => setCurrentStep(currentStep() + 1);
  const prevStep = () => setCurrentStep(currentStep() - 1);

  const [surgeries, setSurgeries] = createSignal<
    { name: string; year: string; details: string }[]
  >([{ name: "", year: "", details: "" }]);

  const addMoreSurgeries = () => {
    setSurgeries([...surgeries(), { name: "", year: "", details: "" }]);
  };

  const updateSurgery = (
    index: number,
    field: "name" | "year" | "details",
    value: string
  ) => {
    const updatedSurgeries = [...surgeries()];
    updatedSurgeries[index][field] = value;
    setSurgeries(updatedSurgeries);
  };

  return (
    <>
      <TeamTopNav backNavigation={prevStep} cancelNavigation={aiButton()} />
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
          {currentStep() === 6 && (
            <div class="relative flex flex-col min-h-screen mx-2">
              <div class="flex items-center justify-center mt-2">
                <p class="text-xs text-gray-400">5 of 8</p>
              </div>
              {/* Health profile part */}
              <div class="px-2 mt-6 flex flex-col flex-grow">
                <p class="text-[30px] font-semi">
                  Tell us about "User's" Health
                </p>
                <p class="text-[24px] mt-2">Health Profile</p>
                <div>
                  <p class="text-lg font-semibold">Important Surgeries</p>

                  {/* Render surgery input fields */}
                  <For each={surgeries()}>
                    {(surgery, index) => (
                      <div class="flex flex-col gap-2 mt-2">
                        <div class="flex flex-row space-x-2">
                          <input
                            type="text"
                            value={surgery.name}
                            onInput={(e) =>
                              updateSurgery(
                                index(),
                                "name",
                                e.currentTarget.value
                              )
                            }
                            class="p-2 border rounded-lg w-full text-sm"
                            placeholder="Surgery Name"
                          />
                          <input
                            type="text"
                            value={surgery.year}
                            onInput={(e) =>
                              updateSurgery(
                                index(),
                                "year",
                                e.currentTarget.value
                              )
                            }
                            class="p-2 border rounded-lg w-full text-sm"
                            placeholder="Year of surgery"
                          />
                        </div>
                        <textarea
                          value={surgery.details}
                          onInput={(e) =>
                            updateSurgery(
                              index(),
                              "details",
                              e.currentTarget.value
                            )
                          }
                          class="p-2 border rounded-lg w-full text-sm"
                          placeholder="Extra notes"
                        />
                      </div>
                    )}
                  </For>

                  <button
                    onClick={addMoreSurgeries}
                    class="w-full mt-2 border-[1px] text-black px-4 py-2 rounded-lg text-sm"
                  >
                    Add more
                  </button>
                </div>

                <TextFieldLine
                  key="mobilityNeeds"
                  name="mobilityNeeds"
                  label="Mobility Needs"
                  placeholder="Requires walking cane"
                  classLabel="font-medium font-semibold text-lg"
                />
              </div>
              {/* Space */}
              <div class="flex-grow"></div>
              {/* Next button */}
              <div class="flex flex-col items-center justify-center">
                <Button
                  type="button"
                  onClick={nextStep}
                  class="rounded-full w-full bg-[#AE9BF2] text-black h-[50px]"
                >
                  Next
                </Button>
                <A href="/" class="text-xs p-2">
                  skip for now
                </A>
              </div>
              <div class="h-[102px]"></div> {/* temporary */}
            </div>
          )}
          {currentStep() === 7 && <AddMedication onClick={nextStep} />}
          <Button type="submit" class="flex mt-4 items-center justify-center">
            Submit
          </Button>
          {/* {currentStep() === 8 && <UserTypePick />}
          {currentStep() === 9 && <AboutUser onClick={nextStep} />} */}
        </form>
      </div>
    </>
  );
}
