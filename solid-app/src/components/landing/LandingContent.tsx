import {
  Tabs,
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsTrigger,
} from "~/components/ui/landing/landing-tabs";
import { createMemo, createResource, For, Show, useContext } from "solid-js";
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

const LandingContent = () => {
  const context = useContext(TeamContext);

  if (!context) {
    return <div>No team data available</div>;
  }

  const { teamListData, refetchTrigger } = context;

  const defaultTeam = () =>
    teamListData()?.find((team) => team.team.defaultTeam === true);

  const [getJournals] = createResource(
    () => {
      const teamId = defaultTeam()?.team.id;
      const refetch = refetchTrigger();
      return teamId ? { teamId, refetch } : undefined;
    },
    async ({ teamId }) => await getJournalsFromTeamId(teamId)
  );
  const journalsData = createMemo(() => getJournals());

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
        <TabsList class="w-full bg-white z-10 text-black px-2 overflow-x-scroll rounded-none pb-2">
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
        </div>
      </Tabs>
    </div>
  );
};

export default LandingContent;
