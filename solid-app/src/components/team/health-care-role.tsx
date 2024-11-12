import { useNavigate } from "@solidjs/router";
import { For } from "solid-js";
import TeamTopNav from "~/components/team/team-top-nav";
import UserRole from "~/components/team/temp-user-role";

const healthcareRoles = [
  "Nurse(LPN/LVN)",
  "Nurse(RN)",
  "Program Director",
  "Occupational Therapist",
  "Physical Therapist",
  "Therapy Aide",
  "Program Assistant",
  "Activities Coordinator",
  "Social Worker",
  "Physician",
  "Nurse(NP)",
  "Physical Assistant",
  "Medical Assistant",
  "Other",
];
export default function HealthCareRole() {
  const navigate = useNavigate();
  return (
    <>
      <TeamTopNav backNavigation="/" cancelNavigation="/" />
      <div class="relative flex flex-col min-h-screen mx-4">
        <div class="flex items-center justify-center mt-2">
          <p class="text-xs text-gray-400">7 of 8</p>
        </div>
        <div class="px-2">
          <p class="text-[23px] font-semi">Please Specify</p>
          <div class="mt-4">
            <For each={healthcareRoles}>
              {(role: string) => (
                <UserRole
                  key={role}
                  role={role}
                  onClick={() => {
                    if (role === "Other") {
                      navigate("/team/create/someone/another-role");
                    }
                  }}
                />
              )}
            </For>
          </div>
        </div>
        {/* Space for bottom */}
        <div class="h-[122px]"></div> {/* temporary */}
      </div>
    </>
  );
}
