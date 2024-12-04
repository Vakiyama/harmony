import { MedicationCard } from "~/components/profile/medication-card";
import MedicationImage from "~/components/profile/medication-image";
import TopNav from "~/components/shared/TopNav";
import { onMount, createSignal } from "solid-js";
import { getMedFromMedId } from "~/api/team";
import { useParams } from "@solidjs/router";
import { Show } from "solid-js";
import { Medications } from "@/schema/Medications";

export default function MedicationDetail() {
  const params = useParams();
  const [med, setMed] = createSignal<Medications>();
  onMount(async () => {
    const medId = Number(params.id);
    if (medId) {
      try {
        const fetchedMed = await getMedFromMedId(medId);
        setMed(fetchedMed);
      } catch (error) {
        console.error("Failed to fetch medication details:", error);
      }
    }
  });
  return (
    <div class="px-2">
      <Show when={med()?.teamId}>
        <TopNav
          leftNavigation="Team"
          name="Medication Details"
          backNav={med()?.teamId ? `/team/${med()?.teamId}` : "/profile"}
        />
      </Show>
      <MedicationCard
        title={med()?.name!}
        sections={[
          {
            title: "Dosage",
            content: med()?.dosage,
          },
          {
            title: "Type of Medication",
            content: med()?.typeOfMedication,
          },
          {
            title: "Frequency",
            content: med()?.frequency,
          },
          {
            title: "Medication Schedule",
            content: med()?.schedule,
          },
          {
            title: "Side Effects",
            content: med()?.sideEffects,
          },
          {
            title: "Instructions",
            content: med()?.instructions,
          },
          {
            title: "Pharmacy Information",
            content: med()?.pharmacyInfo,
          },
          ...(med()?.pharmacyImg
            ? [
                {
                  title: "Medication Photo",
                  content: (
                    <MedicationImage pharmacyImg={med()!.pharmacyImg!} />
                  ),
                },
              ]
            : []),
        ]}
      />
    </div>
  );
}
