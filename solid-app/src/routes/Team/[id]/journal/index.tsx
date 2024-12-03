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
import { getListOfTeams } from "~/api/team";
import { TeamWithDefault } from "@/schema/Teams";
import { useTeam } from "~/context/team-context";
import LandingContent from "~/components/landing/LandingContent";

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
  // const [isSideMenuOpen, setIsSideMenuOpen] = createSignal(false);

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
          <LandingContent />
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
      <button
        class="absolute bottom-[90px] right-3 rounded-full w-[65px] h-[65px] bg-primary-purple-500 flex flex-col justify-center items-center shadow-[4px_4px_4px_rgba(0,0,0,0.25)]"
        onClick={handleButtonClick}
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
      {isNotificationVisible() && (
        <Notification
          title={notificationMessage()}
          onClose={hideNotification}
        />
      )}
    </MetaProvider>
  );
}
