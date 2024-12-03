import { createEffect, createSignal, onMount, Suspense } from "solid-js";
import Modal from "../../../../components/shared/modal";
import { MetaProvider } from "@solidjs/meta";
import Notification from "~/components/shared/notification";
import {
  notificationMessage,
  isNotificationVisible,
  hideNotification,
} from "~/routes/api/notificationStore";
import TopNav from "~/components/shared/TopNav";
import { createAsync, useParams } from "@solidjs/router";
import { getListOfTeams, getTeamFromTeamId } from "~/api/team";
import { TeamWithDefault } from "@/schema/Teams";
import { useTeam } from "~/context/team-context";
import LandingContent from "~/components/landing/LandingContent";
import { Button } from "~/components/ui/button";
import TeamModal from "~/components/profile/team-modal";

export default function Journal() {
  const [teamListData, setTeamListData] = createSignal<
    { team: TeamWithDefault }[] | undefined
  >(undefined);
  const teamContext = useTeam();
  createEffect(async () => {
    const teamData = await getListOfTeams();
    setTeamListData(teamData);
  });
  onMount(async () => {
    const teamData = await getListOfTeams();
    const defaultTeam = teamData.find((team) => team.team.defaultTeam);
    if (defaultTeam && teamContext.state.id === -1) {
      teamContext.updateTeamId(defaultTeam.team.id);
    }
  });
  const [isModalOpen, setIsModalOpen] = createSignal(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = createSignal(false);
  // const [isSideMenuOpen, setIsSideMenuOpen] = createSignal(false);

  const openTeamModal = () => {
    setIsTeamModalOpen(true);
  };

  const openJournalModal = () => {
    if (teamListData()?.length) {
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleBackdropClick = (e: Event) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const params = useParams();
  const teamId = parseInt(params.id);
  const team = createAsync(async () => await getTeamFromTeamId(teamId), {
    deferStream: true,
  });

  return (
    <MetaProvider>
      <TopNav
        forTeamSetting={{
          teamData: teamListData(),
          defaultSetter: setTeamListData,
        }}
      />
      <div class="flex flex-col text-start mx-2">
        <div class="flex flex-row justify-between items-center">
          <h2 class="font-medium text-[24px]">Journal Entries</h2>
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          {teamListData()?.length ? (
            <LandingContent />
          ) : (
            <div class="flex flex-col gap-5 h-full">
              <div class="mt-4 text-center text-gray-600 border rounded-xl flex flex-col p-4 items-center justify-center gap-3 flex-grow min-h-[100px] h-[calc(100dvh_-_410px)]">
                <svg
                  width="24"
                  height="17"
                  viewBox="0 0 24 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_5904_1275)">
                    <path
                      d="M9.75935 1.24941C8.25406 0.530721 6.15007 0.178667 3.33322 0.166168C3.06757 0.162559 2.80712 0.240024 2.58662 0.388233C2.40563 0.510568 2.25747 0.675504 2.15518 0.868532C2.05289 1.06156 1.9996 1.27677 2 1.49522V13.4151C2 14.2208 2.57329 14.8287 3.33322 14.8287C6.29423 14.8287 9.26439 15.1053 11.0434 16.7869C11.0677 16.81 11.0983 16.8254 11.1314 16.8313C11.1644 16.8372 11.1985 16.8332 11.2293 16.8199C11.2601 16.8065 11.2863 16.7845 11.3046 16.7564C11.323 16.7283 11.3327 16.6954 11.3326 16.6619V2.6168C11.3326 2.52204 11.3124 2.42836 11.2731 2.34211C11.2339 2.25586 11.1766 2.17904 11.1051 2.11684C10.6976 1.76847 10.2449 1.47669 9.75935 1.24941ZM21.4117 0.386983C21.1911 0.239143 20.9306 0.16211 20.6651 0.166168C17.8483 0.178667 15.7443 0.529054 14.239 1.24941C13.7534 1.47628 13.3007 1.76748 12.8928 2.11517C12.8215 2.17748 12.7643 2.25433 12.7252 2.34057C12.686 2.4268 12.6658 2.52042 12.6658 2.61513V16.661C12.6658 16.6933 12.6753 16.7248 12.6931 16.7517C12.7109 16.7786 12.7363 16.7996 12.766 16.8121C12.7958 16.8246 12.8285 16.828 12.8602 16.822C12.8919 16.8159 12.921 16.8007 12.9441 16.7781C14.0136 15.7157 15.8905 14.8274 20.6668 14.8279C21.0204 14.8279 21.3595 14.6874 21.6095 14.4374C21.8595 14.1873 22 13.8482 22 13.4946V1.49564C22.0005 1.27675 21.9471 1.06111 21.8445 0.867758C21.7419 0.674404 21.5932 0.509286 21.4117 0.386983Z"
                      fill="#937AEE"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_5904_1275">
                      <rect
                        width="24"
                        height="16.6679"
                        fill="white"
                        transform="translate(0 0.166016)"
                      />
                    </clipPath>
                  </defs>
                </svg>
                <p class="text-lg">
                  Please create or join a team to view your journal.
                </p>
              </div>
              <button
                onClick={openTeamModal}
                class="h-[48px] font-medium bg-primary-purple-500 rounded-[100px] text-white"
              >
                Create / Join Team
              </button>
            </div>
          )}
          {isTeamModalOpen() && (
            <div
              class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]"
              onClick={handleBackdropClick}
            >
              <TeamModal onClose={closeModal} />
            </div>
          )}
        </Suspense>

        {isModalOpen() && (
          <div
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]" //temporary z-60 to override navbar
            onClick={handleBackdropClick}
          >
            <Modal onClose={closeModal} />
          </div>
        )}
      </div>
      {teamListData()?.length ? (
        <button
          class="absolute bottom-[90px] right-3 rounded-full w-[65px] h-[65px] bg-primary-purple-500 flex flex-col justify-center items-center shadow-[4px_4px_4px_rgba(0,0,0,0.25)]"
          onClick={openJournalModal}
        >
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18.519 36.8433L34.0194 21.343L26.657 13.9806L11.1567 29.481C10.9433 29.6946 10.7917 29.962 10.718 30.2549L9 39L17.7434 37.282C18.037 37.2086 18.3056 37.0568 18.519 36.8433ZM39.0233 16.3391C39.6487 15.7135 40 14.8652 40 13.9806C40 13.096 39.6487 12.2477 39.0233 11.6221L36.3779 8.97671C35.7523 8.35132 34.904 8 34.0194 8C33.1348 8 32.2865 8.35132 31.6609 8.97671L29.0155 11.6221L36.3779 18.9845L39.0233 16.3391Z"
              fill="#FCFCFC"
            />
          </svg>
        </button>
      ) : (
        ""
      )}
      {isNotificationVisible() && (
        <Notification
          title={notificationMessage()}
          onClose={hideNotification}
        />
      )}
    </MetaProvider>
  );
}
