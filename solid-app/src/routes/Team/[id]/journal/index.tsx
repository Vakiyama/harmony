import { createSignal, Suspense } from "solid-js";
import Modal from "../../../../components/shared/modal";
import JournalFeed from "./journal-feed";
import { MetaProvider } from "@solidjs/meta";
import Notification from "~/components/shared/notification";
import {
  notificationMessage,
  isNotificationVisible,
  hideNotification,
} from "~/routes/api/notificationStore";
import TopNav from "~/components/shared/TopNav";
import { createAsync, useParams } from "@solidjs/router";
import { getTeamFromTeamId } from "~/api/team";

export default function Journal() {
  const [isModalOpen, setIsModalOpen] = createSignal(false);

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

  const params = useParams();
  const teamId = parseInt(params.id);
  const team = createAsync(async () => await getTeamFromTeamId(teamId), {
    deferStream: true,
  });

  return (
    <MetaProvider>
      <TopNav name={team()?.data.teams.teamName} rightNavigation={<>x</>} />
      <div class="flex flex-col text-start">
        <div class="flex flex-row justify-between items-center mx-2">
          <h2 class="font-medium text-[24px]">Journal Entries</h2>
          {/* <button
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
          </button> */}
        </div>
        <div class="">
          <Suspense fallback={<div>Loading...</div>}>
            <JournalFeed></JournalFeed>
          </Suspense>
        </div>

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
        class="absolute bottom-[90px] right-3 rounded-full w-14 h-14 bg-primary-purple-150 flex flex-col justify-center items-center"
        onClick={handleButtonClick}
      >
        <svg
          fill="#1E1E1E"
          opacity="0.5"
          stroke-width="0"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          height="24px"
          width="24px"
          style="overflow: visible; color: currentcolor;"
        >
          <path d="m362.7 19.3-48.4 48.4 130 130 48.4-48.4c25-25 25-65.5 0-90.5l-39.4-39.5c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2c-2.5 8.5-.2 17.6 6 23.8s15.3 8.5 23.7 6.1L151 475.7c14.1-4.2 27-11.8 37.4-22.2l233.3-233.2-130-130z"></path>
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
