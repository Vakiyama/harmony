import { JournalCard } from "./JournalCard";
import NotesIcon from "../../icon/notes-icon";
import { formatCreatedDate } from "../../../lib/formateDateLocal";
import { NoteWithUser } from "@/schema/Notes";

const NoteCard = ({ note }: { note: NoteWithUser }) => (
  <JournalCard
    dateTime={formatCreatedDate(note.createdAt)}
    title="Notes"
    value={"notes"}
    withMember={true}
    member={note.user}
    entryId={note.id}
    icon={
      <NotesIcon width="14" height="14" iconColor="#F7D844" bgColor="#4E412B" />
    }
    sections={[
      {
        title: "New Update",
        content: <p class="text-subtitle">{note.note}</p>,
      },
    ]}
  />
);

export default NoteCard;
