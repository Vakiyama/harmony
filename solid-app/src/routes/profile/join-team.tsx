import { createSignal } from "solid-js";
import TextFieldLine from "~/components/shared/TextFieldLine";
import TopNav from "~/components/shared/TopNav";
import { Button } from "~/components/ui/button";
import TextInput from "../Team/[id]/Calendar/Create/TextInput";

export default function JoinTeam() {
  const [code, setCode] = createSignal("");
  return (
    <>
      <TopNav leftNavigation="Back" name="Join a Team" />
      <div class="relative flex flex-col items-center justify-center w-full h-fit p-4 gap-6 h-full">
        <TextInput
          label="Invite Code"
          placeholder="Code"
          value={code}
          setValue={setCode}
        />
        <div class="w-full flex items-center justify-center">
          <Button class="w-[400px] h-[40px] rounded-full">
            {" "}
            {/* temporary mt-80 */}
            Join Team
          </Button>
        </div>
      </div>
    </>
  );
}

{
  /*
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
        */
}
