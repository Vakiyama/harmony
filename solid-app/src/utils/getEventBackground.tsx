import { CalendarJournalType } from "~/routes/Team/[id]/Calendar";
import { Event } from "@/schema/Events";

export const getEventBackground = (
  event: Event | CalendarJournalType,
  dotMode = false
) => {
  switch (event.type) {
    case "task":
      return dotMode ? "bg-[#6FC94F]" : "bg-[#e2f4dc]";
    case "medication":
      return dotMode ? "bg-[#FE7258]" : "bg-[#FFE3DE]";
    case "event":
      return dotMode ? "bg-primary-purple-500" : "bg-[#f1eefc]";
    case "mood":
      return dotMode ? "bg-[#FE83B0]" : "bg-[#FFE6EF]";
    case "meal":
      return dotMode ? "bg-[#6FC94F]" : "bg-[#E2F4DC]";
    case "note":
      return dotMode ? "bg-[#F7D844]" : "bg-[#FDF3C7]";
    case "sleep":
      return dotMode ? "bg-[#7f99dd]" : "bg-[#D1D8E8]";
  }
};
