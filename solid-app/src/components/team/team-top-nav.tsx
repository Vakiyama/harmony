import { Component, JSXElement } from "solid-js";

export default function TeamTopNav(props: {
  backNavigation: () => void;
  cancelNavigation: JSXElement;
}) {
  return (
    <div class="w-full flex flex-row h-[95px] bg-white shadow-md">
      <div class="w-full flex flex-row justify-between items-end px-4 mb-4">
        <div class="flex items-center">
          <a onClick={props.backNavigation}>Back</a>
        </div>

        <div class="flex justify-end">
          <button type="button" class="text-md">
            {props.cancelNavigation}
          </button>
        </div>
      </div>
    </div>
  );
}
