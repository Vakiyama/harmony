import { cn } from "~/libs/cn";
import type { DialogContentProps } from "@kobalte/core/dialog";
import { Dialog as DialogPrimitive } from "@kobalte/core/dialog";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import type { ParentProps, ValidComponent } from "solid-js";
import { splitProps } from "solid-js";

export const JournalEntryDialog = DialogPrimitive;

type dialogContentProps<T extends ValidComponent = "div"> = ParentProps<
  DialogContentProps<T> & {
    class?: string;
  }
>;

export const JournalEntryDialogContent = <T extends ValidComponent = "div">(
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
          "fixed inset-0 z-50 bg-black bg-opacity-50 data-[expanded]:animate-in data-[closed]:animate-out data-[closed]:fade-out-0 data-[expanded]:fade-in-0"
        )}
        {...rest}
      />
      <DialogPrimitive.Content
        class={cn(
          "fixed left-[50%] rounded-lg top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 p-6 data-[closed]:duration-200 data-[expanded]:duration-200 data-[expanded]:animate-in data-[closed]:animate-out data-[closed]:fade-out-0 data-[expanded]:fade-in-0 data-[closed]:zoom-out-95 data-[expanded]:zoom-in-95 data-[closed]:slide-out-to-left-1/2 data-[closed]:slide-out-to-top-[48%] data-[expanded]:slide-in-from-left-1/2 data-[expanded]:slide-in-from-top-[48%] sm:rounded-lg md:w-full",
          local.class
        )}
        {...rest}
      >
        {local.children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
};
