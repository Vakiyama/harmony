import TextFieldLine from "~/components/shared/text-field-line";
import { Button } from "~/components/ui/button";
import { useTeam } from "~/context/team-context";

export default function UserRole() {
  const team = useTeam();
  return (
    <>
      <p class="flex justify-center text-subtitle13 text-stepsGray mt-3">
        7 of 8
      </p>
      <div class="flex items-center justify-start flex-col h-full mt-4 mx-3 mb-[46px]">
        <p class="self-start text-h2 font-grotesque leading-[120%] font-medium">
          What is your role in the care team?
        </p>
        <div class="w-full">
          <p class="self-start text-h3 font-grotesque leading-[120%] font-medium mt-[18px]">
            Please Specify
          </p>
          <TextFieldLine
            name="recipient name"
            label=""
            placeholder="Example: Daughter, Cousin, Nurse, etc."
            classRoot="mt-1"
          />
        </div>
        <div class="flex flex-col justify-end w-full flex-grow">
          <Button
            type="button"
            onClick={team.nextStep}
            class="rounded-full w-full mt-3 bg-primary-purple-300 text-black text-base h-12"
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
}
