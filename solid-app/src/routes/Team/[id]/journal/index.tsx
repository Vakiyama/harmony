import { createSignal, Suspense } from "solid-js";
import Modal from "../../../../components/shared/modal";
import JournalFeed from "./journal-feed";
import { LandingHeader } from "~/components/landing/LandingHeader";
import { MetaProvider } from "@solidjs/meta";

export default function Journal() {
  const currentDate = new Date();

  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    month: "long",
    day: "numeric",
  };

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
      <div class="flex flex-col w-full text-start h-[calc(100%-100px)]">
        <span class="mt-4">
          <LandingHeader />
        </span>
        <div class="flex flex-col gap-2 mt-6">
          <h2 class="font-medium text-[24px] mx-4">Journal Entry</h2>
          <Suspense fallback={<div>im loading bro</div>}>
            <JournalFeed></JournalFeed>
          </Suspense>
          <button
            onClick={handleButtonClick}
            class="absolute bottom-24 right-4 flex rounded-full w-14 h-14 bg-white shadow-md items-center justify-center"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_363_263)">
                <path
                  d="M17.0015 0.904785L14.7328 3.17353L20.8265 9.26728L23.0953 6.99853C24.2672 5.82666 24.2672 3.92822 23.0953 2.75635L21.2484 0.904785C20.0765 -0.26709 18.1781 -0.26709 17.0062 0.904785H17.0015ZM13.6734 4.23291L2.74686 15.1642C2.25936 15.6517 1.90311 16.2563 1.70623 16.9173L0.0468553 22.5563C-0.0703322 22.9548 0.0374803 23.3813 0.328105 23.672C0.61873 23.9626 1.04529 24.0704 1.43904 23.9579L7.07811 22.2985C7.73904 22.1017 8.34373 21.7454 8.83123 21.2579L19.7672 10.3267L13.6734 4.23291Z"
                  fill="black"
                  fill-opacity="0.5"
                />
              </g>
              <defs>
                <clipPath id="clip0_363_263">
                  <rect width="24" height="24" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </button>

          {isModalOpen() && (
            <div
              class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]" //temporary z-60 to override navbar
              onClick={handleBackdropClick}
            >
              <Modal onClose={closeModal} />
            </div>
          )}
        </div>
        <div class="h-[88px]"></div> {/* Temporary */}
      </div>
    </MetaProvider>
  );
}
