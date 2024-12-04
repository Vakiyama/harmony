import { useNavigate, useParams } from "@solidjs/router";
import { MedicationCard } from "~/components/profile/medication-card";
import MedicationImage from "~/components/profile/medication-image";
import TeamTopNav from "~/components/team/team-top-nav";
import { useTeam } from "~/context/team-context";

export default function TeamMedicationDetail() {
  const params = useParams();
  const team = useTeam();
  const navigate = useNavigate();

  const medications = team.state.medications;
  const index = Number(params.index);

  if (!medications[index]) {
    return <p>No medication found at this index.</p>;
  }
  const medication = medications[index];
  console.log(medication, "hello");
  const {
    pharmacyImg,
    name,
    dosage,
    typeOfMedication,
    frequency,
    schedule,
    sideEffects,
    instructions,
    pharmacyInfo,
  } = medication;

  return (
    <div class="px-2">
      <TeamTopNav
        leftNavigation={() => navigate("/team/create/someone")}
        rightText=""
        isCreating={false}
      />
      <MedicationCard
        title={name}
        sections={[
          {
            title: "Dosage",
            content: <p>{dosage}</p>,
          },
          {
            title: "Type of Medication",
            content: (
              <p>{typeOfMedication ? typeOfMedication : "Not provided"}</p>
            ),
          },
          {
            title: "Frequency",
            content: <p>{frequency}</p>,
          },
          {
            title: "Medication Schedule",
            content: <p>{schedule}</p>,
          },
          {
            title: "Side Effects",
            content: <p>{sideEffects ? sideEffects : "Not provided"}</p>,
          },
          {
            title: "Instructions",
            content: <p>{instructions ? instructions : "Not provided"}</p>,
          },
          {
            title: "Pharmacy Information",
            content: <p>{pharmacyInfo ? pharmacyInfo : "Not provided"}</p>,
          },
          {
            title: "Medication Photo",
            content: (
              <MedicationImage pharmacyImg={pharmacyImg ? pharmacyImg : ""} />
            ),
          },
        ]}
      />
    </div>
  );
}
