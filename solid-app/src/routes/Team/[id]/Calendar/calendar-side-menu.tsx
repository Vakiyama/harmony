import { TeamMember } from "@/schema/TeamMembers";
import { User } from "@/schema/Users";
import { useSearchParams } from "@solidjs/router";
import {
  NavigateOptions,
  SearchParams,
  SetSearchParams,
} from "node_modules/@solidjs/router/dist/types";
import { FaSolidAngleDown, FaSolidAngleUp } from "solid-icons/fa";
import {
  Accessor,
  batch,
  createSignal,
  For,
  onMount,
  Setter,
  Show,
} from "solid-js";
import BsGrid2x3GapFill from "~/components/icon/bs-grid-2x3-gap-fill";
import BsGrid3x3GapFill from "~/components/icon/bs-grid-3x3-gap-fill";
import CalendarIcon from "~/components/icon/calendar-icon";
import TbRectangleFilled from "~/components/icon/tb-rectangle-filled";
import Checkbox from "~/components/shared/checkbox";
type CalendarFilterType =
  | "events"
  | "tasks"
  | "medication"
  | "complete"
  | "uncompleted";

const DEFAULT_FILTERS: CalendarFilterType[] = [
  "events",
  "tasks",
  "medication",
  "complete",
  "uncompleted",
];

