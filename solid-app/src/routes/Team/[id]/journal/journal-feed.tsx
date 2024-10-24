import { createAsync } from "@solidjs/router";
import JournalCard from "./journal-card";
import { getJournalsFromTeamId } from "~/api/journal";
import { createMemo, Show } from "solid-js";

export default function JournalFeed() {
  const getJournals = createAsync(async () => await getJournalsFromTeamId(1), {
    deferStream: true,
  });
  const journalsData = createMemo(() => getJournals());
  //   console.log(journalsData());
  return (
    <div>
      <Show when={journalsData()}>
        <JournalCard></JournalCard>
      </Show>
    </div>
  );
}
