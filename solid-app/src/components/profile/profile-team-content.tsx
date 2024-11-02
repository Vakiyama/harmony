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
import TeamPreview from "./team-preview";
import TopNav from "../shared/TopNav";
export default function ProfileTeamContent() {
  return (
    <div class="h-full w-full flex items-center justify-center">
      <Tabs defaultValue="team member" class="w-full">
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
        <div class="flex flex-row space-x-1 justify-end mx-4 mt-2">
          <p class="text-xs text-gray-500">Edit</p>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.50062 0.452148L7.36624 1.58652L10.4131 4.6334L11.5475 3.49902C12.1334 2.91309 12.1334 1.96387 11.5475 1.37793L10.6241 0.452148C10.0381 -0.133789 9.0889 -0.133789 8.50296 0.452148H8.50062ZM6.83656 2.11621L1.37328 7.58184C1.12953 7.82559 0.9514 8.12793 0.852963 8.4584L0.0232751 11.2779C-0.0353187 11.4771 0.0185876 11.6904 0.1639 11.8357C0.309213 11.9811 0.522494 12.035 0.719369 11.9787L3.5389 11.149C3.86937 11.0506 4.17171 10.8725 4.41546 10.6287L9.88343 5.16309L6.83656 2.11621Z"
              fill="#1E1E1E"
              fill-opacity="0.75"
            />
          </svg>
        </div>
        <TabsContent value="general information">
          <GeneralInfo />
        </TabsContent>
        <TabsContent value="medication information">
          <MedicationInfo />
        </TabsContent>
        <TabsContent value="team member">
          <div class="flex flex-col gap-2 p-4">
            <TeamPreview
              memberName="Tina Duong"
              imageUrl=""
              description=""
              userRole="Admin"
            />
            <TeamPreview
              memberName="Tina Duong"
              imageUrl=""
              description=""
              userRole="Admin"
            />
            <TeamPreview
              memberName="Tina Duong"
              imageUrl=""
              description=""
              userRole="Admin"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
