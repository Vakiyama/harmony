import ModalOption from "./modal-option";
import { createSignal, onMount } from "solid-js";
import { useTeam } from "~/context/team-context";
import { getListOfTeams } from "~/api/team";

interface ModalProps {
  onClose?: () => void;
}

export default function Modal(props: ModalProps) {
  const team = useTeam();
  const [teamId, setTeamId] = createSignal<number | undefined>();
  onMount(async () => {
    if (team.state.id === -1 || team.state.id === undefined) {
      const teamData = await getListOfTeams();
      const defaultTeam = teamData.find(
        (team) => team.team.defaultTeam === true
      );
      if (!defaultTeam) return;
      setTeamId(defaultTeam?.team.id || undefined);
      team.updateTeamId(defaultTeam?.team.id!);
    } else {
      setTeamId(team.state.id);
    }
  });

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
          link={`/team/${teamId()}/journal/medications`}
          background="medicationTakenBackground"
          iconBackground="#5B0E00"
        />
        <ModalOption
          title="Mood"
          description="Keep track of daily moods to see how the day went."
          link={`/team/${teamId()}/journal/mood`}
          background="moodBackground"
          iconBackground="#761739"
        />
        <ModalOption
          title="Nutrition"
          description="Log meals to track nutrition throughout the day."
          link={`/team/${teamId()}/journal/nutrition`}
          background="nutritionBackground"
          iconBackground="#19370E"
        />
        <ModalOption
          title="Sleep"
          description="Log sleep hours to track nightly rest patterns."
          link={`/team/${teamId()}/journal/sleep`}
          background="sleepBackground"
          iconBackground="#091E54"
        />
        <ModalOption
          title="Note"
          description="Add personal notes for observations and details."
          link={`/team/${teamId()}/journal/notes`}
          background="notesBackground"
          iconBackground="#4E412B"
        />
      </div>
    </div>
  );
}
