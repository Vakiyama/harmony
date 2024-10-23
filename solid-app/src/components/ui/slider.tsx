import { cn } from "~/libs/cn"; // Utility function for class name management
import { Slider as SliderKobalte } from "@kobalte/core/slider"; // Import Kobalte Slider components
import { createSignal } from "solid-js"; // Solid's reactive signal
import ReallyTerrible from "~/routes/Team/[id]/journal/really-terrible";
import SomewhatBad from "~/routes/Team/[id]/journal/somewhat-bad";
import CompletelyOkay from "../../routes/Team/[id]/journal/completely-okay";
import PrettyGood from "~/routes/Team/[id]/journal/pretty-good";
import SuperAwesome from "~/routes/Team/[id]/journal/super-awesome";

type SliderProps = {
  className?: string; // Allow additional class names
  step?: number;
  minValue?: number;
  maxValue?: number;
  defaultValue?: number;
  id: string;
  name: string;
};
export function Slider(props: SliderProps) {
  const [value, setValue] = createSignal<number>(props.defaultValue ?? 50); // Create a signal for the slider value

  const getSliderOption = () => {
    switch (value()) {
      case 1:
        return <ReallyTerrible />;
      case 2:
        return <SomewhatBad />;
      case 3:
        return <CompletelyOkay />;
      case 4:
        return <PrettyGood />;
      case 5:
        return <SuperAwesome />;
      default:
        return null;
    }
  };

  return (
    <SliderKobalte
      value={[value()]}
      id={props.id}
      name={props.name}
      onChange={(val: number[]) => setValue(val[0])}
      class={cn(
        "relative flex flex-col items-center select-none touch-none w-full",
        props.className
      )}
      step={props.step}
      minValue={props.minValue}
      maxValue={props.maxValue}
    >
      <SliderKobalte.Label class="w-full flex justify-between"></SliderKobalte.Label>
      {/* <SliderKobalte.ValueLabel>{getSliderOption()}</SliderKobalte.ValueLabel>{" "} */}
      <div class="mb-4 h-[54px] flex flex-col items-center">
        {getSliderOption()}
      </div>
      <SliderKobalte.Track class="relative bg-[hsl(240,6%,90%)] rounded-full h-[8px] w-full">
        <SliderKobalte.Fill class="absolute bg-lofiGray rounded-full h-full" />{" "}
        <SliderKobalte.Thumb class="block w-[16px] h-[16px] bg-black rounded-full -top-[4px] hover:shadow-[0_0_0_5px_#2a91fe98] focus:outline-none focus:shadow-[0_0_0_5px_#2a91fe98]">
          <SliderKobalte.Input />
        </SliderKobalte.Thumb>
      </SliderKobalte.Track>
    </SliderKobalte>
  );
}
