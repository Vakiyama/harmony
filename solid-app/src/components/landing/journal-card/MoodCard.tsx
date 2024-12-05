import { JournalCard } from "./JournalCard";
import MoodIcon from "../../icon/mood-icon";
import { formatCreatedDate } from "../../../lib/formateDateLocal";
import { MoodsWithNoteUser } from "@/schema/Moods";
import { getWellbeingSVG } from "~/utils/getWellbeingSVG";

const MoodCard = ({ mood }: { mood: MoodsWithNoteUser }) => (
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
        content: <p class="text-subtitle text-black/75">{mood.timeFrame}</p>,
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
              content: <p class="text-subtitle">{mood.note.note}</p>,
            },
          ]
        : []),
    ]}
  />
);

export default MoodCard;
