import TextFieldLine from "../shared/TextFieldLine";

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
      <h1>Advil</h1>
      {fields.map(({ label, value }, index) => (
        <TextFieldLine key={index} label={label} value={value} />
      ))}
    </div>
  );
}
