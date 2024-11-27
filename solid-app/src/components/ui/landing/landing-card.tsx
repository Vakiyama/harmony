import { cn } from "~/libs/cn";
import type { ComponentProps, ParentComponent } from "solid-js";
import { splitProps } from "solid-js";

export const Card = (props: ComponentProps<"div">) => {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <div
      class={cn(
        "rounded-xl border bg-card text-card-foreground flex flex-col gap-3",
        local.class
      )}
      {...rest}
    />
  );
};

export const CardHeader = (props: ComponentProps<"div">) => {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <div
      class={cn(
        "flex flex-row justify-between items-center px-2 pt-3",
        local.class
      )}
      {...rest}
    />
  );
};

export const CardTitle: ParentComponent<ComponentProps<"h1">> = (props) => {
  const [local, rest] = splitProps(props, ["class"]);

  return <h1 class={cn("font-medium text-base", local.class)} {...rest} />;
};

export const CardDescription: ParentComponent<ComponentProps<"h3">> = (
  props
) => {
  const [local, rest] = splitProps(props, ["class"]);

  return <h3 class={cn("text-black/75", local.class)} {...rest} />;
};

export const CardContent = (props: ComponentProps<"div">) => {
  const [local, rest] = splitProps(props, ["class"]);

  return <div class={cn("p-3 pt-0", local.class)} {...rest} />;
};

export const CardFooter = (props: ComponentProps<"div">) => {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <div class={cn("flex items-center p-6 pt-0", local.class)} {...rest} />
  );
};
