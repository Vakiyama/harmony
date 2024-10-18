import { createContext } from "solid-js";
import { createStore } from "solid-js/store";
import { CreateTeamFormData } from "~/routes/api/team/create-team-action";

// Initialize store
// const TeamFormContext = createContext();

const [formData, setFormData] = createStore<CreateTeamFormData>({
  teamName: "",
  recipient: {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    gender: "",
    preferredLanguage: "",
    livesWith: "",
    hometown: "",
    employment: "",
  },
  userRole: "I work in a healthcare setting",
  teamRole: "Admin",
});
export function useCreateTeamForm() {
  // update value in every field
  const updateField = (field: keyof CreateTeamFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // update value in recipient field
  const updateRecipientField = (
    field: keyof CreateTeamFormData["recipient"],
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      recipient: {
        // Copy the existing recipient data
        ...prev.recipient,
        [field]: value,
      },
    }));
    console.log(`Updated recipient field ${field}:`, value);
    console.log("Current form data:", JSON.stringify(formData));
  };

  return { formData, updateField, updateRecipientField };
}
