import { TeamFromTeamId } from "@/schema/Teams";
import { InfoCard } from "./info-card";
import MedicalDetail from "./medical-detail";

export default function MedicationInfo(props: {
  data: TeamFromTeamId | undefined;
}) {
  const teamData = props.data;
  if (!teamData) {
    return null;
  }
  const healthCondition = teamData.data.recipients?.healthCondition;
  const mobilityNeeds = teamData.data.recipients?.mobilityNeed;
  const dietaryRestrictions = teamData.data.recipients?.dietaryRestrictions;
  const allergies = teamData.data.recipients?.allergies;

  const medications = teamData.medications;
  const importantSurgeries = teamData.importantSurgeries;
  const pastInjuries = teamData.pastInjuries;

  return (
    <div class="h-full flex flex-col gap-3">
      <InfoCard
        title="Health Profile"
        value={"medication information"}
        icon={
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14.3418 2.61206L9.6582 5.22493V0H6.3418V5.22493L1.6582 2.61206L0 5.38753L4.68277 7.9996L0 10.6117L1.6582 13.3871L6.3418 10.7751V16H9.6582V10.7751L14.3418 13.3871L16 10.6117L11.3172 7.9996L16 5.38753L14.3418 2.61206Z"
              fill="#D7CDF9"
            />
          </svg>
        }
        sections={[
          {
            title: "Health Condition",
            content: <p class="text-xs">{healthCondition}</p>,
          },
          {
            title: "Past Injuries",
            content:
              pastInjuries && pastInjuries.length > 0 ? (
                pastInjuries.map((pastInjury, index) => (
                  <p class="text-xs ">{pastInjury.name}</p>
                ))
              ) : (
                <p class="text-xs">empty</p>
              ),
          },
          {
            title: "Important Surgeries",
            content:
              importantSurgeries && importantSurgeries.length > 0 ? (
                importantSurgeries.map((surgery, index) => (
                  <p class="text-xs ">
                    {surgery.name}, {surgery.year}
                  </p>
                ))
              ) : (
                <p class="text-xs">empty</p>
              ),
          },
          {
            title: "Mobility Needs",
            content: (
              <p class="text-xs ">{mobilityNeeds ? mobilityNeeds : "empty"}</p>
            ),
          },
          {
            title: "Dietary Restrictions/Preference",
            content: (
              <p class="text-xs ">
                {dietaryRestrictions ? dietaryRestrictions : "empty"}
              </p>
            ),
          },
          {
            title: "Allergies",
            content: <p class="text-xs ">{allergies ? allergies : "empty"}</p>,
          },
        ]}
      />

      {/* Medication Details */}
      <div class="flex flex-col gap-3">
        <div class="w-full flex flex-row justify-between items-center gap-2 rounded-md bg-primary-purple-100 h-full">
          <div class="flex justify-center items-center p-2 gap-2">
            <div class="flex items-center justify-center aspect-square rounded-full px-2 bg-[#7859EA]">
              <svg
                width="14"
                height="16"
                viewBox="0 0 14 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.2222 16H0.777778C0.571498 16 0.373667 15.9157 0.227806 15.7657C0.0819442 15.6157 0 15.4122 0 15.2V0.8C0 0.587827 0.0819442 0.384344 0.227806 0.234315C0.373667 0.0842854 0.571498 0 0.777778 0H13.2222C13.4285 0 13.6263 0.0842854 13.7722 0.234315C13.9181 0.384344 14 0.587827 14 0.8V15.2C14 15.4122 13.9181 15.6157 13.7722 15.7657C13.6263 15.9157 13.4285 16 13.2222 16ZM3.88889 4V5.6H10.1111V4H3.88889ZM3.88889 7.2V8.8H10.1111V7.2H3.88889ZM3.88889 10.4V12H7.77778V10.4H3.88889Z"
                  fill="#D7CDF9"
                />
              </svg>
            </div>
            <div class="font-semibold tracking-tight text-sm">
              Medication Details
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          {medications
            ? medications.map((medication) => (
                <MedicalDetail
                  medicineName={medication.name}
                  medicineDose={medication.dosage}
                  medicineInstructions={
                    medication.instructions ? medication.instructions : "empty"
                  }
                  medicineLink={`/profile/medication-detail/${medication.id}`}
                />
              ))
            : "empty"}
        </div>
      </div>
    </div>
  );
}
