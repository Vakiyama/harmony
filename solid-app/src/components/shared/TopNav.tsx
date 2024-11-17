import { JSX } from "solid-js";
import { useLocation, useParams } from "@solidjs/router";
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

  return (
    <div
      class={twMerge(
        "w-full flex flex-row h-[95px] bg-white fixed top-0",
        props.class ? props.class : "",
      )}
    >
      <div class="w-full flex flex-row justify-between items-end px-4 mb-4">
        <div class="flex items-center">
          <a href={backLocation}>{props.leftNavigation}</a>
        </div>
        <div class="flex-1 flex justify-center">
          <h4 class="text-md">{props.name}</h4>
        </div>
        <div class="flex justify-end">
          <a href="/" class="text-md">
            {props.rightNavigation}
          </a>
        </div>
      </div>
    </div>
  );
}
