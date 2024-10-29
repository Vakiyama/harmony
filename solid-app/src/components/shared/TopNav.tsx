import { JSX } from "solid-js";
import { useLocation } from "@solidjs/router";

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
  const location = useLocation();

  let backLocation;

  if (location.pathname.startsWith("/team/1/journal")) {
    backLocation = "/team/1/journal";
  }

  return (
    <div class="w-full flex flex-row h-[95px] bg-white shadow-md">
      <div class="w-full flex flex-row justify-between items-end px-4 mb-4">
        <div class="flex items-center">
          <a href={backLocation}>{leftNavigation}</a>
        </div>
        <div class="flex-1 flex justify-center">
          <h4 class="text-md">{name}</h4>
        </div>
        <div class="flex justify-end">
          <a href="/" class="text-md">
            {rightNavigation}
          </a>
        </div>
      </div>
    </div>
  );
}
