import GeneralInfo from "~/components/profile/general-info";
import ProfileTeamContent from "~/components/profile/profile-team-content";
import ProfileTeamTab from "~/components/profile/profile-team-content";
import ProfileUserName from "~/components/profile/profile-user-name";
import TeamHeader from "~/components/profile/team-header";
import TeamTab from "~/components/profile/team-tab";
import TeamMenuBar from "~/components/profile/team-tab";
import TeamNav from "~/components/profile/team-tab";
import TopNav from "~/components/shared/TopNav";

export default function SpecificTeamInfo() {
  return (
    <div class="w-full">
      {/* header */}
      <div>
        <TopNav leftNavigation="Back" name="Lola's Care Circle" />
      </div>
      <div class="">
        <div class="mt-4 mx-4">
          <ProfileUserName
            userNameUrl="https://res.cloudinary.com/daobc6dfz/image/upload/v1724046745/pexels-conojeghuo-375889_iij9gb.jpg"
            userName="Tina Duong"
          />
        </div>
        <div class="mt-4">
          <ProfileTeamContent />
        </div>
      </div>
    </div>
  );
}
