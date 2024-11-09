import { For, Setter } from "solid-js";
import { twMerge } from "tailwind-merge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export type SelectOptions<T> = {
  value: T;
  label: string;
};

export default function SelectMultipleInput<T>(props: {
  options: SelectOptions<T>[];
  placeholder: string;
  setSelectedOptions: Setter<T[]>;
  class?: string;
  defaultValue?: SelectOptions<T>[];
}) {
  let defaultValue = props.defaultValue ?? [];
  return (
    <Select
      defaultValue={defaultValue}
      multiple
      options={props.options}
      optionValue={"value" as keyof SelectOptions<T>[]}
      optionTextValue={"label" as keyof SelectOptions<T>[]}
      itemComponent={(props) => (
        <SelectItem item={props.item}>
          <div class="flex items-center justify-between w-full">
            <span>{props.item.rawValue.label}</span>
          </div>
        </SelectItem>
      )}
    >
      <SelectTrigger class={twMerge("min-h-[40px] w-[280px]", props.class)}>
        <SelectValue<SelectOptions<T>>>
          {(state) => {
            const selectedOptions = state.selectedOptions();
            props.setSelectedOptions(() =>
              selectedOptions.map((opt) => opt.value)
            );

            return (
              <div class="flex flex-wrap gap-1">
                <For each={selectedOptions}>
                  {(option) => (
                    <span
                      class="inline-flex items-center px-2 py-1 rounded-md bg-blue-100 text-blue-800 text-sm"
                      onPointerDown={(e) => e.stopPropagation()}
                    >
                      {option.label}
                      <button
                        onClick={() => state.remove(option)}
                        class="ml-1 hover:text-blue-900"
                      >
                        x
                      </button>
                    </span>
                  )}
                </For>
              </div>
            );
          }}
        </SelectValue>
      </SelectTrigger>
      {/* temp fix z pls (if select is in modal, options dont show) */}
      <SelectContent class="z-[10000]" />
    </Select>
  );
}
