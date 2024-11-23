import { For, JSXElement } from "solid-js";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/landing/landing-card";
import { TabsContent } from "~/components/ui/landing/landing-tabs";
// import Member from "../Member";
import { InfoSection } from "./info-section";

export function InfoCard(props: {
  icon: JSXElement;
  value: string;
  title: string;
  sections: { title?: string; content: JSXElement }[];
}) {
  return (
    <div class="w-full">
      <TabsContent value={props.value}>
        <Card>
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
