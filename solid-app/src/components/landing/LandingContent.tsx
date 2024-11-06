import {
  Tabs,
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsTrigger,
} from "~/components/ui/landing/landing-tabs";
import { JournalCard } from "./journal-card/JournalCard";
import { createAsync, useParams } from "@solidjs/router";
import { createMemo, Show } from "solid-js";
import { getJournalsFromTeamId } from "~/api/journal";
import ReallyTerrible from "~/routes/Team/[id]/journal/really-terrible";
import SomewhatBad from "~/routes/Team/[id]/journal/somewhat-bad";
import CompletelyOkay from "~/routes/Team/[id]/journal/completely-okay";
import PrettyGood from "~/routes/Team/[id]/journal/pretty-good";
import SuperAwesome from "~/routes/Team/[id]/journal/super-awesome";
import MedicationIcon from "../icon/medication-icon";
import MoodIcon from "../icon/mood-icon";
import NotesIcon from "../icon/notes-icon";
import LandingImage from "./LandingImage";
import NutritionIcon from "../icon/nutrition-icon";
import SleepIcon from "../icon/sleep-icon";

const LandingContent = () => {
  const teamId = useParams().id;
  const getJournals = createAsync(
    async () => await getJournalsFromTeamId(parseInt(teamId)),
    {
      deferStream: true,
    }
  );
  const journalsData = createMemo(() => getJournals());

  const getTabIcon = (tabName: string) => {
    switch (tabName) {
      case "Medication Taken":
        return (
          <MedicationIcon height="15" width="15" iconColor="currentColor" />
        );
      case "Nutrition": {
        return (
          <NutritionIcon height="15" width="15" iconColor="currentColor" />
        );
      }
      case "Sleep": {
        return <SleepIcon height="15" width="15" iconColor="currentColor" />;
      }
      case "Mood":
        return <MoodIcon height="15" width="15" iconColor="currentColor" />;
      case "Notes":
        return <NotesIcon height="15" width="15" iconColor="currentColor" />;
    }
  };

  const getWellbeingSVG = (param: string) => {
    switch (param) {
      case "REALLY TERRIBLE":
        return (
          <ReallyTerrible
            height="15"
            width="15"
            labelClass="text-subtitle"
            iconColour="rgba(0,0,0,0.75)"
          />
        );
      case "SOMEWHAT BAD":
        return (
          <SomewhatBad
            height="15"
            width="15"
            labelClass="text-subtitle"
            iconColour="rgba(0,0,0,0.75)"
          />
        );
      case "COMPLETELY OKAY":
        return (
          <CompletelyOkay
            height="15"
            width="15"
            labelClass="text-subtitle"
            iconColour="rgba(0,0,0,0.75)"
          />
        );
      case "PRETTY GOOD":
        return (
          <PrettyGood
            height="15"
            width="15"
            labelClass="text-subtitle"
            iconColour="rgba(0,0,0,0.75)"
          />
        );
      case "SUPER AWESOME":
        return (
          <SuperAwesome
            height="15"
            width="15"
            labelClass="text-subtitle"
            iconColour="rgba(0,0,0,0.75)"
          />
        );
      default:
        return;
    }
  };
  const formatCreatedDate = (date: Date) => {
    return `${new Date(date).toLocaleDateString("en-us", {
      month: "short",
      day: "numeric",
    })}. - ${new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    })}`;
  };
  return (
    <div class="">
      <Tabs defaultValue="medication taken" class="w-full">
        <TabsList class="w-full text-black px-2 overflow-scroll rounded-none pb-2">
          {["Medication Taken", "Nutrition", "Sleep", "Mood", "Notes"].map(
            (tabName) => (
              <TabsTrigger value={tabName.toLowerCase()} class="text-md">
                {getTabIcon(tabName)}
                <span class="ml-1">{tabName}</span>
              </TabsTrigger>
            )
          )}
          <TabsIndicator />
        </TabsList>

        <div class="p-2 overflow-y-scroll h-[calc(100vh_-_330px)]">
          {/* this pb and h-calc above is hacky, fix it*/}
          <Show when={journalsData()}>
            {journalsData()?.takenMedications.map((med) => {
              return (
                <JournalCard
                  dateTime={formatCreatedDate(med.date)}
                  title="Medication Taken"
                  value={"medication taken"}
                  withMember={true}
                  member={med.user}
                  entryId={med.id}
                  icon={
                    <MedicationIcon
                      height="15"
                      width="15"
                      iconColor="#FE7258"
                    />
                  }
                  sections={[
                    {
                      title: "Taken or Skipped?",
                      content: (
                        <p class="text-subtitle">
                          {med.hasMissed ? "Missed" : "Taken"}
                        </p>
                      ),
                    },
                    {
                      title: "Selected Medication",
                      content: (
                        <p class="text-subtitle">{med.medications!.name}</p>
                      ),
                    },
                    {
                      title: "Medication Type",
                      content: <p class="text-subtitle">{med.type}</p>,
                    },
                    {
                      title: "Date & Time Taken",
                      content: (
                        <p class="text-subtitle">
                          {`${new Date(med.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })} - ${new Date(med.date).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "numeric",
                              minute: "2-digit",
                            }
                          )}`}
                        </p>
                      ),
                    },
                    ...(med.note
                      ? [
                          {
                            title: "Additional Notes",
                            content: (
                              <p class="text-subtitle">{med.note.note}</p>
                            ),
                          },
                          // {
                          //   content: (
                          //     <>
                          //       Images
                          //       <div class="flex flex-row gap-x-2">
                          //         <LandingImage />
                          //         <LandingImage />
                          //       </div>
                          //     </>
                          //   ),
                          // },
                        ]
                      : []),
                  ]}
                />
              );
            })}
          </Show>
          <Show when={journalsData()}>
            {journalsData()?.moods.map((mood) => {
              return (
                <JournalCard
                  dateTime={formatCreatedDate(mood.createdAt)}
                  title="Mood"
                  value={"mood"}
                  withMember={true}
                  member={mood.user}
                  entryId={mood.id}
                  icon={<MoodIcon width="14" height="14" iconColor="#FE83B0" />}
                  sections={[
                    {
                      title: "Mood",
                      content: (
                        <div class="text-subtitle text-black/75">
                          <div class="flex flex-row gap-x-1 items-center align-middle leading-none">
                            {getWellbeingSVG(mood.wellBeing)}
                          </div>
                        </div>
                      ),
                    },
                    {
                      title: "Time of Day",
                      content: (
                        <p class="text-subtitle text-black/75">
                          {mood.timeFrame}
                        </p>
                      ),
                    },
                    {
                      title: "Date",
                      content: (
                        <p class="text-subtitle text-black/75">
                          {mood.date.toLocaleDateString("en-us", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      ),
                    },
                    ...(mood.note
                      ? [
                          {
                            title: `What ${mood.user!.firstName} Noticed`,
                            content: (
                              <p class="text-subtitle">{mood.note.note}</p>
                            ),
                          },
                          // {
                          //   content: (
                          //     <>
                          //       Images
                          //       <div class="flex flex-row gap-x-2">
                          //         <LandingImage />
                          //         <LandingImage />
                          //       </div>
                          //     </>
                          //   ),
                          // },
                        ]
                      : []),
                  ]}
                />
              );
            })}
          </Show>

          <Show when={journalsData()}>
            {journalsData()?.notes.map((data) => {
              return (
                <JournalCard
                  dateTime={formatCreatedDate(data.createdAt)}
                  title="Notes"
                  value={"notes"}
                  withMember={true}
                  member={data.user}
                  entryId={data.id}
                  icon={
                    <NotesIcon
                      width="14"
                      height="14"
                      iconColor="#F7D844"
                      bgColor="#4E412B"
                    />
                  }
                  sections={[
                    {
                      title: "New Update",
                      content: <p class="text-subtitle">{data.note}</p>,
                    },
                    // {
                    //   content: (
                    //     <>
                    //       {/* Images */}
                    //       <div class="flex flex-row gap-x-2">
                    //         <LandingImage />
                    //         <LandingImage />
                    //       </div>
                    //     </>
                    //   ),
                    // },
                  ]}
                />
              );
            })}
          </Show>
          <Show when={journalsData()}>
            {journalsData()?.meals.map((meal) => {
              return (
                <JournalCard
                  dateTime={formatCreatedDate(meal.createdAt)}
                  title="Nutrition"
                  value={"nutrition"}
                  withMember={true}
                  member={meal.user}
                  entryId={meal.id}
                  icon={
                    <NutritionIcon
                      width="14"
                      height="14"
                      iconColor="#6FC94F"
                      bgColor="#19370E"
                    />
                  }
                  sections={[
                    {
                      title: "Meal Type",
                      content: <p class="text-subtitle">{meal.category}</p>,
                    },
                    {
                      title: `How much did ${meal.recipient!.firstName} eat?`,
                      content: (
                        <p class="text-subtitle">
                          {meal.recipient!.firstName} ate{" "}
                          {meal.consumption.toLowerCase()} of her meal.
                        </p>
                      ),
                    },
                    ...(meal.foodName
                      ? [
                          {
                            title: "Food Name",
                            content: (
                              <p class="text-subtitle">{meal.foodName}</p>
                            ),
                          },
                        ]
                      : []),
                    ...(meal.drinkName
                      ? [
                          {
                            title: "Drink Name",
                            content: (
                              <p class="text-subtitle">{meal.drinkName}</p>
                            ),
                          },
                        ]
                      : []),
                    {
                      title: "Date",
                      content: (
                        <p class="text-subtitle text-black/75">
                          {meal.date.toLocaleDateString("en-us", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      ),
                    },
                    ...(meal.note
                      ? [
                          {
                            title: "Additional Notes",
                            content: (
                              <p class="text-subtitle">{meal.note.note}</p>
                            ),
                          },
                          // {
                          //   content: (
                          //     <>
                          //       {/* Images */}
                          //       <div class="flex flex-row gap-x-2">
                          //         <LandingImage />
                          //         <LandingImage />
                          //       </div>
                          //     </>
                          //   ),
                          // },
                        ]
                      : []),
                  ]}
                />
              );
            })}
          </Show>
          <Show when={journalsData()}>
            {journalsData()?.sleeps.map((sleep) => {
              return (
                <JournalCard
                  dateTime={formatCreatedDate(sleep.createdAt)}
                  title="Sleep"
                  value={"sleep"}
                  withMember={true}
                  member={sleep.user}
                  entryId={sleep.id}
                  icon={
                    <SleepIcon
                      height="15"
                      width="15"
                      iconColor="#7F99DD"
                      bgColor="#091E54"
                    />
                  }
                  sections={[
                    {
                      title: `How did ${sleep.recipient!.firstName} sleep?`,
                      content: (
                        <div class="text-subtitle ">
                          <div class="flex flex-row gap-x-1">
                            {getWellbeingSVG(sleep.quality)}
                          </div>
                        </div>
                      ),
                    },
                    {
                      title: "Day or Night?",
                      content: <p class="text-subtitle ">{sleep.timeFrame}</p>,
                    },
                    {
                      title: "Trouble Going to Sleep?",
                      content: (
                        <p class="text-subtitle ">
                          {sleep.troubleSleeping ? "Yes" : "No"}
                        </p>
                      ),
                    },
                    {
                      title: "Date",
                      content: (
                        <p class="text-subtitle text-black/75">
                          {sleep.date.toLocaleDateString("en-us", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      ),
                    },
                    ...(sleep.note
                      ? [
                          {
                            title: "Additional Notes",
                            content: (
                              <p class="text-subtitle ">{sleep.note.note}</p>
                            ),
                          },
                        ]
                      : []),
                  ]}
                />
              );
            })}
          </Show>
        </div>
      </Tabs>
    </div>
  );
};

export default LandingContent;
