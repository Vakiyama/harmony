import {
  Tabs,
  TabsIndicator,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "~/components/ui/landing/landing-tabs";
import GeneralInfo from "./general-info";
import MedicationInfo from "./medication-info";
import TeamPreview from "./team-preview";
import { TeamFromTeamId } from "@/schema/Teams";
export default function ProfileTeamContent(props: {
  data: TeamFromTeamId | undefined;
}) {
  return (
    <div class="h-full w-full flex items-center justify-center">
      <Tabs
        defaultValue="general info"
        class="w-full h-full flex flex-col gap-2"
      >
        <TabsList class="w-full text-black overflow-scroll text-subtitle flex items-center rounded-none">
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
          <GeneralInfo data={props.data} />
        </TabsContent>
        <TabsContent value="medication information">
          <MedicationInfo data={props.data} />
        </TabsContent>
        <TabsContent value="team member">
          <div class="flex flex-col gap-2">
            {props.data?.members.map((member) => {
              return (
                <TeamPreview
                  memberName={`${member.firstName || ""} ${
                    member.lastName || ""
                  }`}
                  imageUrl={member.photo || ""}
                  description={member.relationship || ""}
                  userRole={member.role || ""}
                />
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
