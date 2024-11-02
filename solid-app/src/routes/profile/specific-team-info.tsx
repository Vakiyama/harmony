import GeneralInfo from "~/components/profile/general-info";
import ProfileTeamContent from "~/components/profile/profile-team-content";
import ProfileTeamTab from "~/components/profile/profile-team-content";
import TeamHeader from "~/components/profile/team-header";
import TeamTab from "~/components/profile/team-tab";
import TeamMenuBar from "~/components/profile/team-tab";
import TeamNav from "~/components/profile/team-tab";

export default function SpecificTeamInfo() {
  return (
    <>
      <div class="w-full">
        {/* <div class="w-full relative flex flex-col items-center mt-10 p-4  max-w-md md:max-w-4xl mx-auto"> */}
        {/* header */}
        <div>
          <TeamHeader teamName="Lola's Name" imageUrl="" description="" />
        </div>
        <div class="mt-4">
          <ProfileTeamContent />
          {/* <TeamTab /> <GeneralInfo /> */}
        </div>
      </div>
    </>
  );
}
