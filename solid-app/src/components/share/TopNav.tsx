import { A } from "@solidjs/router";
import { JSX } from "solid-js";

interface TopNavProps {
  name?: JSX.Element;
  leftNavigation?: JSX.Element;
  rightNavigation?: JSX.Element;
}

export default function TopNav({
  name,
  leftNavigation,
  rightNavigation,
}: TopNavProps) {
  return (
    <div class="w-full flex flex-row h-[95px] bg-white shadow-md">
      <div class="w-full flex flex-row justify-between items-end px-4 mb-4">
        <div class="flex items-center">
          <A href="/">{leftNavigation}</A>
        </div>
        <div class="flex-1 flex justify-center">
          <h4 class="text-md">{name}</h4>
        </div>
        <div class="flex justify-end">
          <A href="/" class="text-md">
            {rightNavigation}
          </A>
        </div>
      </div>
    </div>
  );
}
