import AddButton from "./add-button";
import ModalOption from "./modal-option";

interface ModalProps {
  onClose?: () => void;
}

export default function Modal(props: ModalProps) {
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
        <button class="flex items-center mb-6 z-10" onClick={handleClose}>
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
        <ModalOption
          title="Medication"
          description="Log to keep track of the medication schedule."
          link="/team/1/journal/medications"
          svg={
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_1600_5823)">
                <path
                  d="M16 32C20.2435 32 24.3131 30.3143 27.3137 27.3137C30.3143 24.3131 32 20.2435 32 16C32 11.7565 30.3143 7.68687 27.3137 4.68629C24.3131 1.68571 20.2435 0 16 0C11.7565 0 7.68687 1.68571 4.68629 4.68629C1.68571 7.68687 0 11.7565 0 16C0 20.2435 1.68571 24.3131 4.68629 27.3137C7.68687 30.3143 11.7565 32 16 32ZM14.5 21.5V17.5H10.5C9.66875 17.5 9 16.8312 9 16C9 15.1687 9.66875 14.5 10.5 14.5H14.5V10.5C14.5 9.66875 15.1687 9 16 9C16.8312 9 17.5 9.66875 17.5 10.5V14.5H21.5C22.3312 14.5 23 15.1687 23 16C23 16.8312 22.3312 17.5 21.5 17.5H17.5V21.5C17.5 22.3312 16.8312 23 16 23C15.1687 23 14.5 22.3312 14.5 21.5Z"
                  fill="#1E1E1E"
                  fill-opacity="0.75"
                />
              </g>
              <defs>
                <clipPath id="clip0_1600_5823">
                  <rect width="32" height="32" fill="white" />
                </clipPath>
              </defs>
            </svg>
          }
        />
        <ModalOption
          title="Mood"
          description="Keep track of daily moods to see how the day went."
          link="/team/1/journal/mood"
          svg={<AddButton />}
        />
        <ModalOption
          title="Nutrition"
          description="Log meals to track nutrition throughout the day."
          link="/team/1/journal/nutrition"
          svg={<AddButton />}
        />
        <ModalOption
          title="Sleep"
          description="Log sleep hours to track nightly rest patterns."
          link="/team/1/journal/sleep"
          svg={<AddButton />}
        />
        <ModalOption
          title="Note"
          description="Add personal notes for observations and details."
          link="/team/1/journal/notes"
          svg={<AddButton />}
        />
      </div>
    </div>
  );
}
