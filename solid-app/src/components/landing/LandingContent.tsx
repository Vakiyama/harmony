import {
  Tabs,
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsTrigger,
} from "~/components/ui/landing/landing-tabs";
import LandingImage from "./LandingImage";
import { JournalCard } from "./journal-card/JournalCard";
import { createAsync, useParams } from "@solidjs/router";
import { createMemo, Show } from "solid-js";
import { getJournalsFromTeamId } from "~/api/journal";
import ReallyTerrible from "~/routes/Team/[id]/journal/really-terrible";
import SomewhatBad from "~/routes/Team/[id]/journal/somewhat-bad";
import CompletelyOkay from "~/routes/Team/[id]/journal/completely-okay";
import PrettyGood from "~/routes/Team/[id]/journal/pretty-good";
import SuperAwesome from "~/routes/Team/[id]/journal/super-awesome";

const LandingContent = () => {
  const teamId = useParams().id;
  const getJournals = createAsync(
    async () => await getJournalsFromTeamId(parseInt(teamId)),
    {
      deferStream: true,
    }
  );
  const journalsData = createMemo(() => getJournals());
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
    <div class="mt-4 h-full">
      <Tabs defaultValue="medication taken" class="w-full">
        <TabsList class="w-full text-black px-2 overflow-scroll rounded-none pb-2">
          {["Mood", "Medication Taken", "Notes", "Nutrition", "Sleep"].map(
            (tabName) => (
              <TabsTrigger value={tabName.toLowerCase()} class="text-md">
                {tabName}
              </TabsTrigger>
            )
          )}
          <TabsIndicator />
        </TabsList>

        <div class="p-2 overflow-y-scroll pb-[200px] h-[calc(100vh_-_130px)]">
          {/* this pb and h-calc above is hacky, fix it*/}
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
                  icon={
                    <svg
                      width="15"
                      height="14"
                      viewBox="0 0 15 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7.5 0C3.63438 0 0.5 3.13438 0.5 7C0.5 10.8656 3.63438 14 7.5 14C11.3656 14 14.5 10.8656 14.5 7C14.5 3.13438 11.3656 0 7.5 0ZM4 5.57812C4.00401 5.38186 4.08478 5.19499 4.225 5.05761C4.36522 4.92023 4.5537 4.84328 4.75 4.84328C4.9463 4.84328 5.13478 4.92023 5.275 5.05761C5.41522 5.19499 5.49599 5.38186 5.5 5.57812C5.49599 5.77439 5.41522 5.96126 5.275 6.09864C5.13478 6.23602 4.9463 6.31297 4.75 6.31297C4.5537 6.31297 4.36522 6.23602 4.225 6.09864C4.08478 5.96126 4.00401 5.77439 4 5.57812ZM7.5 9.82812C6.16406 9.82812 5.06875 8.77656 5 7.45938C4.99915 7.44244 5.00176 7.42551 5.00766 7.40962C5.01356 7.39372 5.02263 7.3792 5.03433 7.36692C5.04602 7.35464 5.06009 7.34487 5.07568 7.3382C5.09126 7.33153 5.10805 7.3281 5.125 7.32812H5.87656C5.94219 7.32812 5.99844 7.37813 6.00313 7.44375C6.0625 8.21719 6.71094 8.82812 7.5 8.82812C8.28906 8.82812 8.93906 8.21719 8.99687 7.44375C9.00156 7.37813 9.05781 7.32812 9.12344 7.32812H9.875C9.89195 7.3281 9.90874 7.33153 9.92432 7.3382C9.93991 7.34487 9.95398 7.35464 9.96567 7.36692C9.97737 7.3792 9.98644 7.39372 9.99234 7.40962C9.99824 7.42551 10.0008 7.44244 10 7.45938C9.93125 8.77656 8.83594 9.82812 7.5 9.82812ZM10.25 6.32812C10.0537 6.32412 9.86687 6.24334 9.72948 6.10312C9.5921 5.96291 9.51515 5.77443 9.51515 5.57812C9.51515 5.38182 9.5921 5.19334 9.72948 5.05313C9.86687 4.91291 10.0537 4.83213 10.25 4.82812C10.4463 4.83213 10.6331 4.91291 10.7705 5.05313C10.9079 5.19334 10.9848 5.38182 10.9848 5.57812C10.9848 5.77443 10.9079 5.96291 10.7705 6.10312C10.6331 6.24334 10.4463 6.32412 10.25 6.32812Z"
                        fill="#FE83B0"
                      />
                    </svg>
                  }
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
                    <svg
                      width="15"
                      height="14"
                      viewBox="0 0 15 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M7.95228 1.12328C8.67165 0.403996 9.64728 -5.99356e-05 10.6646 6.66845e-09C11.6818 5.9949e-05 12.6574 0.404231 13.3767 1.1236C14.096 1.84297 14.5001 2.81861 14.5 3.83589C14.4999 4.85317 14.0958 5.82876 13.3764 6.54804L7.04772 12.8767C6.32835 13.596 5.35272 14.0001 4.33544 14C3.31815 13.9999 2.34256 13.5958 1.62328 12.8764C0.903996 12.157 0.49994 11.1814 0.5 10.1641C0.50006 9.14683 0.904231 8.17124 1.6236 7.45196L7.95228 1.12328ZM12.4718 5.64349L9.76011 8.35587L6.14381 4.73957L8.85619 2.02783C9.09262 1.786 9.37468 1.59348 9.68603 1.46141C9.99738 1.32934 10.3318 1.26035 10.67 1.25842C11.0082 1.2565 11.3435 1.32169 11.6563 1.45021C11.9691 1.57873 12.2533 1.76804 12.4925 2.00716C12.7317 2.24629 12.921 2.53048 13.0496 2.84329C13.1782 3.1561 13.2434 3.49131 13.2416 3.82951C13.2397 4.16771 13.1708 4.50217 13.0388 4.81355C12.9067 5.12492 12.7136 5.40701 12.4718 5.64349Z"
                        fill="#FE7258"
                      />
                    </svg>
                  }
                  sections={[
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
                    <svg
                      width="15"
                      height="14"
                      viewBox="0 0 15 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2.5 0C1.39688 0 0.5 0.896875 0.5 2V12C0.5 13.1031 1.39688 14 2.5 14H9.5V10.5C9.5 9.67188 10.1719 9 11 9H14.5V2C14.5 0.896875 13.6031 0 12.5 0H2.5ZM14.5 10H11C10.725 10 10.5 10.225 10.5 10.5V14L11.5 13L13.5 11L14.5 10Z"
                        fill="#F7D844"
                      />
                    </svg>
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
                    <svg
                      width="15"
                      height="14"
                      viewBox="0 0 13 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.28558 3.49744C5.6967 3.44278 6.46834 3.25285 7.12345 2.59808C7.6121 2.1083 7.92043 1.46745 7.99818 0.779997C8.00263 0.743304 7.99889 0.706081 7.98722 0.671009C7.97555 0.635938 7.95624 0.603892 7.93069 0.57718C7.90515 0.550468 7.87399 0.529755 7.83947 0.516534C7.80495 0.503313 7.76793 0.497913 7.73108 0.500723C7.33401 0.5304 6.58268 0.684094 5.89633 1.37072C5.39203 1.86626 5.07564 2.52165 5.00129 3.22473C4.99744 3.26251 5.00224 3.30067 5.01535 3.33631C5.02845 3.37195 5.0495 3.40414 5.07691 3.43043C5.10431 3.45672 5.13735 3.47642 5.1735 3.48803C5.20966 3.49964 5.24799 3.50286 5.28558 3.49744Z"
                        fill="#6FC94F"
                      />
                      <path
                        d="M12.2199 5.20534C11.6364 4.1884 10.7367 3.61888 9.5456 3.5121C8.91492 3.4559 8.32674 3.61732 7.75699 3.77375C7.31476 3.89521 6.89691 4.0098 6.50062 4.0098C6.10433 4.0098 5.68805 3.8949 5.24863 3.77344C4.67732 3.61732 4.08664 3.45309 3.45377 3.51241C2.31647 3.61888 1.40638 4.20276 0.818828 5.20097C0.275651 6.1255 0 7.40565 0 9.00554C0 10.267 0.468795 11.8309 1.25012 13.1895C1.65078 13.8842 2.71901 15.5 3.97413 15.5C4.93579 15.5 5.44771 15.2053 5.8215 14.9901C6.08089 14.8409 6.23747 14.7506 6.49937 14.7506C6.76127 14.7506 6.91785 14.8409 7.17725 14.9901C7.55229 15.2053 8.06327 15.5 9.02586 15.5C10.2813 15.5 11.3492 13.8839 11.7499 13.1895C12.5334 11.8313 13 10.2673 13 9.00554C13.0012 7.36413 12.7456 6.12112 12.2199 5.20534ZM5.2505 11.0038C4.8364 11.0038 4.50043 10.3328 4.50043 9.50511C4.50043 8.67738 4.8364 8.00639 5.2505 8.00639C5.66461 8.00639 6.00057 8.67738 6.00057 9.50511C6.00057 10.3328 5.66461 11.0038 5.2505 11.0038ZM7.75074 11.0038C7.33664 11.0038 7.00067 10.3328 7.00067 9.50511C7.00067 8.67738 7.33664 8.00639 7.75074 8.00639C8.16484 8.00639 8.50081 8.67738 8.50081 9.50511C8.50081 10.3328 8.16484 11.0038 7.75074 11.0038Z"
                        fill="#6FC94F"
                      />
                    </svg>
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
                  dateTime="Oct 15. - 9:41PM"
                  title="Sleep"
                  value={"sleep"}
                  withMember={true}
                  member={sleep.user}
                  entryId={sleep.id}
                  icon={
                    <svg
                      width="15"
                      height="14"
                      viewBox="0 0 15 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13.3948 4.83074V0H11.9211V1.47368H3.07896V0H1.60528V4.83147C0.728434 5.34211 0.131592 6.28232 0.131592 7.36842V10.3158C0.131592 10.5112 0.209223 10.6986 0.347408 10.8368C0.485593 10.975 0.673011 11.0526 0.868434 11.0526H1.60528V14H3.07896V11.0526H11.9211V14H13.3948V11.0526H14.1316C14.327 11.0526 14.5144 10.975 14.6526 10.8368C14.7908 10.6986 14.8684 10.5112 14.8684 10.3158V7.36842C14.8684 6.28232 14.2709 5.3421 13.3948 4.83074ZM6.76317 4.42105H3.07896V2.94737H6.76317V4.42105ZM11.9211 4.42105H8.23686V2.94737H11.9211V4.42105Z"
                        fill="#7F99DD"
                      />
                    </svg>
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
