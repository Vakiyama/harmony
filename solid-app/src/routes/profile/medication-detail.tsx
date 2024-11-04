import { InfoCard } from "~/components/profile/info-card";
import MedDetailCard from "~/components/profile/med-detail-card";
import { MedicationCard } from "~/components/profile/medication-card";
import MedicationImage from "~/components/profile/medication-image";
import TopNav from "~/components/shared/TopNav";

export default function MedicationDetail() {
  return (
    <div class="w-full">
      <div>
        <TopNav leftNavigation="Back" name="Lola's Care Circle" />
      </div>
      <div class="mx-4">
        <div class="mt-4">
          <MedicationCard
            title="Advil"
            sections={[
              {
                title: "Dosage",
                content: <p class="text-xs">200mg</p>,
              },
              {
                title: "Type of Medication",
                content: <p class="text-xs ">Oral Pill</p>,
              },
              {
                title: "Frequency",
                content: <p class="text-xs ">Twice a day</p>,
              },
              {
                title: "Medication Schedule",
                content: <p class="text-xs ">Morning and Evening</p>,
              },
              {
                title: "Side Effects",
                content: <p class="text-xs ">Can cause dizziness</p>,
              },
              {
                title: "Instructions",
                content: <p class="text-xs ">Take after a meal</p>,
              },
              {
                title: "Pharmacy Information",
                content: (
                  <p class="text-xs ">
                    Shoppers, 123 Sesame Street, Vancouver BC
                  </p>
                ),
              },
              {
                title: "Medication Photo",
                content: (
                  <>
                    {/* Images */}
                    <div class="flex flex-row gap-x-2">
                      <MedicationImage />{" "}
                    </div>
                  </>
                ),
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
