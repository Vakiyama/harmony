import { FaSolidPen } from "solid-icons/fa";
import { For, JSXElement } from "solid-js";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/landing/landing-card";
import { TabsContent } from "~/components/ui/landing/landing-tabs";
// import Member from "../Member";
import { InfoSection } from "./info-section";
import { AttachedUser } from "@/schema/Users";

export function MedicationCard(props: {
  title: string;
  sections: { title?: string; content: JSXElement }[];
}) {
  return (
    <div class="w-full">
      <Card class="bg-[#fdfdfd]">
        <CardHeader>
          <div class="w-full flex flex-row justify-between items-center gap-x-2 rounded-md bg-[#D6CDF9] h-[48px]">
            <div class="flex justify-center items-center p-2">
              <CardTitle class="ml-2 text-lg">{props.title}</CardTitle>
            </div>
            <div class="flex flex-row gap-2 items-center mx-2"></div>
          </div>
        </CardHeader>
        <div class="mx-4 bg-black/15 h-0.5 rounded-full" />
        <CardContent class="space-y-2 mt-3 flex flex-col gap-y-2">
          <For each={props.sections}>
            {(section) => <InfoSection {...section} />}
          </For>
        </CardContent>
      </Card>
    </div>
  );
}
