import { createContext, ParentComponent, useContext } from "solid-js";
import { createStore } from "solid-js/store";

interface FormDataType {
  teamName: string;
  recipient: {
    firstName: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    photo?: string;
    gender: string;
    preferredLanguage: string;
    healthCondition: string;
    livesWith?: string;
    allergies?: string;
    dietaryRestrictions?: string;
    pastInjuries?: string;
    employment?: string;
    mobilityNeed?: string;
  };
  importantSurgeries?: {
    name?: string;
    year?: string;
    extraNotes?: string;
  }[];
  medications?: {
    name?: string;
    dosage?: string;
    typeOfMedication?: string;
    frequency?: string;
    schedule?: string;
    sideEffects?: string;
    instructions?: string;
    pharmacyInfo?: string;
    pharmacyImg?: string;
  }[];
}

interface TeamContextState {
  currentForm: Partial<FormDataType>;
  currentStep: number;
}

interface TeamContextValue {
  state: TeamContextState;
  // updateForm: (data: Partial<FormDataType>) => void;
  addSurgery: () => void;
  // updateSurgery: (index: number, data: Partial<FormDataType["importantSurgeries"][0]>) => void;
  removeSurgery: (index: number) => void;
  addMedication: () => void;
  // updateMedication: (index: number, data: Partial<FormDataType["medications"][0]>) => void;
  removeMedication: (index: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetForm: () => void;
}

export const TeamContext = createContext<TeamContextValue>();

export const TeamProvider: ParentComponent = (props: any) => {
  const [state, setState] = createStore<TeamContextState>({
    currentForm: {
      teamName: "",
      recipient: {
        firstName: "",
        gender: "",
        healthCondition: "",
        preferredLanguage: "",
      },
    },
    currentStep: 1,
  });

  const addSurgery = () => {
    setState("currentForm", "importantSurgeries", (prev) => [
      ...prev!,
      { name: "", year: "", extraNotes: "" },
    ]);
  };

  const removeSurgery = (index: number) => {
    setState("currentForm", "importantSurgeries", (prev) =>
      prev!.filter((_, i) => i !== index)
    );
  };

  const addMedication = () => {
    setState("currentForm", "medications", (prev) => [
      ...prev!,
      {
        name: "",
        dosage: "",
        typeOfMedication: "",
        frequency: "",
        schedule: "",
        sideEffects: "",
        instructions: "",
        pharmacyInfo: "",
        pharmacyImg: "",
      },
    ]);
  };

  const removeMedication = (index: number) => {
    setState("currentForm", "medications", (prev) =>
      prev!.filter((_, i) => i !== index)
    );
  };

  const nextStep = () => setState("currentStep", (prev) => prev + 1);
  const prevStep = () => setState("currentStep", (prev) => prev - 1);

  const resetForm = () =>
    setState("currentForm", {
      teamName: "",
      recipient: {
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        photo: "",
        gender: "",
        preferredLanguage: "",
        healthCondition: "",
        livesWith: "",
        allergies: "",
        dietaryRestrictions: "",
        pastInjuries: "",
        employment: "",
        mobilityNeed: "",
      },
      importantSurgeries: [],
      medications: [],
    });

  return (
    <TeamContext.Provider
      value={{
        state,
        addSurgery,
        removeSurgery,
        addMedication,
        removeMedication,
        nextStep,
        prevStep,
        resetForm,
      }}
    >
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
