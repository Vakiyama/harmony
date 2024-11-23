import { For, JSXElement } from "solid-js";
import { InfoSection } from "./info-section";

export function MedicationCard(props: {
  title: string;
  sections: { title?: string; content: JSXElement }[];
}) {
  return (
    <div class="w-full px-2 flex flex-col gap-[38px]">
      <h2 class="text-h2 font-medium">{props.title}</h2>
      <div class="flex flex-col gap-6">
        <For each={props.sections}>
          {(section) => <InfoSection {...section} />}
        </For>
      </div>
    </div>
  );
}
