import {
  createMemo,
  createResource,
  createSignal,
  For,
  onMount,
  Show,
  useContext,
} from "solid-js";
import { getJournalsFromTeamId } from "~/api/journal";
import { TeamContext } from "../Layout-Context";
import MedicationCard from "./journal-card/MedicationCard";
import MoodCard from "./journal-card/MoodCard";
import NoteCard from "./journal-card/NoteCard";
import MealCard from "./journal-card/MealCard";
import SleepCard from "./journal-card/SleepCard";
import { TakenMedsWithNoteUser } from "@/schema/TakenMedications";
import { MoodsWithNoteUser } from "@/schema/Moods";
import { NoteWithUser } from "@/schema/Notes";
import { MealWithNoteUser } from "@/schema/Meals";
import { SleepWithNoteUser } from "@/schema/Sleeps";
import { useTeam } from "~/context/team-context";
import BookIconSVG from "./IoBook.svg";
import { TeamWithDefault } from "@/schema/Teams";
import JournalsToggleGroup from "../shadcn/toggle-group";

const LandingContent = () => {
  const categoryMap: { [key: string]: string } = {
    "Medication Taken": "medication",
    Nutrition: "meal",
    Sleep: "sleep",
    Mood: "mood",
    Notes: "note",
  };
  const [selectedOuter, setSelectedOuter] = createSignal<string | null>("All");
  const [selectedInner, setSelectedInner] = createSignal<string[]>([]);
  const context = useContext(TeamContext);
  const team = useTeam();
  const [defaultTeam, setDefaultTeam] = createSignal<
    { team: TeamWithDefault } | undefined
  >(undefined);
  if (!context) {
    return <div>No team data available</div>;
  }

  const { teamListData, refetchTrigger } = context;

  onMount(async () => {
    setDefaultTeam(
      teamListData()?.find((team) => team.team.defaultTeam === true)
    );
  });
  const [getJournals] = createResource(
    () => {
      const teamId =
        team.state.id !== -1 ? team.state.id : defaultTeam()?.team.id;
      const refetch = refetchTrigger();
      return teamId ? { teamId, refetch } : undefined;
    },
    async ({ teamId }) => await getJournalsFromTeamId(teamId)
  );
  const currentCards = createMemo(() => {
    let filtered = getJournals() || [];
    const outer = selectedOuter();
    const inner = selectedInner();

    if (outer && outer !== "All") {
      filtered = filtered.filter((entry) => entry.type === outer);
    }

    if (inner.length > 0) {
      let filterArr = inner.map((filter) => categoryMap[filter]);
      filtered = filtered.filter((entry) => filterArr.includes(entry.type));
    }

    return filtered;
  });

  return (
    <div class="">
      <div class="w-full flex flex-wrap justify-center items-center pt-2 px-2">
        <JournalsToggleGroup
          items={["Medication Taken", "Nutrition", "Sleep", "Mood", "Notes"]}
          getOuter={selectedOuter}
          getInner={selectedInner}
          setInner={setSelectedInner}
          setOuter={setSelectedOuter}
        />
      </div>
      <div class="p-2 flex flex-col gap-3 h-full">
        <Show when={currentCards()}>
          <For each={currentCards()}>
            {(entry) => {
              switch (entry.type) {
                case "medication":
                  return (
                    <MedicationCard med={entry.data as TakenMedsWithNoteUser} />
                  );
                case "mood":
                  return <MoodCard mood={entry.data as MoodsWithNoteUser} />;
                case "note":
                  return <NoteCard note={entry.data as NoteWithUser} />;
                case "meal":
                  return <MealCard meal={entry.data as MealWithNoteUser} />;
                case "sleep":
                  return <SleepCard sleep={entry.data as SleepWithNoteUser} />;
                default:
                  return null;
              }
            }}
          </For>
        </Show>
        <Show when={!currentCards() || currentCards()?.length === 0}>
          <div class="border rounded-xl flex flex-col p-4 items-center justify-center gap-3 flex-grow min-h-[100px] h-[calc(100dvh_-_410px)]">
            <img src={BookIconSVG} class="h-6" />
            <p class="text-xs text-[#1E1E1E]/75  text-center">
              Recent care team activity will <br /> show here.
            </p>
          </div>
        </Show>
      </div>
    </div>
  );
};

export default LandingContent;
