import { cn } from "~/libs/cn";
import type {
  DialogContentProps,
  DialogDescriptionProps,
  DialogTitleProps,
} from "@kobalte/core/dialog";
import { Dialog as DialogPrimitive } from "@kobalte/core/dialog";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import type { ComponentProps, ParentProps, ValidComponent } from "solid-js";
import { splitProps } from "solid-js";

export const Dialog = DialogPrimitive;
export const DialogTrigger = DialogPrimitive.Trigger;

type dialogContentProps<T extends ValidComponent = "div"> = ParentProps<
  DialogContentProps<T> & {
    class?: string;
  }
>;

export const DialogContent = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, dialogContentProps<T>>
) => {
  const [local, rest] = splitProps(props as dialogContentProps, [
    "class",
    "children",
  ]);

  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        class={cn(
          "tw-fixed tw-inset-0 tw-z-50 tw-bg-background/80 data-[expanded]:tw-animate-in data-[closed]:tw-animate-out data-[closed]:tw-fade-out-0 data-[expanded]:tw-fade-in-0"
        )}
        {...rest}
      />
      <DialogPrimitive.Content
        class={cn(
          "tw-fixed tw-left-[50%] tw-top-[50%] tw-z-50 tw-grid tw-w-full tw-max-w-lg tw-translate-x-[-50%] tw-translate-y-[-50%] tw-gap-4 tw-border tw-bg-background tw-p-6 tw-shadow-lg data-[closed]:tw-duration-200 data-[expanded]:tw-duration-200 data-[expanded]:tw-animate-in data-[closed]:tw-animate-out data-[closed]:tw-fade-out-0 data-[expanded]:tw-fade-in-0 data-[closed]:tw-zoom-out-95 data-[expanded]:tw-zoom-in-95 data-[closed]:tw-slide-out-to-left-1/2 data-[closed]:tw-slide-out-to-top-[48%] data-[expanded]:tw-slide-in-from-left-1/2 data-[expanded]:tw-slide-in-from-top-[48%] sm:tw-rounded-lg md:tw-w-full",
          local.class
        )}
        {...rest}
      >
        {local.children}
        <DialogPrimitive.CloseButton class="tw-absolute tw-right-4 tw-top-4 tw-rounded-sm tw-opacity-70 tw-ring-offset-background tw-transition-[opacity,box-shadow] hover:tw-opacity-100 focus:tw-outline-none focus:tw-ring-[1.5px] focus:tw-ring-ring focus:tw-ring-offset-2 disabled:tw-pointer-events-none">
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
              d="M18 6L6 18M6 6l12 12"
            />
            <title>Close</title>
          </svg>
        </DialogPrimitive.CloseButton>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
};

type dialogTitleProps<T extends ValidComponent = "h2"> = DialogTitleProps<T> & {
  class?: string;
};

export const DialogTitle = <T extends ValidComponent = "h2">(
  props: PolymorphicProps<T, dialogTitleProps<T>>
) => {
  const [local, rest] = splitProps(props as dialogTitleProps, ["class"]);

  return (
    <DialogPrimitive.Title
      class={cn("tw-text-lg tw-font-semibold tw-text-foreground", local.class)}
      {...rest}
    />
  );
};

type dialogDescriptionProps<T extends ValidComponent = "p"> =
  DialogDescriptionProps<T> & {
    class?: string;
  };

export const DialogDescription = <T extends ValidComponent = "p">(
  props: PolymorphicProps<T, dialogDescriptionProps<T>>
) => {
  const [local, rest] = splitProps(props as dialogDescriptionProps, ["class"]);

  return (
    <DialogPrimitive.Description
      class={cn("tw-text-sm tw-text-muted-foreground", local.class)}
      {...rest}
    />
  );
};

export const DialogHeader = (props: ComponentProps<"div">) => {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <div
      class={cn(
        "tw-flex tw-flex-col tw-space-y-2 tw-text-center sm:tw-text-left",
        local.class
      )}
      {...rest}
    />
  );
};

export const DialogFooter = (props: ComponentProps<"div">) => {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <div
      class={cn(
        "tw-flex tw-flex-col-reverse sm:tw-flex-row sm:tw-justify-end sm:tw-space-x-2",
        local.class
      )}
      {...rest}
    />
  );
};
