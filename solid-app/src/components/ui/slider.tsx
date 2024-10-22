import { cn } from "~/libs/cn"; // Utility function for class name management
import { Slider as SliderKobalte } from "@kobalte/core/slider"; // Import Kobalte Slider components
import { createSignal } from "solid-js"; // Solid's reactive signal

type SliderProps = {
  className?: string; // Allow additional class names
  step?: number;
  minValue?: number;
  maxValue?: number;
  defaultValue?: number;
};
export function Slider(props: SliderProps) {
  const [value, setValue] = createSignal<number>(props.defaultValue ?? 50); // Create a signal for the slider value

  return (
    <SliderKobalte
      value={[value()]}
      onChange={(val: number[]) => setValue(val[0])}
      class={cn(
        "relative flex flex-col items-center select-none touch-none w-[200px]",
        props.className
      )}
      step={props.step}
      minValue={props.minValue}
      maxValue={props.maxValue}
    >
      <SliderKobalte.Label class="w-full flex justify-between">
        Adjust Value
      </SliderKobalte.Label>
      <SliderKobalte.ValueLabel>{value()}</SliderKobalte.ValueLabel>{" "}
      <SliderKobalte.Track class="relative bg-[hsl(240,6%,90%)] rounded-full h-[8px] w-full">
        <SliderKobalte.Fill class="absolute bg-[hsl(200,98%,39%)] rounded-full h-full" />{" "}
        <SliderKobalte.Thumb class="block w-[16px] h-[16px] bg-[hsl(200,98%,39%)] rounded-full -top-[4px] hover:shadow-[0_0_0_5px_#2a91fe98] focus:outline-none focus:shadow-[0_0_0_5px_#2a91fe98]">
          <SliderKobalte.Input />
        </SliderKobalte.Thumb>
      </SliderKobalte.Track>
    </SliderKobalte>
  );
}
