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
    <div class="fixed inset-0 flex items-end justify-center bg-black bg-opacity-50">
      <div class="flex flex-col w-full bg-white rounded-t-[50px] p-[22px] items-center gap-2">
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
          link="/journal/medications"
        />
        <ModalOption
          title="Mood"
          description="Keep track of daily moods to see how the day went."
          link="/journal/mood-tracker"
        />
        <ModalOption
          title="Nutrition"
          description="Log meals to track nutrition throughout the day."
          link="/journal/nutrition-tracker"
        />
        <ModalOption
          title="Sleep"
          description="Log sleep hours to track nightly rest patterns."
          link="/journal/sleep-tracker"
        />
        <ModalOption
          title="Note"
          description="Add personal notes for observations and details."
          link="/journal/notes"
        />
      </div>
    </div>
  );
}