const CalendarSideMenu = (props: {
  refetchData: () => Promise<void>;
  setIsSideMenuOpen: Setter<boolean>;
  teamMembers: Accessor<{ users: User; teammembers: TeamMember }[]>;
  params: Accessor<SetSearchParams>;
  setParams: Setter<SetSearchParams>;
  setSearchParams: (
    params: SetSearchParams,
    options?: Partial<NavigateOptions>
  ) => void;
  searchParams: Partial<SearchParams>;

  setCurrentView: Setter<"day" | "week" | "month" | undefined>;
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isPeopleOpen, setIsPeopleOpen] = createSignal(false);
  const [isCalendarOpen, setIsCalendarOpen] = createSignal(false);
  const [isTeamOpen, setIsTeamOpen] = createSignal(false);

  const updateFilters = async (newFilters: string) => {
    props.setSearchParams(
      { ...props.searchParams, filters: newFilters },
      { replace: true }
    );
    props.setParams({ ...props.searchParams, filters: newFilters });
    await props.refetchData();
  };

  const updateSelected = async (newSelected: string) => {
    props.setSearchParams(
      { ...props.searchParams, selected: newSelected },
      { replace: true }
    );
    props.setParams({ ...props.searchParams, selected: newSelected });
    await props.refetchData();
  };

  const getSelectedFilters = () => {
    return props.searchParams.filters
      ? (props.searchParams.filters
          .toString()
          .split(",") as CalendarFilterType[])
      : [];
  };

  const getSelectedMembers = () => {
    return searchParams.selected
      ? searchParams.selected.toString().split(",")
      : [];
  };

  function handleBackdropClick(e: Event) {
    if (e.target === e.currentTarget) {
      props.setIsSideMenuOpen(false);
    }
  }

  const isFilterActive = (filterType: CalendarFilterType) => {
    return getSelectedFilters().includes(filterType);
  };

  const isSelected = (userId: number) => {
    return getSelectedMembers().includes(userId.toString());
  };

  const toggleMember = (userId: number) => {
    const currentSelected = getSelectedMembers();
    let newSelected: string[];

    if (currentSelected.includes(userId.toString())) {
      newSelected = currentSelected.filter(
        (id: string) => id !== userId.toString()
      );
    } else {
      newSelected = [...currentSelected, userId.toString()];
    }

    batch(() => {
      updateSelected(newSelected.join(","));
    });
  };

  const toggleFilter = (filterType: CalendarFilterType) => {
    const currentFilters = getSelectedFilters();
    let newFilters: CalendarFilterType[];

    if (currentFilters.includes(filterType)) {
      newFilters = currentFilters.filter((f) => f !== filterType);
    } else {
      newFilters = [...currentFilters, filterType];
    }
    batch(() => {
      updateFilters(newFilters.join(","));
    });
  };

  return (
    <div
      class="fixed top-0 h-full w-full flex bg-black bg-opacity-50 z-[3]"
      onclick={handleBackdropClick}
    >
      <div class="w-[265px] h-[calc(100%+110px)] absolute right-0 bg-[#fcfcfc] ">
        <div class="w-full h-[90px] pt-1.5 pb-2.5  bg-[#fcfcfc] border-b border-[#1e1e1e]/20 flex-col justify-end items-center gap-2.5 inline-flex">
          <button
            class="w-44 h-6 flex justify-between items-center"
            onclick={() => {
              setIsTeamOpen(!isTeamOpen());
            }}
          >
            <div class="text-[#1e1e1e] text-[19px] font-medium font-grotesque  leading-[22.80px]">
              Lola’s Care Team
            </div>
            <Show
              when={isTeamOpen()}
              fallback={<FaSolidAngleDown class="text-xl" />}
            >
              <FaSolidAngleUp class="text-xl" />
            </Show>
          </button>
        </div>
        <div class="flex-col justify-center items-center inline-flex w-full">
          <button
            onClick={() => {
              props.setCurrentView("month");
              props.setIsSideMenuOpen(false);
            }}
            class="w-full"
          >
            <div class="self-stretch py-[13px] justify-start items-center gap-2 flex border-b border-[#1e1e1e]/20 px-3">
              <BsGrid3x3GapFill />
              <div class="txt-[#1e1e1e] text-base font-normal font-sf-pro leading-tight">
                Month
              </div>
            </div>
          </button>
          <button
            onClick={() => {
              props.setCurrentView("week");
              props.setIsSideMenuOpen(false);
            }}
            class="w-full"
          >
            <div class="self-stretch py-[13px] justify-start items-center gap-2 flex border-b border-[#1e1e1e]/20 px-3">
              <BsGrid2x3GapFill />
              <div class="txt-[#1e1e1e] text-base font-normal font-sf-pro leading-tight">
                Week
              </div>
            </div>
          </button>
          <button
            onClick={() => {
              props.setCurrentView("day");
              props.setIsSideMenuOpen(false);
            }}
            class="w-full"
          >
            <div class="self-stretch py-[13px] justify-start items-center gap-2 flex px-3">
              <TbRectangleFilled />
              <div class="txt-[#1e1e1e] text-base font-normal font-sf-pro leading-tight">
                Day
              </div>
            </div>
          </button>
        </div>
        <div class="w-full flex-col justify-center items-start pt-[18px] space-y-[18px]">
          <button
            class="h-[29px] w-full flex justify-between items-center border-b border-[#1e1e1e]/20 px-3"
            onclick={() => {
              setIsCalendarOpen(!isCalendarOpen());
            }}
          >
            <div class=" h-full text-[#1e1e1e] text-[19px] font-medium font-grotesque leading-[22.80px]">
              Calendar
            </div>
            <Show
              when={isCalendarOpen()}
              fallback={<FaSolidAngleDown class="text-xl" />}
            >
              <FaSolidAngleUp class="text-xl" />
            </Show>
          </button>
          <Show when={isCalendarOpen()}>
            <div class="space-y-3">
              <Checkbox
                label="Events"
                checked={() => isFilterActive("events")}
                setChecked={() => toggleFilter("events")}
              />
              <Checkbox
                label="Tasks"
                checked={() => isFilterActive("tasks")}
                setChecked={() => toggleFilter("tasks")}
              />
              <Checkbox
                label="Medication"
                checked={() => isFilterActive("medication")}
                setChecked={() => toggleFilter("medication")}
              />
              <Checkbox
                label="Complete"
                checked={() => isFilterActive("complete")}
                setChecked={() => toggleFilter("complete")}
              />
              <Checkbox
                label="Uncompleted"
                checked={() => isFilterActive("uncompleted")}
                setChecked={() => toggleFilter("uncompleted")}
              />
            </div>
          </Show>
          <button
            class="h-[29px] w-full flex justify-between items-center border-b border-[#1e1e1e]/20 px-3"
            onclick={() => {
              setIsPeopleOpen(!isPeopleOpen());
            }}
          >
            <div class="h-full text-[#1e1e1e] text-[19px] font-medium font-grotesque leading-[22.80px]">
              People
            </div>
            <Show
              when={isPeopleOpen()}
              fallback={<FaSolidAngleDown class="text-xl" />}
            >
              <FaSolidAngleUp class="text-xl" />
            </Show>
          </button>
          <Show when={isPeopleOpen()}>
            <For each={props.teamMembers()}>
              {(teamMember) => (
                <Checkbox
                  label={`${teamMember.users.firstName} ${teamMember.users.lastName}`}
                  checked={() => isSelected(teamMember.users.id)}
                  setChecked={() => toggleMember(teamMember.users.id)}
                />
              )}
            </For>
          </Show>
        </div>
      </div>
    </div>
  );
};

export default CalendarSideMenu;
