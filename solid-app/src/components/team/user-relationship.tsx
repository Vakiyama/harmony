import { createSignal } from "solid-js";
import TextFieldLine from "~/components/shared/text-field-line";
import { Button } from "~/components/ui/button";
import { useTeam } from "~/context/team-context";

export default function UserRelationship() {
  const team = useTeam();
  const [error, setError] = createSignal<string | null>(null);

  const handleNext = () => {
    if (!team.state.memberRelationship.trim()) {
      setError("Please specify your relationship with the recipient");
      return;
    }
    setError(null);
    team.nextStep();
  };

  return (
    <>
      <p class="flex justify-center text-subtitle13 text-stepsGray mt-3">
        7 of 8
      </p>
      <div class="flex items-center justify-start flex-col h-full mt-4 mx-3 mb-[46px]">
        <p class="self-start text-h2 font-grotesque leading-[120%] font-medium">
          What is your relation to the care recipient?{" "}
        </p>
        <div class="w-full">
          <p class="self-start text-h3 font-grotesque leading-[120%] font-medium mt-[18px]">
            Please Specify <span class="text-red-500">*</span>
          </p>
          <TextFieldLine
            name="recipient name"
            label=""
            placeholder="e.g. Daughter, Cousin, Nurse, etc."
            classRoot="mt-1"
            value={team.state.memberRelationship}
            onInput={(e) => team.updateRelationship(e.currentTarget.value)}
            required
          />
          {error() && <p class="text-red-500 text-sm">{error()}</p>}
        </div>
        <div class="flex flex-col justify-end w-full flex-grow">
          <Button
            type="button"
            onClick={handleNext}
            class="rounded-full w-full mt-3 bg-primary-purple-300 text-black text-base h-12"
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
}
