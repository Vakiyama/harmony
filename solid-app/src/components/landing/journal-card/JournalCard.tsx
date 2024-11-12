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
import { A, useParams } from "@solidjs/router";

export function JournalCard(props: {
  icon: JSXElement;
  value: string;
  title: string;
  dateTime: string;
  sections: { title?: string; content: JSXElement }[];
  withMember?: boolean;
  member: AttachedUser | null;
  entryId: number;
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

  const teamId = useParams().id;
  return (
    <>
      {/* Render for the "All" tab */}
      <TabsContent value="all">
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
              <div class="flex flex-row gap-2 items-center justify-center mx-2">
                <CardDescription
                  classList={{
                    flex: true,
                    "leading-none": true,
                    "items-center": true,
                    "text-subtitle": true,
                  }}
                >
                  {props.dateTime}
                </CardDescription>
                <A
                  href={`/team/${teamId}/journal/${
                    props.value === "medication taken"
                      ? "medications"
                      : props.value
                  }?edit=${props.entryId}`}
                >
                  <FaSolidPen size={11} color="#1E1E1EBF" />
                </A>
              </div>
            </div>
          </CardHeader>
          <div class="mx-3 bg-black/15 h-0.5 rounded-full" />
          <CardContent class="mt-3 flex flex-col gap-y-3 w-full">
            <For each={props.sections}>
              {(section) => <Section {...section} />}
            </For>
            <div class="bg-black/15 h-0.5 rounded-full" />
            {props.withMember && <Member member={props.member} />}
          </CardContent>
        </Card>
      </TabsContent>

      {/* Render for the specific tab */}
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
              <div class="flex flex-row gap-2 items-center justify-center mx-2">
                <CardDescription
                  classList={{
                    flex: true,
                    "leading-none": true,
                    "items-center": true,
                    "text-subtitle": true,
                  }}
                >
                  {props.dateTime}
                </CardDescription>
                <A
                  href={`/team/${teamId}/journal/${
                    props.value === "medication taken"
                      ? "medications"
                      : props.value
                  }?edit=${props.entryId}`}
                >
                  <FaSolidPen size={11} color="#1E1E1EBF" />
                </A>
              </div>
            </div>
          </CardHeader>
          <div class="mx-3 bg-black/15 h-0.5 rounded-full" />
          <CardContent class="mt-3 flex flex-col gap-y-3 w-full">
            <For each={props.sections}>
              {(section) => <Section {...section} />}
            </For>
            <div class="bg-black/15 h-0.5 rounded-full" />
            {props.withMember && <Member member={props.member} />}
          </CardContent>
        </Card>
      </TabsContent>
    </>
  );
}
