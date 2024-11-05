import { useParams } from "@solidjs/router";
import ModalOption from "./modal-option";

interface ModalProps {
  onClose?: () => void;
}

export default function Modal(props: ModalProps) {
  const params = useParams();

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
        class="flex flex-col w-full bg-white rounded-t-[50px] p-[22px] items-center gap-[18px] z-10"
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
          link={`/team/${params.id}/journal/medications`}
          background="medicationTakenBackground"
          iconBackground="#5B0E00"
        />
        <ModalOption
          title="Mood"
          description="Keep track of daily moods to see how the day went."
          link={`/team/${params.id}/journal/mood`}
          background="moodBackground"
          iconBackground="#761739"
        />
        <ModalOption
          title="Nutrition"
          description="Log meals to track nutrition throughout the day."
          link={`/team/${params.id}/journal/nutrition`}
          background="nutritionBackground"
          iconBackground="#19370E"
        />
        <ModalOption
          title="Sleep"
          description="Log sleep hours to track nightly rest patterns."
          link={`/team/${params.id}/journal/sleep`}
          background="sleepBackground"
          iconBackground="#091E54"
        />
        <ModalOption
          title="Note"
          description="Add personal notes for observations and details."
          link={`/team/${params.id}/journal/notes`}
          background="notesBackground"
          iconBackground="#4E412B"
        />
      </div>
    </div>
  );
}
