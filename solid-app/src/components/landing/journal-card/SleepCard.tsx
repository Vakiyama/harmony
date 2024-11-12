import { JournalCard } from "./JournalCard";
import SleepIcon from "../../icon/sleep-icon";
import { formatCreatedDate } from "../../../lib/formateDateLocal";
import { SleepWithNoteUser } from "@/schema/Sleeps";
import { getWellbeingSVG } from "~/utils/getWellbeingSVG";

const SleepCard = ({ sleep }: { sleep: SleepWithNoteUser }) => (
  <JournalCard
    dateTime={formatCreatedDate(sleep.createdAt)}
    title="Sleep"
    value={"sleep"}
    withMember={true}
    member={sleep.user}
    entryId={sleep.id}
    icon={
      <SleepIcon height="15" width="15" iconColor="#7F99DD" bgColor="#091E54" />
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
          <p class="text-subtitle ">{sleep.troubleSleeping ? "Yes" : "No"}</p>
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
              content: <p class="text-subtitle ">{sleep.note.note}</p>,
            },
          ]
        : []),
    ]}
  />
);

export default SleepCard;
