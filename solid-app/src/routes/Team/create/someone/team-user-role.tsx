import { A } from "@solidjs/router";
import { For, onCleanup, onMount, useContext } from "solid-js";
import TopNav from "~/components/shared/TopNav";
import TeamTopNav from "~/components/team/team-top-nav";
import UserType from "~/components/team/user-type";
import { Button } from "~/components/ui/button";

const userRole = [
  {
    name: "Add an admin",
    description: "Can manage the team and can edit care recipient info",
  },
  {
    name: "Add a member",
    description: "Can manage the team and can edit care recipient info",
  },
];
export default function TeamUserRole() {
  return (
    <div class="relative flex flex-col min-h-screen">
      <TeamTopNav backNavigation="/" cancelNavigation="/" />

      <div class="flex items-center justify-center mt-2">
        <p class="text-xs text-gray-400">1 of 8</p>
      </div>

      {/* Space */}
      <div class="flex-grow"></div>

      <div class="px-2 mx-4">
        <p class="text-[23px] font-semi">Add members to "Users" team</p>
        <For each={userRole}>
          {(role) => (
            <UserType
              name={role.name}
              description={role.description}
              onClick={() => {}}
            />
          )}
        </For>
        <div class="flex flex-col items-center justify-center mt-6">
          <Button class="rounded-full w-full mt-4 bg-[#AE9BF2] text-black h-[50px]">
            Next
          </Button>
          <A href="/" class="text-xs p-2">
            skip for now
          </A>
        </div>
      </div>
      {/* Space for bottom */}
      <div class="h-[32px]"></div>
    </div>
  );
}
