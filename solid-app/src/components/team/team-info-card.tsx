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
import { TeamInfoSection } from "./team-info-section";

export function TeamInfoCard(props: {
  icon: JSXElement;
  value: string;
  title: string;
  sections: { title?: string; content: JSXElement }[];
}) {
  return (
    <div class="w-full">
      <TabsContent value={props.value}>
        <Card class="bg-[#fdfdfd] flex flex-col gap-3">
          <CardHeader>
            <div class="w-full flex flex-row justify-between items-center gap-2 rounded-md bg-primary-purple-100">
              <div class="flex justify-center items-center p-2 gap-2">
                <div class="flex items-center justify-center aspect-square rounded-full px-2 bg-primary-purple-500">
                  {props.icon}
                </div>
                <CardTitle>{props.title}</CardTitle>
              </div>
            </div>
          </CardHeader>
          <div class="mx-2 bg-black/15 h-0.5 rounded-full" />
          <CardContent class="flex flex-col gap-3">
            <For each={props.sections}>
              {(section) => <TeamInfoSection {...section} />}
            </For>
          </CardContent>
        </Card>
      </TabsContent>
    </div>
  );
}
