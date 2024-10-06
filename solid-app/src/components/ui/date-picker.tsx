import { cn } from "../../libs/cn";
import type {
  DatePickerContentProps,
  DatePickerInputProps,
  DatePickerRangeTextProps,
  DatePickerRootProps,
  DatePickerTableCellProps,
  DatePickerTableCellTriggerProps,
  DatePickerTableHeaderProps,
  DatePickerTableProps,
  DatePickerTableRowProps,
  DatePickerViewControlProps,
  DatePickerViewProps,
  DatePickerViewTriggerProps,
} from "@ark-ui/solid";
import { DatePicker as DatePickerPrimitive } from "@ark-ui/solid";
import type { VoidProps } from "solid-js";
import { splitProps } from "solid-js";
import { buttonVariants } from "./button";

export const DatePickerLabel = DatePickerPrimitive.Label;
export const DatePickerTableHead = DatePickerPrimitive.TableHead;
export const DatePickerTableBody = DatePickerPrimitive.TableBody;
export const DatePickerClearTrigger = DatePickerPrimitive.ClearTrigger;
export const DatePickerYearSelect = DatePickerPrimitive.YearSelect;
export const DatePickerMonthSelect = DatePickerPrimitive.MonthSelect;
export const DatePickerContext = DatePickerPrimitive.Context;
export const DatePickerRootProvider = DatePickerPrimitive.RootProvider;

export const DatePicker = (props: DatePickerRootProps) => {
  return (
    <DatePickerPrimitive.Root
      format={(e) => {
        const parsedDate = new Date(Date.parse(e.toString()));

        const normalizedDate = new Date(
          parsedDate.getUTCFullYear(),
          parsedDate.getUTCMonth(),
          parsedDate.getUTCDate()
        );

        return new Intl.DateTimeFormat("en-US", {
          dateStyle: "long",
        }).format(normalizedDate);
      }}
      {...props}
    />
  );
};

export const DatePickerView = (props: DatePickerViewProps) => {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <DatePickerPrimitive.View
      class={cn("tw-space-y-4", local.class)}
      {...rest}
    />
  );
};

export const DatePickerViewControl = (props: DatePickerViewControlProps) => {
  const [local, rest] = splitProps(props, ["class", "children"]);

  return (
    <DatePickerPrimitive.ViewControl
      class={cn("tw-flex tw-items-center tw-justify-between", local.class)}
      {...rest}
    >
      <DatePickerPrimitive.PrevTrigger
        class={cn(
          buttonVariants({
            variant: "outline",
          }),
          "tw-h-7 tw-w-7 tw-bg-transparent tw-p-0 tw-opacity-50 hover:tw-opacity-100"
        )}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="tw-h-4 tw-w-4"
          viewBox="0 0 24 24"
        >
          <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m15 6l-6 6l6 6"
          />
          <title>Previous</title>
        </svg>
      </DatePickerPrimitive.PrevTrigger>
      {local.children}
      <DatePickerPrimitive.NextTrigger
        class={cn(
          buttonVariants({
            variant: "outline",
          }),
          "tw-h-7 tw-w-7 tw-bg-transparent tw-p-0 tw-opacity-50 hover:tw-opacity-100"
        )}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="tw-h-4 tw-w-4"
          viewBox="0 0 24 24"
        >
          <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m9 6l6 6l-6 6"
          />
          <title>Next</title>
        </svg>
      </DatePickerPrimitive.NextTrigger>
    </DatePickerPrimitive.ViewControl>
  );
};

export const DatePickerRangeText = (
  props: VoidProps<DatePickerRangeTextProps>
) => {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <DatePickerPrimitive.RangeText
      class={cn("tw-text-sm tw-font-medium", local.class)}
      {...rest}
    />
  );
};

export const DatePickerTable = (props: DatePickerTableProps) => {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <DatePickerPrimitive.Table
      class={cn("tw-w-full tw-border-collapse tw-space-y-1", local.class)}
      {...rest}
    />
  );
};

export const DatePickerTableRow = (props: DatePickerTableRowProps) => {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <DatePickerPrimitive.TableRow
      class={cn("tw-mt-2 tw-flex tw-w-full", local.class)}
      {...rest}
    />
  );
};

export const DatePickerTableHeader = (props: DatePickerTableHeaderProps) => {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <DatePickerPrimitive.TableHeader
      class={cn(
        "tw-w-8 tw-flex-1 tw-text-[0.8rem] tw-font-normal tw-text-muted-foreground",
        local.class
      )}
      {...rest}
    />
  );
};

