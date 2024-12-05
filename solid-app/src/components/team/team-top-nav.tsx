import { JSXElement } from "solid-js";

export default function TeamTopNav(props: {
  leftNavigation: () => void;
  rightText: string | JSXElement;
  rightAction?: (event?: MouseEvent) => Promise<void> | undefined;
  isCreating: boolean;
}) {
  return (
    <div class="w-full flex flex-row h-[104px] bg-white fixed top-0">
      <div class="w-full flex flex-row justify-between items-end px-4 mb-4">
        <div class="flex items-center">
          <button
            onClick={props.leftNavigation}
            class="text-gray-600 hover:text-gray-800 transition-colors"
          >
            Back
          </button>
        </div>

        <div class="flex items-center gap-2">
          {typeof props.rightText === "string" ? (
            props.rightAction ? (
              <button onClick={props.rightAction} disabled={props.isCreating}>
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
