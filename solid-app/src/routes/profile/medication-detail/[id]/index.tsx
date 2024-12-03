import { MedicationCard } from "~/components/profile/medication-card";
import MedicationImage from "~/components/profile/medication-image";
import TopNav from "~/components/shared/TopNav";
import { onMount, createSignal } from "solid-js";
import { getMedFromMedId } from "~/api/team";
import { useParams } from "@solidjs/router";

type Medication = {
  name: string;
  dosage: string;
  typeOfMedication: string;
  frequency: string;
  schedule: string;
  sideEffects: string;
  instructions: string;
  pharmacyInfo: string;
};

export default function MedicationDetail() {
  const params = useParams();
  const [med, setMed] = createSignal<Medication>({
    name: "",
    dosage: "",
    typeOfMedication: "",
    frequency: "",
    schedule: "",
    sideEffects: "",
    instructions: "",
    pharmacyInfo: "",
  });
  onMount(async () => {
    const medId = Number(params.id);
    if (medId) {
      try {
        const fetchedMed = await getMedFromMedId(medId);

        const normalizedMed: Medication = {
          name: fetchedMed?.name || "No medication name provided",
          dosage: fetchedMed?.dosage || "No medication dosage provided",
          typeOfMedication:
            fetchedMed?.typeOfMedication || "No medication type provided",
          frequency:
            fetchedMed?.frequency || "No medication frequency provided",
          schedule: fetchedMed?.schedule || "No medication schedule provided",
          sideEffects:
            fetchedMed?.sideEffects || "No medication side effects provided",
          instructions:
            fetchedMed?.instructions || "No medication instructions provided",
          pharmacyInfo: fetchedMed?.pharmacyInfo || "No pharmacy info provided",
        };

        setMed(normalizedMed);
      } catch (error) {
        console.error("Failed to fetch medication details:", error);
      }
    }
  });
  return (
    <div class="px-2">
      <TopNav leftNavigation="Team" name="Medication Details" />
      <MedicationCard
        title={med().name}
        sections={[
          {
            title: "Dosage",
            content: med().dosage,
          },
          {
            title: "Type of Medication",
            content: med().typeOfMedication,
          },
          {
            title: "Frequency",
            content: med().frequency,
          },
          {
            title: "Medication Schedule",
            content: med().schedule,
          },
          {
            title: "Side Effects",
            content: med().sideEffects,
          },
          {
            title: "Instructions",
            content: med().instructions,
          },
          {
            title: "Pharmacy Information",
            content: med().pharmacyInfo,
          },
          // {
          //   title: "Medication Photo",
          //   content: <MedicationImage />,
          // },
        ]}
      />
    </div>
  );
}
