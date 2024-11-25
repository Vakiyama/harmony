import {
  Tabs,
  TabsIndicator,
  TabsList,
  TabsTrigger,
} from "~/components/ui/landing/landing-tabs";
import {
  createEffect,
  createMemo,
  createResource,
  createSignal,
  For,
  onMount,
  Show,
  useContext,
} from "solid-js";
import { getJournalsFromTeamId } from "~/api/journal";
import MedicationIcon from "../icon/medication-icon";
import MoodIcon from "../icon/mood-icon";
import NotesIcon from "../icon/notes-icon";
import NutritionIcon from "../icon/nutrition-icon";
import SleepIcon from "../icon/sleep-icon";
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

const LandingContent = () => {
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
  const journalsData = createMemo(() => getJournals());

  createEffect(() => console.log(defaultTeam()));

  const getTabIcon = (tabName: string) => {
    switch (tabName) {
      case "Medication Taken":
        return (
          <MedicationIcon
            height="15"
            width="15"
            iconColor="currentColor"
            class="mr-1"
          />
        );
      case "Nutrition": {
        return (
          <NutritionIcon
            height="15"
            width="15"
            iconColor="currentColor"
            class="mr-1"
          />
        );
      }
      case "Sleep": {
        return (
          <SleepIcon
            height="15"
            width="15"
            iconColor="currentColor"
            class="mr-1"
          />
        );
      }
      case "Mood":
        return (
          <MoodIcon
            height="15"
            width="15"
            iconColor="currentColor"
            class="mr-1"
          />
        );
      case "Notes":
        return (
          <NotesIcon
            height="15"
            width="15"
            iconColor="currentColor"
            class="mr-1"
          />
        );
    }
  };

  return (
    <div class="">
      <Tabs defaultValue="all" class="w-full">
        <TabsList class="w-full bg-white text-black px-2 overflow-x-scroll">
          {[
            "All",
            "Medication Taken",
            "Nutrition",
            "Sleep",
            "Mood",
            "Notes",
          ].map((tabName) => (
            <TabsTrigger value={tabName.toLowerCase()} class="text-md">
              {getTabIcon(tabName)}
              <span class="">{tabName}</span>
            </TabsTrigger>
          ))}
          <TabsIndicator />
        </TabsList>

        <div class="p-2 flex-grow h-full">
          <Show when={journalsData()}>
            <For each={journalsData()}>
              {(entry) => {
                switch (entry.type) {
                  case "medication":
                    return (
                      <MedicationCard
                        med={entry.data as TakenMedsWithNoteUser}
                      />
                    );
                  case "mood":
                    return <MoodCard mood={entry.data as MoodsWithNoteUser} />;
                  case "note":
                    return <NoteCard note={entry.data as NoteWithUser} />;
                  case "meal":
                    return <MealCard meal={entry.data as MealWithNoteUser} />;
                  case "sleep":
                    return (
                      <SleepCard sleep={entry.data as SleepWithNoteUser} />
                    );
                  default:
                    return null;
                }
              }}
            </For>
          </Show>
          <Show when={!journalsData() || journalsData()?.length === 0}>
            <div class="border rounded-xl flex flex-col p-4 items-center justify-center gap-3 flex-grow min-h-[100px] h-[calc(100dvh_-_410px)]">
              <img src={BookIconSVG} class="h-6" />
              <p class="text-xs text-[#1E1E1E]/75  text-center">
                Recent care team activity will <br /> show here.
              </p>
            </div>
          </Show>
        </div>
      </Tabs>
    </div>
  );
};

export default LandingContent;
