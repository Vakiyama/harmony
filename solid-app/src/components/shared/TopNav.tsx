import { JSX, Show } from "solid-js";
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
  console.log(backLocation);

  if (location.pathname.includes("/harmony-ai/voice")) {
    backLocation = "/harmony-ai/chat";
  }

  if (location.pathname.includes("/profile/settings")) {
    backLocation = "/profile";
  }

  return (
    <div
      class={twMerge(
        "w-full flex flex-row min-h-[95px] bg-white fixed top-0 items-center",
        props.class ? props.class : ""
      )}
    >
      <Show when={props.name}>
        <div class="flex-1 flex justify-center mx-auto w-screen absolute h-full items-center">
          <h4 class="text-md">{props.name}</h4>
        </div>
      </Show>
      <div class="w-full flex flex-row px-4 h-full items-center justify-between">
        <Show when={backLocation && props.leftNavigation}>
          <A href={backLocation!} class="flex items-center">
            {props.leftNavigation}
          </A>
        </Show>
        <Show when={props.rightNavigation}>
          <A href="/" class="text-md">
            {props.rightNavigation}
          </A>
        </Show>
      </div>
    </div>
  );
}
