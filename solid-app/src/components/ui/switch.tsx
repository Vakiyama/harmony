import { cn } from "~/libs/cn";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import type {
	SwitchControlProps,
	SwitchThumbProps,
} from "@kobalte/core/switch";
import { Switch as SwitchPrimitive } from "@kobalte/core/switch";
import type { ParentProps, ValidComponent, VoidProps } from "solid-js";
import { splitProps } from "solid-js";

export const SwitchLabel = SwitchPrimitive.Label;
export const Switch = SwitchPrimitive;
export const SwitchErrorMessage = SwitchPrimitive.ErrorMessage;
export const SwitchDescription = SwitchPrimitive.Description;

type switchControlProps<T extends ValidComponent = "input"> = ParentProps<
	SwitchControlProps<T> & { class?: string }
>;

export const SwitchControl = <T extends ValidComponent = "input">(
	props: PolymorphicProps<T, switchControlProps<T>>,
) => {
	const [local, rest] = splitProps(props as switchControlProps, [
		"class",
		"children",
	]);

	return (
		<>
			<SwitchPrimitive.Input class="[&:focus-visible+div]:tw-outline-none [&:focus-visible+div]:tw-ring-[1.5px] [&:focus-visible+div]:tw-ring-ring [&:focus-visible+div]:tw-ring-offset-2 [&:focus-visible+div]:tw-ring-offset-background" />
			<SwitchPrimitive.Control
				class={cn(
					"tw-inline-flex tw-h-5 tw-w-9 tw-shrink-0 tw-cursor-pointer tw-items-center tw-rounded-full tw-border-2 tw-border-transparent tw-bg-input tw-shadow-sm tw-transition-[color,background-color,box-shadow] data-[disabled]:tw-cursor-not-allowed data-[checked]:tw-bg-primary data-[disabled]:tw-opacity-50",
					local.class,
				)}
				{...rest}
			>
				{local.children}
			</SwitchPrimitive.Control>
		</>
	);
};

type switchThumbProps<T extends ValidComponent = "div"> = VoidProps<
	SwitchThumbProps<T> & { class?: string }
>;

export const SwitchThumb = <T extends ValidComponent = "div">(
	props: PolymorphicProps<T, switchThumbProps<T>>,
) => {
	const [local, rest] = splitProps(props as switchThumbProps, ["class"]);

	return (
		<SwitchPrimitive.Thumb
			class={cn(
				"tw-pointer-events-none tw-block tw-h-4 tw-w-4 tw-translate-x-0 tw-rounded-full tw-bg-background tw-shadow-lg tw-ring-0 tw-transition-transform data-[checked]:tw-translate-x-4",
				local.class,
			)}
			{...rest}
		/>
	);
};
