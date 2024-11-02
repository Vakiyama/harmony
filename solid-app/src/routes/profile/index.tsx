import ProfileHeaderHome from "~/components/profile/profile-header-home";
import ProfilePopover from "~/components/profile/profile-popover";
import ProfileUserName from "~/components/profile/profile-user-name";
import TeamCard from "~/components/profile/team-card";
export default function Profile() {
  return (
    <div class="relative p-4">
      <div>
        <ProfileHeaderHome />
      </div>
      <ProfileUserName
        userNameUrl="https://res.cloudinary.com/daobc6dfz/image/upload/v1724046745/pexels-conojeghuo-375889_iij9gb.jpg"
        userName="Tina Duong"
      />
      <div class="flex flex-row justify-between mt-4 ">
        <h1 class="text-[24px]">Your teams</h1>
        <ProfilePopover />
      </div>
      {/* Team Cards */}
      <div class="w-full flex flex-wrap gap-3 justify-start mt-2">
        <TeamCard
          teamName="Lola's Care Team"
          imageUrl="https://res.cloudinary.com/daobc6dfz/image/upload/v1724046745/pexels-conojeghuo-375889_iij9gb.jpg"
        />
        <TeamCard
          teamName="Tina's Team"
          imageUrl="https://res.cloudinary.com/daobc6dfz/image/upload/v1724046745/pexels-conojeghuo-375889_iij9gb.jpg"
        />
        <TeamCard
          teamName="Tina's Team"
          imageUrl="https://res.cloudinary.com/daobc6dfz/image/upload/v1724046745/pexels-conojeghuo-375889_iij9gb.jpg"
        />
        {/* <TeamCard
          teamName="Tina's Team"
          imageUrl="https://res.cloudinary.com/daobc6dfz/image/upload/v1724046745/pexels-conojeghuo-375889_iij9gb.jpg"
        /> */}
      </div>
    </div>
  );
}
