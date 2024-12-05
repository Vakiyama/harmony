import { cn } from "~/libs/cn";
import { Slider as SliderKobalte } from "@kobalte/core/slider";
import { createSignal } from "solid-js";
import ReallyTerrible from "~/routes/Team/[id]/journal/really-terrible";
import SomewhatBad from "~/routes/Team/[id]/journal/somewhat-bad";
import CompletelyOkay from "../../routes/Team/[id]/journal/completely-okay";
import PrettyGood from "~/routes/Team/[id]/journal/pretty-good";
import SuperAwesome from "~/routes/Team/[id]/journal/super-awesome";

type SliderProps = {
  className?: string;
  step?: number;
  minValue?: number;
  maxValue?: number;
  defaultValue?: number;
  id: string;
  name: string;
};
export function Slider(props: SliderProps) {
  const [value, setValue] = createSignal<number>(props.defaultValue ?? 50);

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
  const ticks = () => {
    const step = props.step || 1;
    const min = props.minValue || 0;
    const max = props.maxValue || 100;
    const numTicks = Math.floor((max - min) / step);

    return Array.from(
      { length: numTicks + 1 },
      (_, index) => min + index * step
    );
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
        <SliderKobalte.Fill class="absolute bg-primary-purple-150 rounded-full h-full" />{" "}
        {ticks().map((tickValue) => {
          const position =
            ((tickValue - (props.minValue || 0)) /
              ((props.maxValue || 100) - (props.minValue || 0))) *
            100;

          return (
            <div
              class={`absolute bottom-0 left-0 w-[10px] h-[10px] rounded-full bg-primary-purple-300 translate-x-[-50%] translate-y-[1px]`}
              style={{
                left: `${position}%`,
              }}
            ></div>
          );
        })}
        <SliderKobalte.Thumb class="block w-[16px] h-[16px] bg-primary-purple-500 rounded-full -top-[4px] hover:shadow-[0_0_0_5px_#937AEE98] focus:outline-black focus:outline-offset-4 focus:shadow-[0_0_0_5px_#937AEE98]">
          <SliderKobalte.Input />
        </SliderKobalte.Thumb>
      </SliderKobalte.Track>
    </SliderKobalte>
  );
}
