import { Component, JSXElement } from "solid-js";
import { Button } from "~/components/ui/button";

export default function TeamTopNav(props: {
  leftNavigation: () => void;
  rightText: string | JSXElement;
  rightAction?: (event?: MouseEvent) => Promise<void> | undefined;
  isCreating: boolean;
}) {
  return (
    <div class="w-full flex flex-row h-[104px] bg-white shadow-md fixed top-0 z-50">
      <div class="w-full flex flex-row justify-between items-end px-4 mb-4">
        <div class="flex items-center">
          <button
            onClick={props.leftNavigation}
            class="text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </div>

        <div class="flex items-center gap-2">
          {typeof props.rightText === "string" ? (
            props.rightAction ? (
              <button
                onClick={props.rightAction}
                disabled={props.isCreating}
                // class="bg-[#AE9BF2] text-black hover:bg-[#9B85F0] disabled:bg-gray-300 disabled:cursor-not-allowed rounded-full px-6 py-2 transition-colors"
              >
                {props.isCreating ? (
                  <div class="flex items-center gap-2">
                    <svg
                      class="animate-spin h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                      ></circle>
                      <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating...
                  </div>
                ) : (
                  props.rightText
                )}
              </button>
            ) : (
              <span class="text-gray-600">{props.rightText}</span>
            )
          ) : (
            <div class="text-gray-600 hover:text-gray-800 cursor-pointer">
              {props.rightText}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
