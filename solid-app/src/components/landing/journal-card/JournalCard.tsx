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
import Member from "../Member";
import { Section } from "./Section";

export function JournalCard(props: {
  icon: JSXElement;
  value: string;
  title: string;
  dateTime: string;
  sections: { title?: string; content: JSXElement }[];
  withMember?: boolean;
}) {
  return (
    <TabsContent value={props.value}>
      <Card class="bg-black/15">
        <CardHeader>
          <div class="flex flex-row justify-center items-center gap-x-2 mx-2">
            {props.icon}
            <CardTitle>{props.title}</CardTitle>
          </div>
          <div class="flex flex-row gap-2 items-center mx-2">
            <CardDescription class="text-sm text-black">
              {props.dateTime}
            </CardDescription>
            <FaSolidPen size={15} />
          </div>
        </CardHeader>
        <div class="mx-4 bg-black/15 h-0.5 rounded-full" />
        <CardContent class="space-y-2 mt-3 flex flex-col gap-y-2">
          <For each={props.sections}>
            {(section) => <Section {...section} />}
          </For>
          {props.withMember && <Member />}
        </CardContent>
      </Card>
    </TabsContent>
  );
}
