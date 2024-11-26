import { cn } from "../../libs/cn";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import type { ToggleButtonRootProps } from "@kobalte/core/toggle-button";
import { ToggleButton as ToggleButtonPrimitive } from "@kobalte/core/toggle-button";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import type { ValidComponent } from "solid-js";
import { splitProps } from "solid-js";

export const toggleVariants = cva(
  "flex items-center justify-center rounded-2xl text-sm font-medium transition-[box-shadow,color,background-color] focus-visible:outline-none focus-visible:ring-[1.5px] focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[pressed]:bg-[#7859EA] data-[pressed]:text-white",
  {
    variants: {
      variant: {
        default:
          "bg-white border border-[#C9BDF7] rounded-2xl text-sm font-medium outline-none transition-colors",
      },
      size: {
        default: "h-7 px-3 py-1 mr-2 rounded-2xl text-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

type toggleButtonProps<T extends ValidComponent = "button"> =
  ToggleButtonRootProps<T> &
    VariantProps<typeof toggleVariants> & {
      class?: string;
    };

export const ToggleButton = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, toggleButtonProps<T>>
) => {
  const [local, rest] = splitProps(props as toggleButtonProps, [
    "class",
    "variant",
    "size",
  ]);

  return (
    <ToggleButtonPrimitive
      class={cn(
        toggleVariants({ variant: local.variant, size: local.size }),
        local.class
      )}
      {...rest}
    />
  );
};
