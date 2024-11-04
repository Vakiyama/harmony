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

export function InfoCard(props: {
  icon: JSXElement;
  value: string;
  title: string;
  sections: { title?: string; content: JSXElement }[];
}) {
  // const backgroundColor = `bg-${props.value
  //   .split(" ")
  //   .map((c, i) => {
  //     return i === 1 ? c[0].toUpperCase() + c.substring(1) : c;
  //   })
  //   .join("")}Background`;
  // const iconBGColor = `bg-${props.value
  //   .split(" ")
  //   .map((c, i) => {
  //     return i === 1 ? c[0].toUpperCase() + c.substring(1) : c;
  //   })
  //   .join("")}IconBackground`;
  return (
    <div class="w-full">
      <TabsContent value={props.value}>
        <Card class="bg-[#fdfdfd]">
          <CardHeader>
            <div class="w-full flex flex-row justify-between items-center gap-x-2 rounded-md bg-[#D6CDF9]">
              <div class="flex justify-center items-center p-2">
                <div class="flex items-center justify-center aspect-square rounded-full px-2 bg-[#7859EA]">
                  {props.icon}
                </div>
                <CardTitle class="ml-2">{props.title}</CardTitle>
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
      </TabsContent>
    </div>
  );
}
