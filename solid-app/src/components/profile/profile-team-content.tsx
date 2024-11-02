import {
  Tabs,
  TabsIndicator,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "~/components/ui/landing/landing-tabs";

// import { TabsContent } from "../ui/tabs";
import GeneralInfo from "./general-info";
import MedicationInfo from "./medication-info";
export default function ProfileTeamContent() {
  return (
    <div class="h-full w-full flex items-center justify-center">
      <Tabs defaultValue="general information" class="w-full">
        <TabsList
          class="w-full text-black overflow-scroll rounded-none pb-2 text-[11px] flex items-center justify-center"
          // classList={{ "rounded-2xl": false, "rounded-lg": true }}
        >
          {["General Information", "Medication Information", "Team Member"].map(
            (tabName) => (
              <TabsTrigger value={tabName.toLowerCase()} class="text-md">
                {tabName}
              </TabsTrigger>
            )
          )}
          <TabsIndicator />
        </TabsList>
        <TabsContent value="general information">
          <GeneralInfo />
        </TabsContent>
        <TabsContent value="medication information">
          <MedicationInfo />
        </TabsContent>
        <TabsContent value="team member">Hello</TabsContent>
      </Tabs>
    </div>
  );
}
