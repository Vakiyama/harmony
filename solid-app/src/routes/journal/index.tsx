import { createSignal } from "solid-js";
import Modal from "./modal";

export default function Journal() {
  const currentDate = new Date();

  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    month: "long",
    day: "numeric",
  };

  const formattedDate = currentDate.toLocaleDateString("en-US", options);

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
    <main class="w-full h-full mt-[120px] p-4 flex items-center justify-center space-y-2">
      <div class="mt-8 mb-8 flex flex-col w-full text-start">
        <div class="flex items-center gap-4">
          <h1 class="flex text-[28px]">Lola's Care Circle</h1>
          <div class="flex flex-row flex-grow items-center justify-between">
            <div class="flex w-3 h-full">
              <svg
                width="15"
                height="9"
                viewBox="0 0 15 9"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.61753 8.5082C7.10562 8.99629 7.89828 8.99629 8.38637 8.5082L14.6339 2.26064C15.122 1.77255 15.122 0.979891 14.6339 0.4918C14.1458 0.00370978 13.3532 0.00370978 12.8651 0.4918L7.5 5.85689L2.13491 0.495705C1.64682 0.00761415 0.854158 0.00761415 0.366068 0.495705C-0.122023 0.983795 -0.122023 1.77645 0.366068 2.26454L6.61363 8.5121L6.61753 8.5082Z"
                  fill="#1E1E1E"
                />
              </svg>
            </div>
            <div class="flex justify-self-end">
              <svg
                width="27"
                height="27"
                viewBox="0 0 27 27"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.5 24.75C14.1967 24.7509 14.8764 24.5347 15.4446 24.1314C16.0127 23.7282 16.4411 23.158 16.6703 22.5H10.3298C10.5589 23.158 10.9873 23.7282 11.5555 24.1314C12.1236 24.5347 12.8033 24.7509 13.5 24.75ZM21.375 16.4093V11.25C21.375 7.63088 18.9169 4.58213 15.5869 3.66525C15.2573 2.835 14.4518 2.25 13.5 2.25C12.5483 2.25 11.7428 2.835 11.4131 3.66525C8.08313 4.58325 5.625 7.63088 5.625 11.25V16.4093L3.70463 18.3296C3.59995 18.4339 3.51694 18.5579 3.46037 18.6944C3.4038 18.8309 3.37479 18.9772 3.375 19.125V20.25C3.375 20.5484 3.49353 20.8345 3.70451 21.0455C3.91548 21.2565 4.20163 21.375 4.5 21.375H22.5C22.7984 21.375 23.0845 21.2565 23.2955 21.0455C23.5065 20.8345 23.625 20.5484 23.625 20.25V19.125C23.6252 18.9772 23.5962 18.8309 23.5396 18.6944C23.4831 18.5579 23.4001 18.4339 23.2954 18.3296L21.375 16.4093Z"
                  fill="#1E1E1E"
                />
              </svg>
            </div>
          </div>
        </div>
        <p class="text-base mb-[16px]">{formattedDate}</p>
        <div class="flex flex-col gap-2 mt-2">
          <h2 class="font-medium text-[24px]">Journal Entry</h2>
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
              class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
              onClick={handleBackdropClick}
            >
              <Modal onClose={closeModal} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
