import { MedicationCard } from "~/components/profile/medication-card";
import MedicationImage from "~/components/profile/medication-image";
import TopNav from "~/components/shared/TopNav";

export default function MedicationDetail() {
  return (
    <div class="px-2">
      <TopNav leftNavigation="Back" name="Medication Details" />
      <MedicationCard
        title="Advil"
        sections={[
          {
            title: "Dosage",
            content: <p>200mg</p>,
          },
          {
            title: "Type of Medication",
            content: <p>Oral Pill</p>,
          },
          {
            title: "Frequency",
            content: <p>Twice a day</p>,
          },
          {
            title: "Medication Schedule",
            content: <p>Morning and Evening</p>,
          },
          {
            title: "Side Effects",
            content: <p>Can cause dizziness</p>,
          },
          {
            title: "Instructions",
            content: <p>Take after a meal</p>,
          },
          {
            title: "Pharmacy Information",
            content: <p>Shoppers, 123 Sesame Street, Vancouver BC</p>,
          },
          {
            title: "Medication Photo",
            content: <MedicationImage />,
          },
        ]}
      />
    </div>
  );
}
