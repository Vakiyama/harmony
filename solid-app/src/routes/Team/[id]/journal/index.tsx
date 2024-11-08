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

  return (
    <MetaProvider>
      <div class="flex flex-col w-full text-start h-full">
        <div class="w-full flex flex-col gap-2 mt-20 overflow-hidden">
          <div class="flex flex-row justify-between items-center mx-2">
            <h2 class="font-medium text-[24px]">Journal Entry</h2>
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
          <div class="overflow-y-scroll">
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
      </div>
      {isNotificationVisible() && (
        <Notification
          title={notificationMessage()}
          onClose={hideNotification}
        />
      )}
    </MetaProvider>
  );
}
