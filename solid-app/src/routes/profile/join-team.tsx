import TextFieldLine from "~/components/shared/TextFieldLine";
import TopNav from "~/components/shared/TopNav";
import { Button } from "~/components/ui/button";

export default function JoinTeam() {
  return (
    <div class="flex flex-col min-h-screen">
      <div>
        <TopNav leftNavigation="Back" name="Join a Team" />
      </div>
      <div class="relative flex-grow w-full p-4">
        <div>
          <div class="flex items-center justify-center">
            <p class="text-[12px] text-gray-500">
              Enter an invite link or code to join a team
            </p>
          </div>
          <TextFieldLine key="1" label="Invite Link" placeholder="Example" />
          <div class="flex items-center mt-2">
            <div class="flex-grow border-t border-gray-300"></div>
            <span class="mx-4 text-gray-500">or</span>
            <div class="flex-grow border-t border-gray-300"></div>
          </div>
          <TextFieldLine key="2" label="Invite Code" placeholder="Code" />
        </div>
        <div class="absolute inset-0 flex items-center justify-center">
          <Button class="w-[400px] h-[40px] rounded-full mt-80">
            {" "}
            {/* temporary mt-80 */}
            Join Team
          </Button>
        </div>
      </div>
    </div>
  );
}
