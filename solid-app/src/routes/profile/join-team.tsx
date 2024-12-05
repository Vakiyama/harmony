import { createSignal, Show, useContext } from "solid-js";
import TopNav from "~/components/shared/TopNav";
import { Button } from "~/components/ui/button";
import TextInput from "../Team/[id]/Calendar/Create/TextInput";
import { joinTeam } from "~/api/team";
import { getUser } from "~/api";
import { useNavigate } from "@solidjs/router";
import { useTeam } from "~/context/team-context";
import { TeamContext } from "~/components/Layout-Context";

export default function JoinTeam() {
  const [code, setCode] = createSignal("");
  const [relationship, setRelationship] = createSignal("");
  const [user] = createSignal(getUser());
  const [error, setError] = createSignal<string | null>(null);

  const context = useContext(TeamContext);

  const navigate = useNavigate();
  const team = useTeam();

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
      team.updateTeamId(response.teamId);
      context?.refetchTrigger();

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
