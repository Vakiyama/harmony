import ReallyTerrible from "~/routes/Team/[id]/journal/really-terrible";
import SomewhatBad from "~/routes/Team/[id]/journal/somewhat-bad";
import CompletelyOkay from "~/routes/Team/[id]/journal/completely-okay";
import PrettyGood from "~/routes/Team/[id]/journal/pretty-good";
import SuperAwesome from "~/routes/Team/[id]/journal/super-awesome";

export const getWellbeingSVG = (param: string) => {
  switch (param) {
    case "REALLY TERRIBLE":
      return (
        <ReallyTerrible
          height="15"
          width="15"
          labelClass="text-subtitle"
          iconColour="rgba(0,0,0,0.75)"
        />
      );
    case "SOMEWHAT BAD":
      return (
        <SomewhatBad
          height="15"
          width="15"
          labelClass="text-subtitle"
          iconColour="rgba(0,0,0,0.75)"
        />
      );
    case "COMPLETELY OKAY":
      return (
        <CompletelyOkay
          height="15"
          width="15"
          labelClass="text-subtitle"
          iconColour="rgba(0,0,0,0.75)"
        />
      );
    case "PRETTY GOOD":
      return (
        <PrettyGood
          height="15"
          width="15"
          labelClass="text-subtitle"
          iconColour="rgba(0,0,0,0.75)"
        />
      );
    case "SUPER AWESOME":
      return (
        <SuperAwesome
          height="15"
          width="15"
          labelClass="text-subtitle"
          iconColour="rgba(0,0,0,0.75)"
        />
      );
    default:
      return null; // return null if no matching mood
  }
};
