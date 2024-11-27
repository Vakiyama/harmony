import { For, JSXElement } from "solid-js";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/landing/landing-card";
import { TabsContent } from "~/components/ui/landing/landing-tabs";
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
        <Card class="flex flex-col">
          <CardHeader>
            <div class="w-full flex flex-row justify-between items-center gap-2 rounded-md bg-primary-purple-100">
              <div class="flex justify-center items-center p-2 gap-2">
                <div class="flex items-center justify-center aspect-square rounded-full px-2 bg-primary-purple-500">
                  {props.icon}
                </div>
                <CardTitle class="">{props.title}</CardTitle>
              </div>
            </div>
          </CardHeader>
          <div class="mx-2 bg-black/15 h-0.5 rounded-full" />
          <CardContent class="flex flex-col gap-3">
            <For each={props.sections}>
              {(section) => <InfoSection {...section} />}
            </For>
          </CardContent>
        </Card>
      </TabsContent>
    </div>
  );
}
