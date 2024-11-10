import { A } from "@solidjs/router";
import { onCleanup, onMount, useContext } from "solid-js";
import TopNav from "~/components/shared/TopNav";
import TeamTopNav from "~/components/team/team-top-nav";
import UserType from "~/components/team/user-type";
import { BottomNavContext } from "~/context/bottom-nav-provider";

export default function UserTypePick() {
  // const { setShowBottomNav } = useContext(BottomNavContext);

  // onMount(() => {
  //   setShowBottomNav(false);
  // });

  // onCleanup(() => {
  //   setShowBottomNav(true);
  // });
  return (
    <div class="relative flex flex-col min-h-screen">
      {/* <TeamTopNav backNavigation="/" cancelNavigation="/" /> */}

      <div class="flex items-center justify-center mt-2">
        <p class="text-xs text-gray-400">1 of 8</p>
      </div>

      {/* Space */}
      <div class="flex-grow"></div>

      {/* pick person to care */}
      <div class="px-2">
        <p class="text-[23px] font-semi">Who is receiving care?</p>
        <UserType
          name="I work in healthcare a setting"
          link="/team/create/someone/health-care-role"
        />
        <UserType
          name="I am a family, friend, or neighbour"
          link="/team/create/someone/family-role"
        />
        <UserType
          name="I play another role"
          link="/team/create/someone/another-role"
        />
        {/* Space for bottom */}
        <div class="h-[32px]"></div>
      </div>
    </div>
  );
}
