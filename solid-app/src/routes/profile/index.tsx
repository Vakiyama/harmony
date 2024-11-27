import { createAsync } from "@solidjs/router";
import { createSignal, Show } from "solid-js";
import { getUser } from "~/api";
import { getListOfTeams } from "~/api/team";
import ProfileHeaderHome from "~/components/profile/profile-header-home";
import ProfileUserName from "~/components/profile/profile-user-name";
import TeamCard from "~/components/profile/team-card";
import TeamModal from "~/components/profile/team-modal";
export default function Profile() {
  const [isModalOpen, setIsModalOpen] = createSignal(false);
  const user = createAsync(async () => await getUser(), { deferStream: true });
  const teams = createAsync(async () => await getListOfTeams(), {
    deferStream: true,
  });

  const handleButtonClick = () => {
    setIsModalOpen((prev) => !prev);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleBackdropClick = (e: Event) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };
  return (
    <>
      <ProfileHeaderHome />
      <section class="flex flex-col w-full justify-between items-center gap-2 p-2">
        <div class="fixed right-0 left-0 p-2 w-full flex flex-col justify-between h-[140px] bg-white gap-2">
          <Show when={user()}>
            <ProfileUserName
              photoUrl={user()?.photo}
              firstName={user()?.firstName}
              lastName={user()?.lastName}
            />
          </Show>
          <div class="flex flex-row w-full h-full justify-between">
            <h2 class="text-h3 font-medium">Your teams</h2>
            <button
              onClick={handleButtonClick}
              class="flex flex-row gap-1 w-[65px] h-[27px] bg-white items-center justify-center"
            >
              <p class="text-base">New</p>
              <svg
                fill="#7859EA"
                stroke-width="0"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                height="27px"
                width="27px"
                style="overflow: visible; color: currentcolor;"
              >
                <path d="M256 512a256 256 0 1 0 0-512 256 256 0 1 0 0 512zm-24-168v-64h-64c-13.3 0-24-10.7-24-24s10.7-24 24-24h64v-64c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24h-64v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"></path>
              </svg>
            </button>
          </div>
        </div>

        <div class="pt-[140px] w-full">
          <div class="w-full h-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1">
            <Show when={teams()}>
              {teams()
                ?.slice(0, 1)
                .map((team) => {
                  return (
                    <TeamCard
                      teamName={team.team.name || ""}
                      imageUrl={team.team.photo || ""}
                      href={`/team/${team.team.id}`}
                    />
                  );
                })}
            </Show>
            {isModalOpen() && (
              <div
                class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]"
                onClick={handleBackdropClick}
              >
                <TeamModal onClose={closeModal} />
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
