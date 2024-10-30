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
import { AttachedUser } from "@/schema/Users";

export function JournalCard(props: {
  icon: JSXElement;
  value: string;
  title: string;
  dateTime: string;
  sections: { title?: string; content: JSXElement }[];
  withMember?: boolean;
  member: AttachedUser | null;
}) {
  const backgroundColor = `bg-${props.value
    .split(" ")
    .map((c, i) => {
      return i === 1 ? c[0].toUpperCase() + c.substring(1) : c;
    })
    .join("")}Background`;
  const iconBGColor = `bg-${props.value
    .split(" ")
    .map((c, i) => {
      return i === 1 ? c[0].toUpperCase() + c.substring(1) : c;
    })
    .join("")}IconBackground`;
  return (
    <TabsContent value={props.value}>
      <Card class="bg-[#fdfdfd]">
        <CardHeader>
          <div
            class={`w-full flex flex-row justify-between items-center gap-x-2 rounded-md ${backgroundColor}`}
          >
            <div class="flex justify-center items-center p-2">
              <div
                class={`flex items-center justify-center aspect-square rounded-full px-2 ${iconBGColor}`}
              >
                {props.icon}
              </div>
              <CardTitle class="ml-2">{props.title}</CardTitle>
            </div>
            <div class="flex flex-row gap-2 items-center mx-2">
              <CardDescription class="text-sm text-black">
                {props.dateTime}
              </CardDescription>
              <FaSolidPen size={15} />
            </div>
          </div>
        </CardHeader>
        <div class="mx-4 bg-black/15 h-0.5 rounded-full" />
        <CardContent class="space-y-2 mt-3 flex flex-col gap-y-2">
          <For each={props.sections}>
            {(section) => <Section {...section} />}
          </For>
          {props.withMember && <Member member={props.member} />}
        </CardContent>
      </Card>
    </TabsContent>
  );
}
