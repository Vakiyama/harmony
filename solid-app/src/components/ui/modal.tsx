import { JSX } from "solid-js";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { DialogTriggerProps } from "@kobalte/core/dialog";
import { Button } from "./button";

export default function Modal(props: {
  title: string;
  onClose: () => void;
  onSubmit: () => void;
  onClick?: () => void;
  children: JSX.Element;
}) {
  return (
    <Dialog onOpenChange={(isOpen) => (!isOpen ? props.onClose() : "")}>
      <DialogTrigger
        onClick={props.onClick}
        as={(Props: DialogTriggerProps) => (
          <Button variant="outline" {...Props}>
            {props.title}
          </Button>
        )}
      />
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{props.title}</DialogTitle>
        </DialogHeader>
        <div class="grid gap-4 py-4">{props.children}</div>
        <DialogFooter>
          <Button type="submit" onClick={props.onSubmit}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
