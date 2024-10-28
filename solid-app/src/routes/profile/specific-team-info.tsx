import TeamHeader from "~/components/profile/TeamHeader";
import TeamTab from "~/components/profile/TeamTab";
import TeamMenuBar from "~/components/profile/TeamTab";
import TeamNav from "~/components/profile/TeamTab";

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
