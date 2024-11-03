import { A } from "@solidjs/router";
import TextFieldLine from "~/components/shared/text-field-line";
import TeamTopNav from "~/components/team/team-top-nav";
import { Button } from "~/components/ui/button";

export default function CreateSomeone() {
  return (
    <div class="relative flex flex-col min-h-screen">
      <TeamTopNav backNavigation="/" cancelNavigation="/" />

      <div class="flex items-center justify-center mt-2">
        <p class="text-xs text-gray-400">2 of 8</p>
      </div>

      {/* Space */}
      <div class="flex-grow"></div>

      {/* pick person to care */}
      <div class="px-2">
        <p class="text-[23px] font-semi">Who is receiving care?</p>
        <TextFieldLine key="" label="" placeholder="Enter name" />
        <Button class="rounded-full w-full mt-4 bg-[#AE9BF2] text-black h-[50px]">
          Next
        </Button>
      </div>

      {/* Space for bottom */}
      <div class="h-[32px]"></div>
    </div>
  );
}
