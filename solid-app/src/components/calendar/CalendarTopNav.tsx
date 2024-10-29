import { A } from "@solidjs/router";
import { JSX } from "solid-js";

interface CalendarTopNavProps {
  month?: JSX.Element;
  navigation?: JSX.Element;
  searchIcon?: JSX.Element;
  createIcon?: JSX.Element;
  burgerMenu?: JSX.Element;
}

export default function CalendarTopNav({
  month,
  navigation,
  searchIcon,
  createIcon,
  burgerMenu,
}: CalendarTopNavProps) {
  return (
    <div class="w-full flex flex-row h-[95px] bg-white shadow-md">
      <div class="w-full flex flex-row justify-between items-end px-4 mb-4">
        <div class="flex flex-row gap-x-3 items-center justify-center">
          <A href="/" class="text-3xl">
            {month}
          </A>
          <svg
            width="15"
            height="8"
            viewBox="0 0 15 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_1063_4752)">
              <path
                d="M6.88201 6.80685C7.2238 7.14865 7.77888 7.14865 8.12068 6.80685L12.4957 2.43185C12.8375 2.09005 12.8375 1.53497 12.4957 1.19318C12.1539 0.851379 11.5988 0.851379 11.257 1.19318L7.49998 4.95021L3.74294 1.19591C3.40115 0.854114 2.84607 0.854114 2.50427 1.19591C2.16248 1.53771 2.16248 2.09279 2.50427 2.43458L6.87927 6.80958L6.88201 6.80685Z"
                fill="#1E1E1E"
              />
            </g>
            <defs>
              <clipPath id="clip0_1063_4752">
                <rect
                  width="14"
                  height="6.12637"
                  fill="white"
                  transform="translate(0.5 0.936829)"
                />
              </clipPath>
            </defs>
          </svg>
        </div>
        <div class="flex justify-end gap-x-6">
          <A href="/" class="text-md">
            {searchIcon}
          </A>
          <A href="/" class="text-md">
            {createIcon}
          </A>
          <A href="/" class="text-md">
            {burgerMenu}
          </A>
        </div>
      </div>
    </div>
  );
}
