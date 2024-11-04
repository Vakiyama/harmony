import { cn } from "~/libs/cn";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import type { RadioGroupItemControlProps } from "@kobalte/core/radio-group";
import { RadioGroup as RadioGroupPrimitive } from "@kobalte/core/radio-group";
import type { ValidComponent, VoidProps } from "solid-js";
import { splitProps } from "solid-js";

export const RadioGroupDescription = RadioGroupPrimitive.Description;
export const RadioGroupErrorMessage = RadioGroupPrimitive.ErrorMessage;
export const RadioGroupItemDescription = RadioGroupPrimitive.ItemDescription;
export const RadioGroupItemInput = RadioGroupPrimitive.ItemInput;
export const RadioGroupItemLabel = RadioGroupPrimitive.ItemLabel;
export const RadioGroupLabel = RadioGroupPrimitive.Label;
export const RadioGroup = RadioGroupPrimitive;
export const RadioGroupItem = RadioGroupPrimitive.Item;

type radioGroupItemControlProps<T extends ValidComponent = "div"> = VoidProps<
  RadioGroupItemControlProps<T> & { class?: string }
>;

export const RadioGroupItemControl = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, radioGroupItemControlProps<T>>
) => {
  const [local, rest] = splitProps(props as radioGroupItemControlProps, [
    "class",
  ]);

  const controlClasses = cn(
    "flex items-center justify-center h-10 w-10 rounded-md transition-shadow text-base focus:outline-none border border-gray-300 hover:bg-primary-purple-150 disabled:cursor-not-allowed disabled:opacity-50",
    local.class
  );

  return (
    <RadioGroupPrimitive.ItemControl class={controlClasses} {...rest}>
      <RadioGroupItemInput class="absolute inset-0 opacity-0" />
      <RadioGroupPrimitive.ItemLabel class="flex items-center text-base text-black50 hover:bg-primary-purple-150 cursor-pointer ml-2">
        {props.children}
      </RadioGroupPrimitive.ItemLabel>
    </RadioGroupPrimitive.ItemControl>
  );
};
