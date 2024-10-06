import { cn } from "~/libs/cn";
import type { CheckboxControlProps } from "@kobalte/core/checkbox";
import { Checkbox as CheckboxPrimitive } from "@kobalte/core/checkbox";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import type { ValidComponent, VoidProps } from "solid-js";
import { splitProps } from "solid-js";

export const CheckboxLabel = CheckboxPrimitive.Label;
export const Checkbox = CheckboxPrimitive;
export const CheckboxErrorMessage = CheckboxPrimitive.ErrorMessage;
export const CheckboxDescription = CheckboxPrimitive.Description;

type checkboxControlProps<T extends ValidComponent = "div"> = VoidProps<
	CheckboxControlProps<T> & { class?: string }
>;

export const CheckboxControl = <T extends ValidComponent = "div">(
	props: PolymorphicProps<T, checkboxControlProps<T>>,
) => {
	const [local, rest] = splitProps(props as checkboxControlProps, [
		"class",
		"children",
	]);

	return (
		<>
			<CheckboxPrimitive.Input class="[&:focus-visible+div]:tw-outline-none [&:focus-visible+div]:tw-ring-[1.5px] [&:focus-visible+div]:tw-ring-ring [&:focus-visible+div]:tw-ring-offset-2 [&:focus-visible+div]:tw-ring-offset-background" />
			<CheckboxPrimitive.Control
				class={cn(
					"tw-h-4 tw-w-4 tw-shrink-0 tw-rounded-sm tw-border tw-border-primary tw-shadow tw-transition-shadow focus-visible:tw-outline-none focus-visible:tw-ring-[1.5px] focus-visible:tw-ring-ring data-[disabled]:tw-cursor-not-allowed data-[checked]:tw-bg-primary data-[checked]:tw-text-primary-foreground data-[disabled]:tw-opacity-50",
					local.class,
				)}
				{...rest}
			>
				<CheckboxPrimitive.Indicator class="tw-flex tw-items-center tw-justify-center tw-text-current">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						class="tw-h-4 tw-w-4"
					>
						<path
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="m5 12l5 5L20 7"
						/>
						<title>Checkbox</title>
					</svg>
				</CheckboxPrimitive.Indicator>
			</CheckboxPrimitive.Control>
		</>
	);
};
