import { cn } from "~/libs/cn";
import type { ButtonRootProps } from "@kobalte/core/button";
import { Button as ButtonPrimitive } from "@kobalte/core/button";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import type { ValidComponent } from "solid-js";
import { splitProps } from "solid-js";

export const buttonVariants = cva(
	"tw-inline-flex tw-items-center tw-justify-center tw-rounded-md tw-text-sm tw-font-medium tw-transition-[color,background-color,box-shadow] focus-visible:tw-outline-none focus-visible:tw-ring-[1.5px] focus-visible:tw-ring-ring disabled:tw-pointer-events-none disabled:tw-opacity-50",
	{
		variants: {
			variant: {
				default:
					"tw-bg-primary tw-text-primary-foreground tw-shadow hover:tw-bg-primary/90",
				destructive:
					"tw-bg-destructive tw-text-destructive-foreground tw-shadow-sm hover:tw-bg-destructive/90",
				outline:
					"tw-border tw-border-input tw-bg-background tw-shadow-sm hover:tw-bg-accent hover:tw-text-accent-foreground",
				secondary:
					"tw-bg-secondary tw-text-secondary-foreground tw-shadow-sm hover:tw-bg-secondary/80",
				ghost: "hover:tw-bg-accent hover:tw-text-accent-foreground",
				link: "tw-text-primary tw-underline-offset-4 hover:tw-underline",
			},
			size: {
				default: "tw-h-9 tw-px-4 tw-py-2",
				sm: "tw-h-8 tw-rounded-md tw-px-3 tw-text-xs",
				lg: "tw-h-10 tw-rounded-md tw-px-8",
				icon: "tw-h-9 tw-w-9",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

type buttonProps<T extends ValidComponent = "button"> = ButtonRootProps<T> &
	VariantProps<typeof buttonVariants> & {
		class?: string;
	};

export const Button = <T extends ValidComponent = "button">(
	props: PolymorphicProps<T, buttonProps<T>>,
) => {
	const [local, rest] = splitProps(props as buttonProps, [
		"class",
		"variant",
		"size",
	]);

	return (
		<ButtonPrimitive
			class={cn(
				buttonVariants({
					size: local.size,
					variant: local.variant,
				}),
				local.class,
			)}
			{...rest}
		/>
	);
};
