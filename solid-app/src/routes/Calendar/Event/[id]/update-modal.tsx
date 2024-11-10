import { JSX } from "solid-js";
import ModalOption from "~/components/shared/modal-option";

export default function UpdateEventModal(props: {
  onClose?: () => void;
  children: JSX.Element;
  update: () => void;
}) {
  const handleClose = () => {
    if (props.onClose) {
      props.onClose();
    }
  };

  return (
    <div
      class="fixed inset-0 flex items-end justify-center bg-black bg-opacity-50"
      onClick={handleClose}
    >
      <div
        class="flex flex-col w-full bg-white rounded-t-[50px] p-[22px] items-center gap-2 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button class="flex mb-3 z-10" onClick={handleClose}>
          <svg
            width="122"
            height="2"
            viewBox="0 0 122 2"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="0.5"
              width="121"
              height="2"
              rx="1"
              fill="#1E1E1E"
              fill-opacity="0.5"
            />
          </svg>
        </button>
        <div class="flex justify-between w-full mb-3">
          <button
            class="text-[#1e1e1e] text-base font-normal font-sf-pro leading-tight"
            onclick={props.onClose}
          >
            Back
          </button>
          <p class="text-[#1e1e1e] text-[19px] font-medium font-grotesque leading-[22.80px]">
            Editing Details
          </p>
          <button
            class="text-[#1e1e1e] text-base font-normal font-sf-pro leading-tight"
            onclick={props.update}
          >
            Done
          </button>
        </div>

        {props.children}
      </div>
    </div>
  );
}
