import { A } from "@solidjs/router";
import TextFieldLine from "~/components/shared/text-field-line";
import TeamTopNav from "~/components/team/team-top-nav";
import { Button } from "~/components/ui/button";

export default function AddMedication(props: { recipientName: string }) {
  return (
    <>
      <TeamTopNav backNavigation="/" cancelNavigation="/" />

      <div class="relative flex flex-col min-h-screen mx-2">
        <div class="flex items-center justify-center mt-2">
          <p class="text-xs text-gray-400">6 of 8</p>
        </div>
        {/* upload photo part */}
        <div class="px-2 mt-6 flex flex-col flex-grow">
          <p class="text-[30px] font-semi">
            Tell us about "User's" {props.recipientName} Medication{" "}
          </p>
          <p class="text-lg font-semibold mt-4">Medication Details</p>

          {/* add med */}
          <div class="border-[1px] w-full h-[65px] rounded-lg mt-6 grid grid-rows-3">
            <div></div>
            <div class="flex flex-col items-center justify-center space-y-2">
              <svg
                width="17"
                height="17"
                viewBox="0 0 17 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.88843 1V15.0625"
                  stroke="#1E1E1E"
                  stroke-opacity="0.5"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M15.5625 8.03125H1.5"
                  stroke="#1E1E1E"
                  stroke-opacity="0.5"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>

              <a
                href="/team/create/someone/medication-detail"
                class="text-xs text-gray-400"
              >
                Add Medication
              </a>
            </div>
          </div>

          {/* space */}
          <div class="flex-grow"></div>

          <div class="flex flex-col items-center justify-center">
            <Button class="rounded-full w-full mt-4 bg-[#AE9BF2] text-black h-[50px]">
              Next
            </Button>
            <A href="/" class="text-xs p-2">
              skip for now
            </A>
          </div>
        </div>
        {/* Space for bottom */}
        <div class="h-[102px]"></div> {/* temporary */}
      </div>
    </>
  );
}
