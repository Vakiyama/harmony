import { cn } from "~/libs/cn";
import type {
	AlertDialogCloseButtonProps,
	AlertDialogContentProps,
	AlertDialogDescriptionProps,
	AlertDialogTitleProps,
} from "@kobalte/core/alert-dialog";
import { AlertDialog as AlertDialogPrimitive } from "@kobalte/core/alert-dialog";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import type { ComponentProps, ParentProps, ValidComponent } from "solid-js";
import { splitProps } from "solid-js";
import { buttonVariants } from "./button";

export const AlertDialog = AlertDialogPrimitive;
export const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

type alertDialogContentProps<T extends ValidComponent = "div"> = ParentProps<
	AlertDialogContentProps<T> & {
		class?: string;
	}
>;

export const AlertDialogContent = <T extends ValidComponent = "div">(
	props: PolymorphicProps<T, alertDialogContentProps<T>>,
) => {
	const [local, rest] = splitProps(props as alertDialogContentProps, [
		"class",
		"children",
	]);

	return (
		<AlertDialogPrimitive.Portal>
			<AlertDialogPrimitive.Overlay
				class={cn(
					"tw-fixed tw-inset-0 tw-z-50 tw-bg-background/80 data-[expanded]:tw-animate-in data-[closed]:tw-animate-out data-[closed]:tw-fade-out-0 data-[expanded]:tw-fade-in-0",
				)}
			/>
			<AlertDialogPrimitive.Content
				class={cn(
					"tw-fixed tw-left-[50%] tw-top-[50%] tw-z-50 tw-grid tw-w-full tw-max-w-lg tw-translate-x-[-50%] tw-translate-y-[-50%] tw-gap-4 tw-border tw-bg-background tw-p-6 tw-shadow-lg data-[closed]:tw-duration-200 data-[expanded]:tw-duration-200 data-[expanded]:tw-animate-in data-[closed]:tw-animate-out data-[closed]:tw-fade-out-0 data-[expanded]:tw-fade-in-0 data-[closed]:tw-zoom-out-95 data-[expanded]:tw-zoom-in-95 data-[closed]:tw-slide-out-to-left-1/2 data-[closed]:tw-slide-out-to-top-[48%] data-[expanded]:tw-slide-in-from-left-1/2 data-[expanded]:tw-slide-in-from-top-[48%] sm:tw-rounded-lg md:tw-w-full",
					local.class,
				)}
				{...rest}
			>
				{local.children}
			</AlertDialogPrimitive.Content>
		</AlertDialogPrimitive.Portal>
	);
};

export const AlertDialogHeader = (props: ComponentProps<"div">) => {
	const [local, rest] = splitProps(props, ["class"]);

	return (
		<div
			class={cn(
				"tw-flex tw-flex-col tw-space-y-2 tw-text-center sm:tw-text-left",
				local.class,
			)}
			{...rest}
		/>
	);
};

export const AlertDialogFooter = (props: ComponentProps<"div">) => {
	const [local, rest] = splitProps(props, ["class"]);

	return (
		<div
			class={cn(
				"tw-flex tw-flex-col-reverse sm:tw-flex-row sm:tw-justify-end sm:tw-space-x-2",
				local.class,
			)}
			{...rest}
		/>
	);
};

type alertDialogTitleProps<T extends ValidComponent = "h2"> =
	AlertDialogTitleProps<T> & {
		class?: string;
	};

export const AlertDialogTitle = <T extends ValidComponent = "h2">(
	props: PolymorphicProps<T, alertDialogTitleProps<T>>,
) => {
	const [local, rest] = splitProps(props as alertDialogTitleProps, ["class"]);

	return (
		<AlertDialogPrimitive.Title
			class={cn("tw-text-lg tw-font-semibold", local.class)}
			{...rest}
		/>
	);
};

type alertDialogDescriptionProps<T extends ValidComponent = "p"> =
	AlertDialogDescriptionProps<T> & {
		class?: string;
	};

export const AlertDialogDescription = <T extends ValidComponent = "p">(
	props: PolymorphicProps<T, alertDialogDescriptionProps<T>>,
) => {
	const [local, rest] = splitProps(props as alertDialogDescriptionProps, [
		"class",
	]);

	return (
		<AlertDialogPrimitive.Description
			class={cn("tw-text-sm tw-text-muted-foreground", local.class)}
			{...rest}
		/>
	);
};

type alertDialogCloseProps<T extends ValidComponent = "button"> =
	AlertDialogCloseButtonProps<T> & {
		class?: string;
	};

export const AlertDialogClose = <T extends ValidComponent = "button">(
	props: PolymorphicProps<T, alertDialogCloseProps<T>>,
) => {
	const [local, rest] = splitProps(props as alertDialogCloseProps, ["class"]);

	return (
		<AlertDialogPrimitive.CloseButton
			class={cn(
				buttonVariants({
					variant: "outline",
				}),
				"tw-mt-2 md:tw-mt-0",
				local.class,
			)}
			{...rest}
		/>
	);
};

export const AlertDialogAction = <T extends ValidComponent = "button">(
	props: PolymorphicProps<T, alertDialogCloseProps<T>>,
) => {
	const [local, rest] = splitProps(props as alertDialogCloseProps, ["class"]);

	return (
		<AlertDialogPrimitive.CloseButton
			class={cn(buttonVariants(), local.class)}
			{...rest}
		/>
	);
};
