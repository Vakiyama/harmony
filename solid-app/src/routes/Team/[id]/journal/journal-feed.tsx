import { createAsync } from "@solidjs/router";
import { getJournalsFromTeamId } from "~/api/journal";
import { createMemo, Show } from "solid-js";
import LandingContent from "~/components/landing/LandingContent";

export default function JournalFeed() {
  const getJournals = createAsync(async () => await getJournalsFromTeamId(1), {
    deferStream: true,
  });
  const journalsData = createMemo(() => getJournals());
  if (journalsData()) {
    console.log(journalsData());
  }
  return (
    <div class="overflow-hidden">
      <Show when={journalsData()}>
        <LandingContent></LandingContent>
      </Show>
    </div>
  );
}
