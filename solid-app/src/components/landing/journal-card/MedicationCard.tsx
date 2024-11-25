import { JournalCard } from "./JournalCard";
import MedicationIcon from "../../icon/medication-icon";
import { formatCreatedDate } from "../../../lib/formateDateLocal";
import { TakenMedsWithNoteUser } from "@/schema/TakenMedications";

const MedicationCard = ({ med }: { med: TakenMedsWithNoteUser }) => (
  <JournalCard
    dateTime={formatCreatedDate(med.createdAt)}
    title="Medication Taken"
    value="medication taken"
    withMember={true}
    member={med.user}
    entryId={med.id}
    icon={<MedicationIcon height="15" width="15" iconColor="#FE7258" />}
    sections={[
      {
        title: "Taken or Skipped?",
        content: (
          <p class="text-subtitle">{med.hasMissed ? "Missed" : "Taken"}</p>
        ),
      },
      {
        title: "Selected Medication",
        content: <p class="text-subtitle">{med.medications!.name}</p>,
      },
      {
        title: "Medication Type",
        content: <p class="text-subtitle">{med.type}</p>,
      },
      {
        title: "Date & Time Taken",
        content: (
          <p class="text-subtitle">{`${new Date(med.date).toLocaleDateString(
            "en-US",
            {
              month: "short",
              day: "numeric",
              year: "numeric",
            }
          )} - ${new Date(med.date).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
          })}`}</p>
        ),
      },
      ...(med.note
        ? [
            {
              title: "Additional Notes",
              content: <p class="text-subtitle">{med.note.note}</p>,
            },
          ]
        : []),
    ]}
  />
);

export default MedicationCard;
