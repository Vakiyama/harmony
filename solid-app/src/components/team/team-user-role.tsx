import { For } from "solid-js";
import UserType from "~/components/team/user-type";
import { useTeam } from "~/context/team-context";
import { Button } from "../ui/button";

const userRole = [
  {
    title: "Administrators",
    name: "Add a Co-Admin",
    description: "People who can send out invites, and fill out patient info.",
  },
  {
    title: "Members",
    name: "Add a Member",
    description: "People who can collaborate with the team.",
  },
];
export default function TeamUserRole() {
  const team = useTeam();
  return (
    <>
      <p class="flex justify-center text-subtitle13 text-stepsGray mt-3">
        8 of 8
      </p>
      <div class="flex items-center justify-start flex-col h-full mt-4 mb-[19px] mx-3">
        <h2 class="self-start text-h2 font-grotesque leading-[120%]">
          Invite Members to {team.state.recipient.firstName}'s care team
        </h2>
        <p class="self-start text-subtitle13 leading-[120%] text-[#787878] mb-[13px] mt-1 font-normal">
          Adding members to this care team will give them the ability to add
          posts, events and access shared documents.
        </p>
        <p class="self-start text-subtitle13 leading-[120%] text-[#787878] font-normal">
          You can always add or remove more members later in the app.
        </p>
        <div class="w-full">
          <For each={userRole}>
            {(role) => {
              return (
                <div class="mt-[74px]">
                  <h3 class="text-h4 font-grotesque leading-[120%] inline-block">
                    {role.title}
                  </h3>
                  <p class="self-start text-subtitle13 leading-[120%] text-[#787878] mb-[13px] mt-1 font-normal">
                    {role.description}
                  </p>
                  <Button
                    type="button"
                    onClick={() => {}}
                    class="rounded-full w-full mt-3 bg-primary-purple-150 text-black text-base h-12"
                  >
                    {role.name}
                  </Button>
                  {/* <UserType
                    name={role.name}
                    description={role.description}
                    onClick={() => {}}
                    /> */}
                </div>
              );
            }}
          </For>
        </div>
        <div class="flex flex-col justify-end w-full flex-grow">
          <a
            onClick={team.nextStep}
            class="self-center text-subtitle13 mt-2 mb-[18px]"
          >
            Skip for now
          </a>
        </div>
      </div>
    </>
  );
}
