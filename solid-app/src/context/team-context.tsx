import {
  createContext,
  ParentComponent,
  useContext,
  JSX,
  createSignal,
  Accessor,
  onMount,
} from "solid-js";
import { createStore } from "solid-js/store";
import { db } from "~/api/db";

export interface FormState {
  id: number;
  teamName: string;
  recipient: {
    firstName: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    photo?: string;
    age: string;
    gender: string;
    preferredLanguage: string;
    healthCondition: string;
    livesWith?: string;
    allergies?: string;
    dietaryRestrictions?: string;
    employment?: string;
    mobilityNeed?: string;
  };
  importantSurgeries: {
    name: string;
    year: string;
    extraNotes?: string;
  }[];
  medications: {
    name: string;
    dosage: string;
    typeOfMedication?: string;
    frequency: string;
    schedule: string;
    sideEffects?: string;
    instructions?: string;
    pharmacyInfo?: string;
    pharmacyImg?: string;
  }[];
  pastInjuries: {
    name: string;
  }[];
}

type FormSection = keyof FormState;

interface FormContextValue {
  state: FormState;
  updateField: (section: FormSection, field: string, value: string) => void;
  updateTeamId: (value: number) => void;
  updateRecipientField: (
    field: keyof FormState["recipient"],
    value: string
  ) => void;
  updateTeamName: (value: string) => void;
  addSurgery: () => void;
  updateSurgery: (
    index: number,
    field: keyof FormState["importantSurgeries"][0],
    value: string
  ) => void;
  addMedication: () => void;
  updateMedication: (
    index: number,
    field: keyof FormState["medications"][0],
    value: string
  ) => void;
  addPastInjury: () => void;
  updatePastInjury: (
    index: number,
    field: keyof FormState["pastInjuries"][0],
    value: string
  ) => void;
  currentStep: Accessor<number>;
  nextStep: () => void;
  prevStep: () => void;
  nextSubStep: () => void;
  prevSubStep: () => void;
  resetForm: () => void;
}

const TeamContext = createContext<FormContextValue>();

export const TeamProvider: ParentComponent = (props) => {
  const [state, setState] = createStore<FormState>({
    id: -1,
    teamName: "",
    recipient: {
      firstName: "",
      gender: "",
      age: "",
      healthCondition: "",
      preferredLanguage: "",
    },
    importantSurgeries: [{ name: "", year: "", extraNotes: "" }],
    medications: [],
    pastInjuries: [{ name: "" }],
  });

  const [currentStep, setCurrentStep] = createSignal(1);

  const contextValue: FormContextValue = {
    state,

    updateField: (section, field, value) => {
      setState(section as any, field as any, value);
    },
    updateTeamId: (value: number) => {
      setState("id", value);
    },
    updateTeamName: (value: string) => {
      setState("teamName", value);
    },
    updateRecipientField: (field, value) => {
      setState("recipient", field, value);
      if (field === "firstName") {
        setState("teamName", value);
      }
    },
    addSurgery: () => {
      setState("importantSurgeries", (prev) => [
        ...prev,
        { name: "", year: "", extraNotes: "" },
      ]);
    },
    updateSurgery: (index, field, value) => {
      setState("importantSurgeries", index, field, value);
    },

    addPastInjury: () => {
      setState("pastInjuries", (prev) => [...prev, { name: "" }]);
    },
    updatePastInjury: (index, field, value) => {
      setState("pastInjuries", index, field, value);
    },
    addMedication: () => {
      setState("medications", (prev) => [
        ...prev,
        {
          name: "",
          dosage: "",
          frequency: "",
          schedule: "",
          typeOfMedication: "",
          sideEffects: "",
          instructions: "",
          pharmacyInfo: "",
          pharmacyImg: "",
        },
      ]);
    },
    updateMedication: (index, field, value) => {
      setState("medications", index, field, value);
    },
    currentStep: currentStep,
    nextStep: () => {
      setCurrentStep((prev) => prev + 1);
    },
    prevStep: () => setCurrentStep((prev) => prev - 1),
    nextSubStep: () => {
      setCurrentStep((prev) => prev + 0.5);
    },
    prevSubStep: () => {
      setCurrentStep((prev) => prev - 0.5);
    },
    resetForm: () => {
      setState({
        teamName: "",
        recipient: {
          firstName: "",
          gender: "",
          age: "",
          healthCondition: "",
          preferredLanguage: "",
        },
        importantSurgeries: [],
        medications: [],
      });
      setCurrentStep(1);
    },
  };

  return (
    <TeamContext.Provider value={contextValue}>
      {props.children}
    </TeamContext.Provider>
  );
};

export const useTeam = () => {
  const context = useContext(TeamContext);
  if (!context) {
    throw new Error("useTeam must be used within a TeamProvider");
  }
  return context;
};
