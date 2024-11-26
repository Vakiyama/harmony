import { JSX } from "solid-js";
import { A, useLocation, useParams } from "@solidjs/router";
import { twMerge } from "tailwind-merge";
import ChevronLeft from "../icon/chevron-left";
import { FaSolidAngleDown } from "solid-icons/fa";

export default function TopNav(props: {
  name?: JSX.Element;
  leftNavigation?: JSX.Element;
  rightNavigation?: JSX.Element;
  class?: string;
}) {
  const location = useLocation();
  const params = useParams();

  let backLocation;

  if (location.pathname.startsWith(`/team/${params.id}/journal`)) {
    backLocation = `/team/${params.id}/journal`;
  }

  if (location.pathname.includes("/harmony-ai/chat")) {
    backLocation = "/";
  }

  if (location.pathname.includes("/harmony-ai/voice")) {
    backLocation = "/harmony-ai/chat";
  }

  if (
    location.pathname.includes("/profile/") ||
    location.pathname.endsWith(`/team/${params.id}`)
  ) {
    backLocation = "/profile";
  }

  if (location.pathname.startsWith(`/team/${params.id}/calendar/create`)) {
    backLocation = `/team/${params.id}/calendar`;
  }

  return (
    <div
      class={twMerge(
        "w-full flex flex-row min-h-[95px] bg-white fixed top-0 items-center",
        props.class ? props.class : ""
      )}
    >
      <div class="w-full flex flex-row px-2 h-full items-center">
        {/* Left column */}
        <div class="flex-1 flex items-center">
          {backLocation && props.leftNavigation ? (
            <A href={backLocation} class="flex items-center">
              <div class="flex justify-center items-center gap-1">
                <ChevronLeft />
                <p class="text-h4">{props.leftNavigation}</p>
              </div>
            </A>
          ) : null}
        </div>

        {/* Center column */}
        <div class="flex-1 flex items-center">
          {location.pathname.startsWith(`/team/${params.id}/journal`) ? (
            <div class="flex flex-row items-center">
              <h1 class="text-h4 font-medium flex items-center">
                <span class="truncate overflow-hidden max-w-[120px]">
                  {props.name}
                </span>
                <span class="whitespace-nowrap">'s Care Team</span>
              </h1>
              <FaSolidAngleDown class="ml-2 flex-shrink-0" />
            </div>
          ) : props.name ? (
            <h4 class="text-h4 font-medium">{props.name}</h4>
          ) : null}
        </div>

        {/* Right column */}
        <div class="flex-1 flex justify-end items-center">
          {props.rightNavigation ? (
            <A href="/" class="text-md">
              {props.rightNavigation}
            </A>
          ) : null}
        </div>
      </div>
    </div>
  );
}
