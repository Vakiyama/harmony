import { createSignal, onMount, Show } from "solid-js";
import TopNav from "~/components/shared/TopNav";
import { Button } from "~/components/ui/button";
import TextInput from "../Team/[id]/Calendar/Create/TextInput";
import { joinTeam } from "~/api/team";
import { getUser } from "~/api";
import { useNavigate } from "@solidjs/router";

export default function JoinTeam() {
  const [code, setCode] = createSignal("");
  const [relationship, setRelationship] = createSignal("");
  const [user] = createSignal(getUser());
  const [error, setError] = createSignal<string | null>(null);
  const navigate = useNavigate();

  async function handleSubmitCode(e: SubmitEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (relationship().length === 0)
      return setError("Relationship must not be empty");
    const response = await joinTeam((await user()).id, code(), relationship());
    if (response._tag === "error") {
      setError(response.message);
    }
    if (response._tag === "success") {
      return navigate(`/team/${response.teamId}`);
    }
  }

  return (
    <>
      <TopNav leftNavigation="Back" name="Join a Team" />
      <form
        onSubmit={handleSubmitCode}
        class="relative flex flex-col items-center justify-center w-full p-4 gap-4 h-full"
      >
        <TextInput
          label="Invite Code"
          placeholder="Code"
          value={code}
          setValue={setCode}
        />
        <TextInput
          label="Relationship to care recipient"
          placeholder="e.g. Friend, Family, Daughter, Son..."
          value={relationship}
          setValue={setRelationship}
        />
        <Show when={error()}>
          <p class="text-sm text-red-500">{error()}</p>
        </Show>
        <div class="w-full flex items-center justify-center">
          <Button type="submit" class="w-[400px] h-[40px] rounded-full">
            Join Team
          </Button>
        </div>
      </form>
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
