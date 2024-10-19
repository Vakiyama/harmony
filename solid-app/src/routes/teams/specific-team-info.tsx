import TeamHeader from "~/components/teams/TeamHeader";
import TeamTab from "~/components/teams/TeamTab";
import TeamMenuBar from "~/components/teams/TeamTab";
import TeamNav from "~/components/teams/TeamTab";

export default function SpecificTeamInfo() {
  return (
    <>
      <div class="w-full h-auto relative flex flex-col items-center mt-10 p-4  max-w-md md:max-w-4xl mx-auto">
        <div>
          <TeamHeader teamName="Lola's Name" imageUrl="" description="" />
        </div>
        <div class="mt-4">
          <TeamTab />
        </div>
      </div>
    </>
  );
}
