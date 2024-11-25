import { Accessor, createEffect, Setter } from "solid-js";
import {
  ToggleGroup as ToggleGroupUI,
  ToggleGroupItem,
} from "../ui/toggle-group";
import MedicationIcon from "../icon/medication-icon";
import NutritionIcon from "../icon/nutrition-icon";
import SleepIcon from "../icon/sleep-icon";
import MoodIcon from "../icon/mood-icon";
import NotesIcon from "../icon/notes-icon";

type ToggleGroupProps = {
  items: string[];
  getOuter: Accessor<string | null>;
  getInner: Accessor<string[]>;
  setOuter: Setter<string | null>;
  setInner: Setter<string[]>;
};
const JournalsToggleGroup = (props: ToggleGroupProps) => {
  const getTabIcon = (tabName: string) => {
    switch (tabName) {
      case "Medication Taken":
        return (
          <MedicationIcon
            height="15"
            width="15"
            iconColor="currentColor"
            class="mr-1"
          />
        );
      case "Nutrition": {
        return (
          <NutritionIcon
            height="15"
            width="15"
            iconColor="currentColor"
            class="mr-1"
          />
        );
      }
      case "Sleep": {
        return (
          <SleepIcon
            height="15"
            width="15"
            iconColor="currentColor"
            class="mr-1"
          />
        );
      }
      case "Mood":
        return (
          <MoodIcon
            height="15"
            width="15"
            iconColor="currentColor"
            class="mr-1"
          />
        );
      case "Notes":
        return (
          <NotesIcon
            height="15"
            width="15"
            iconColor="currentColor"
            class="mr-1"
          />
        );
    }
  };
  const handleInnerChange = (value: string | string[]) => {
    if (value.includes("All")) {
      if (props.getOuter() !== "All") {
        props.setOuter("All");
        setTimeout(() => {
          props.setInner([]);
        }, 0);
      }
      return;
    }

    if (props.getOuter() === "All") {
      props.setOuter(null);
    }

    const selectedItems = Array.isArray(value) ? value : [value];
    if (selectedItems.length === props.items.length) {
      props.setOuter("All");
      setTimeout(() => {
        props.setInner([]);
      }, 0);
    }

    if (Array.isArray(value)) {
      props.setInner(value);
    } else {
      props.setInner((prev) =>
        prev.includes(value)
          ? prev.filter((item) => item !== value)
          : [...prev, value]
      );
    }
  };

  return (
    <div class="flex items-center gap-2 flex-wrap p-1 flex-col w-full">
      <ToggleGroupUI
        multiple={true}
        value={props.getInner()}
        onChange={handleInnerChange}
        class="flex-wrap"
      >
        <ToggleGroupItem
          value={"All"}
          class="flex"
          data-pressed={props.getOuter()}
        >
          All
        </ToggleGroupItem>
        {props.items.map((item) => (
          <ToggleGroupItem value={item} class="flex" tabIndex={0}>
            {getTabIcon(item)}
            {item}
          </ToggleGroupItem>
        ))}
      </ToggleGroupUI>
    </div>
  );
};

export default JournalsToggleGroup;
