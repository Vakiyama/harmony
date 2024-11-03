import { A } from "@solidjs/router";
import TextFieldLine from "~/components/shared/text-field-line";
import TeamTopNav from "~/components/team/team-top-nav";
import { Button } from "~/components/ui/button";

export default function UploadPhoto(props: { recipientName: string }) {
  return (
    <>
      <TeamTopNav backNavigation="/" cancelNavigation="/" />
      <div class="relative flex flex-col min-h-screen mx-2">
        <div class="flex items-center justify-center mt-2">
          <p class="text-xs text-gray-400">4 of 8</p>
        </div>
        {/* upload photo part */}
        <div class="px-2 mt-6 flex flex-col flex-grow">
          <p class="text-[30px] font-semi">
            Tell us about "User" {props.recipientName}
          </p>
          <p class="text-[24px] mt-2">Contact Information</p>
          <TextFieldLine
            key=""
            label="Phone Number"
            placeholder="Phone Number"
            classLabel="text-lg"
          />
          <TextFieldLine
            key=""
            label="Email"
            placeholder="email@here.com"
            classLabel="text-lg"
          />
        </div>
        {/* space */}
        <div class="flex-grow"></div>
        <div class="flex flex-col items-center justify-center">
          <Button class="rounded-full w-full bg-[#AE9BF2] text-black h-[50px]">
            Next
          </Button>
          <A href="/" class="text-xs p-2">
            skip for now
          </A>
        </div>
        {/* Space for bottom */}
        <div class="h-[102px]"></div> {/* temporary */}
      </div>
    </>
  );
}
