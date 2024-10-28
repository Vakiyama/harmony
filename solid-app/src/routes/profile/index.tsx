import AddButton from "~/components/profile/AddButton";
import TeamCard from "~/components/profile/TeamCard";
import TeamHeader from "~/components/profile/TeamHeader";
import TeamPopover from "~/components/profile/ProfilePopover";
import PopoverDemo from "~/components/profile/ProfilePopover";
import ProfilePopover from "~/components/profile/ProfilePopover";

export default function Profile() {
  return (
    <>
      <div class="w-full h-auto relative flex flex-col items-start mt-10 p-4  max-w-md md:max-w-4xl mx-auto">
        <div class="w-full flex flex-col items-center">
          <div>
            <TeamHeader
              teamName="User Name"
              imageUrl=""
              description="bio here or type of info"
            />
          </div>

          <div class="flex flex-start mt-10 text-3xl font-semi">Your Teams</div>

          <div class="grid grid-cols-2 gap-4 mt-3">
            <TeamCard teamName="Lola's Care Team" imageUrl="" />
            <TeamCard teamName="Team Name" imageUrl="" />
            <TeamCard teamName="Team Name" imageUrl="" />
            <TeamCard teamName="Team Name" imageUrl="" />
          </div>
          <div class="relative w-full h-[400px]">
            <div>
              <div class="absolute right-0 bottom-0 w-[56px] h-[56px] filter drop-shadow-lg">
                <ProfilePopover />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