export const DatePickerTableCell = (props: DatePickerTableCellProps) => {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <DatePickerPrimitive.TableCell
      class={cn(
        "tw-flex-1 tw-p-0 tw-text-center tw-text-sm",
        "has-[[data-in-range]]:tw-bg-accent has-[[data-in-range]]:first-of-type:tw-rounded-l-md has-[[data-in-range]]:last-of-type:tw-rounded-r-md",
        "has-[[data-range-end]]:tw-rounded-r-md has-[[data-range-start]]:tw-rounded-l-md",
        "has-[[data-outside-range][data-in-range]]:tw-bg-accent/50",
        local.class
      )}
      {...rest}
    />
  );
};

export const DatePickerTableCellTrigger = (
  props: DatePickerTableCellTriggerProps
) => {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <DatePickerPrimitive.TableCellTrigger
      class={cn(
        buttonVariants({ variant: "ghost" }),
        "tw-size-8 tw-w-full tw-p-0 tw-font-normal data-[selected]:tw-opacity-100",
        "data-[today]:tw-bg-accent data-[today]:tw-text-accent-foreground",
        "[&:is([data-today][data-selected])]:tw-bg-primary [&:is([data-today][data-selected])]:tw-text-primary-foreground",
        "data-[selected]:tw-bg-primary data-[selected]:tw-text-primary-foreground data-[selected]:hover:tw-bg-primary data-[selected]:hover:tw-text-primary-foreground",
        "data-[disabled]:tw-text-muted-foreground data-[disabled]:tw-opacity-50",
        "data-[outside-range]:tw-text-muted-foreground data-[outside-range]:tw-opacity-50",
        "[&:is([data-outside-range][data-in-range])]:tw-bg-accent/50 [&:is([data-outside-range][data-in-range])]:tw-text-muted-foreground [&:is([data-outside-range][data-in-range])]:tw-opacity-30",
        local.class
      )}
      {...rest}
    />
  );
};

export const DatePickerViewTrigger = (props: DatePickerViewTriggerProps) => {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <DatePickerPrimitive.ViewTrigger
      class={cn(buttonVariants({ variant: "ghost" }), "tw-h-7", local.class)}
      {...rest}
    />
  );
};

export const DatePickerContent = (props: DatePickerContentProps) => {
  const [local, rest] = splitProps(props, ["class", "children"]);

  return (
    <DatePickerPrimitive.Positioner>
      <DatePickerPrimitive.Content
        class={cn(
          "tw-rounded-md tw-border tw-bg-popover tw-p-3 tw-text-popover-foreground tw-shadow-md tw-outline-none data-[state=open]:tw-animate-in data-[state=closed]:tw-animate-out data-[state=closed]:tw-fade-out-0 data-[state=open]:tw-fade-in-0 data-[state=closed]:tw-zoom-out-95 data-[state=open]:tw-zoom-in-95 tw-z-50",
          local.class
        )}
        {...rest}
      >
        {local.children}
      </DatePickerPrimitive.Content>
    </DatePickerPrimitive.Positioner>
  );
};

export const DatePickerInput = (props: DatePickerInputProps) => {
  const [local, rest] = splitProps(props, ["class", "children"]);

  return (
    <DatePickerPrimitive.Control class="tw-flex tw-h-9 tw-w-full tw-rounded-md tw-border tw-border-input tw-bg-background tw-px-3 tw-py-1 tw-text-sm tw-shadow-sm placeholder:tw-text-muted-foreground focus-visible:tw-outline-none focus-visible:tw-ring-[1.5px] focus-visible:tw-ring-ring disabled:tw-cursor-not-allowed disabled:tw-opacity-50">
      <DatePickerPrimitive.Input
        class={cn(
          "tw-w-full tw-appearance-none tw-bg-transparent tw-outline-none",
          local.class
        )}
        {...rest}
      />
      <DatePickerPrimitive.Trigger class="tw-transition-shadow focus-visible:tw-outline-none focus-visible:tw-ring-[1.5px] focus-visible:tw-ring-ring">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="tw-mx-1 tw-h-4 tw-w-4"
          viewBox="0 0 24 24"
        >
          <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm12-4v4M8 3v4m-4 4h16m-9 4h1m0 0v3"
          />
          <title>Calendar</title>
        </svg>
      </DatePickerPrimitive.Trigger>
    </DatePickerPrimitive.Control>
  );
};
