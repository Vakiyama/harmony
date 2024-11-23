// import {
//   TextField,
//   TextFieldLabel,
//   TextFieldRoot,
// } from "~/components/ui/textfield";
// import MedicalDetail from "./medical-detail";
// import TextFieldLine from "../shared/TextFieldLine";

// export default function MedicalInfo() {
//   const fields = [
//     { label: "Heath Conditions", value: "Dementia" },
//     { label: "PastInjuries", value: "Hip Fractures" },
//     { label: "Important Surgeries", value: "Hip Surgery, 2021" },
//     { label: "Mobility Needs", value: "Requires walking cane" },
//     {
//       label: "Dietary Restrictions/Preference",
//       value: "Must have 85g protein each meal",
//     },
//   ];

//   return (
//     <>
//       <div>
//         {/* Medical Info */}
//         <div>
//           <p class="font-semibold text-md">Health Profile</p>
//           {fields.map(({ label, value }, index) => (
//             <TextFieldLine key={index} label={label} value={value} />
//           ))}
//         </div>
//         <div class="mt-16">
//           <p class="font-semibold text-md">Medication Details</p>

//           <MedicalDetail
//             medicineName="Advil"
//             medicineDose="200mg"
//             medicineInstructions="take after a meal"
//             medicineLink="/profile/med-detail"
//           />
//           <MedicalDetail
//             medicineName="Vyvanse"
//             medicineDose="10mg"
//             medicineInstructions="taken with water"
//             medicineLink="/profile/med-detail"
//           />
//         </div>
//       </div>
//     </>
//   );
// }
import { InfoCard } from "./info-card";
import MedicalDetail from "./medical-detail";

export default function MedicationInfo() {
  return (
    <div class="p-2 pb-[200px]">
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
            content: <p class="text-xs">Dementia</p>,
          },
          {
            title: "Past Injuries",
            content: <p class="text-xs ">Hip Fractures</p>,
          },
          {
            title: "Important Surgeries",
            content: <p class="text-xs ">Hip Surgery, 2021</p>,
          },
          {
            title: "Mobility Needs",
            content: <p class="text-xs ">Requires walking care</p>,
          },
          {
            title: "Dietary Restrictions/Preference",
            content: <p class="text-xs ">Must have 85g protein each meal</p>,
          },
          {
            title: "Allergies",
            content: <p class="text-xs ">None</p>,
          },
        ]}
      />

      {/* Medication Details */}
      <div class="mt-4 ">
        <div class="w-full mt-2 flex flex-row justify-between items-center gap-x-2 rounded-md bg-[#D6CDF9] h-[48px]">
          <div class="flex justify-center items-center p-2">
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
            <div class="ml-2 font-semibold tracking-tight text-sm">
              Medication Details
            </div>
          </div>
        </div>
      </div>

      <div class="mt-4">
        <MedicalDetail
          medicineName="Advil"
          medicineDose="200mg"
          medicineInstructions="take after a meal"
          medicineLink="/profile/medication-detail"
        />
        <MedicalDetail
          medicineName="Vyvanse"
          medicineDose="10mg"
          medicineInstructions="taken with water"
          medicineLink="/profile/medication-detail"
        />
      </div>
    </div>
  );
}
