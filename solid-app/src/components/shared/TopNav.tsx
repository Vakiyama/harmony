import { JSX } from "solid-js";
import { A, useLocation, useParams } from "@solidjs/router";
import { twMerge } from "tailwind-merge";

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

  if (location.pathname.includes("/profile/")) {
    backLocation = "/profile";
  }

  return (
    <div
      class={twMerge(
        "w-full flex flex-row min-h-[95px] bg-white fixed top-0 items-center",
        props.class ? props.class : ""
      )}
    >
      <div class="w-full flex flex-row px-4 h-full items-center">
        {/* Left column */}
        <div class="flex-1">
          {backLocation && props.leftNavigation ? (
            <A href={backLocation} class="flex items-center">
              {props.leftNavigation}
            </A>
          ) : null}
        </div>

        {/* Center column */}
        <div class="flex-grow flex justify-center items-center">
          {props.name ? (
            <h4 class="text-h4 font-medium">{props.name}</h4>
          ) : null}
        </div>

        {/* Right column */}
        <div class="flex-1 flex justify-end">
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
