import TextFieldLine from "../shared/TextFieldLine";
import TopNav from "../shared/TopNav";

export default function MedDetailCard() {
  const medicationName = ["Advil", "Vysanse"];
  const fields = [
    { label: "Dosage", value: "" },
    { label: "Frequency", value: "" },
    { label: "Medication Schedule", value: "" },
    { label: "Side Effects", value: "" },
    { label: "Introduction", value: "" },
    { label: "Pharmacy", value: "" },
  ];
  return (
    <div>
      {/* Body */}
      <div class="h-[48px]">
        <p class="text-2xl">Advil</p>
        {fields.map(({ label, value }, index) => (
          <TextFieldLine key={index.toString()} label={label} value={value} />
        ))}
      </div>
    </div>
  );
}
