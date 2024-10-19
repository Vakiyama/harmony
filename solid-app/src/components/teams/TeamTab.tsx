import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "~/components/ui/teams/team-menubar";
import TeamPreview from "./TeamPreview";
import { createSignal } from "solid-js";
import { A } from "@solidjs/router";
import {
  Tabs,
  TabsIndicator,
  TabsList,
  TabsTrigger,
} from "~/components/ui/teams/team-tabs";
import GeneralInfo from "./GeneralInfo";
import MedicalInfo from "./MedicalInfo";

const TeamTab = () => {
  const [activeTab, setActiveTab] = createSignal("teams");
  return (
    <div>
      <div>
        <Tabs defaultValue="general" class="w-[400px]">
          <TabsList>
            <TabsTrigger
              value="general"
              onClick={() => setActiveTab("general")}
            >
              General Information
            </TabsTrigger>
            <TabsTrigger
              value="medical"
              onClick={() => setActiveTab("medical")}
            >
              Medical Information
            </TabsTrigger>
            <TabsTrigger value="teams" onClick={() => setActiveTab("teams")}>
              Team Members
            </TabsTrigger>
            <TabsIndicator />
          </TabsList>
        </Tabs>
      </div>

      {/* Edit section */}
      <div class="flex items-center justify-end mt-3">
        <A href="/" class="text-sm font-semi mr-1.5">
          Edit
        </A>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="inline-box"
        >
          <g clip-path="url(#clip0_1045_2306)">
            <path
              d="M8.50074 0.452148L7.36637 1.58652L10.4132 4.6334L11.5476 3.49902C12.1336 2.91309 12.1336 1.96387 11.5476 1.37793L10.6242 0.452148C10.0382 -0.133789 9.08902 -0.133789 8.50308 0.452148H8.50074ZM6.83668 2.11621L1.3734 7.58184C1.12965 7.82559 0.951522 8.12793 0.853085 8.4584L0.0233971 11.2779C-0.0351966 11.4771 0.0187096 11.6904 0.164022 11.8357C0.309335 11.9811 0.522616 12.035 0.719491 11.9787L3.53902 11.149C3.86949 11.0506 4.17183 10.8725 4.41558 10.6287L9.88355 5.16309L6.83668 2.11621Z"
              fill="black"
            />
          </g>
          <defs>
            <clipPath id="clip0_1045_2306">
              <rect width="12" height="12" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </div>

      {/* Menu Content */}
      <div class="mt-10">
        {activeTab() === "general" && (
          <div>
            <GeneralInfo />
          </div>
        )}
        {activeTab() === "medical" && (
          <div>
            <MedicalInfo />
          </div>
        )}
        {activeTab() === "teams" && (
          <div class="flex flex-col gap-2">
            <TeamPreview
              memberName="Your Name"
              imageUrl=""
              description="Primary Caretaker"
              userRole="Admin"
            />
            <TeamPreview
              memberName="Team Member"
              imageUrl=""
              description="Secondary Caretaker"
              userRole="Member"
            />
            <TeamPreview
              memberName="Another Member"
              imageUrl=""
              description="Family Member"
              userRole="Member"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamTab;
