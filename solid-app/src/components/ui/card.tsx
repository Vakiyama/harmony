import { cn } from "~/libs/cn";
import type { ComponentProps, ParentComponent } from "solid-js";
import { splitProps } from "solid-js";

export const Card = (props: ComponentProps<"div">) => {
	const [local, rest] = splitProps(props, ["class"]);

	return (
		<div
			class={cn(
				"tw-rounded-xl tw-border tw-bg-card tw-text-card-foreground tw-shadow",
				local.class,
			)}
			{...rest}
		/>
	);
};

export const CardHeader = (props: ComponentProps<"div">) => {
	const [local, rest] = splitProps(props, ["class"]);

	return (
		<div class={cn("tw-flex tw-flex-col tw-space-y-1.5 tw-p-6", local.class)} {...rest} />
	);
};

export const CardTitle: ParentComponent<ComponentProps<"h1">> = (props) => {
	const [local, rest] = splitProps(props, ["class"]);

	return (
		<h1
			class={cn("tw-font-semibold tw-leading-none tw-tracking-tight", local.class)}
			{...rest}
		/>
	);
};

export const CardDescription: ParentComponent<ComponentProps<"h3">> = (
	props,
) => {
	const [local, rest] = splitProps(props, ["class"]);

	return (
		<h3 class={cn("tw-text-sm tw-text-muted-foreground", local.class)} {...rest} />
	);
};

export const CardContent = (props: ComponentProps<"div">) => {
	const [local, rest] = splitProps(props, ["class"]);

	return <div class={cn("tw-p-6 tw-pt-0", local.class)} {...rest} />;
};

export const CardFooter = (props: ComponentProps<"div">) => {
	const [local, rest] = splitProps(props, ["class"]);

	return (
		<div class={cn("tw-flex tw-items-center tw-p-6 tw-pt-0", local.class)} {...rest} />
	);
};
