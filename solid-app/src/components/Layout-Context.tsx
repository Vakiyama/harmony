import { TeamWithDefault } from "../../drizzle/schema/Teams";
import { createContext, Accessor, Setter } from "solid-js";

interface TeamContextType {
  teamListData: Accessor<{ team: TeamWithDefault }[] | undefined>;
  refetchTrigger: Accessor<number>;
  setRefetchTrigger: Setter<number>;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export { TeamContext, type TeamContextType };
