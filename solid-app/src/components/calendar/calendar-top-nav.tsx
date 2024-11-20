import { A } from "@solidjs/router";
import moment from "moment";
import { Accessor, Setter } from "solid-js";

export default function CalendarTopNav(props: {
  month: Accessor<string>;
  setIsSideMenuOpen: Setter<boolean>;
  isSideMenuOpen: Accessor<boolean>;
  setCurrentDay: Setter<number>;
  setCurrentMonth: Setter<string>;
  setCurrentYear: Setter<number>;
  setSelectedDay: Setter<number>;
  setSelectedMonth: Setter<string>;
  setSelectedYear: Setter<number>;
}) {
  const handleReturnToToday = () => {
    props.setCurrentDay(moment().date());
    props.setCurrentMonth(moment().format("MMMM"));
    props.setCurrentYear(moment().year());

    props.setSelectedDay(moment().date());
    props.setSelectedMonth(moment().format("MMMM"));
    props.setSelectedYear(moment().year());
  };
  return (
    <div class="fixed top-0 w-full flex flex-row h-[84px] bg-white shadow-md">
      <div class="w-full flex flex-row justify-between items-center px-4 mb-4 h-full">
        <div class="flex flex-row gap-x-3 items-center justify-center">
          <A href="/" class="text-3xl">
            {props.month()}
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
          <button
            class="w-5 h-5 border-2 rounded-sm border-black flex flex-col align-center justify-center"
            onClick={handleReturnToToday}
          >
            <p class="text-subtitle13 w-full font-grotesque">
              {moment().date()}
            </p>
          </button>
          <A href="/" class="text-md">
            {/* search icon */}
            <svg
              width="21"
              height="22"
              viewBox="0 0 21 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20.5493 19.0757L15.9551 14.4814C17.0612 13.009 17.6583 11.2166 17.6563 9.375C17.6563 4.6709 13.8291 0.84375 9.125 0.84375C4.4209 0.84375 0.59375 4.6709 0.59375 9.375C0.59375 14.0791 4.4209 17.9063 9.125 17.9063C10.9666 17.9083 12.759 17.3112 14.2314 16.2051L18.8257 20.7993C19.0582 21.0072 19.3616 21.1182 19.6734 21.1095C19.9852 21.1007 20.2818 20.973 20.5024 20.7524C20.723 20.5318 20.8507 20.2352 20.8595 19.9234C20.8682 19.6116 20.7572 19.3082 20.5493 19.0757ZM3.03125 9.375C3.03125 8.16977 3.38864 6.99161 4.05823 5.98949C4.72782 4.98738 5.67954 4.20633 6.79302 3.74511C7.90651 3.28389 9.13176 3.16321 10.3138 3.39834C11.4959 3.63347 12.5817 4.21384 13.4339 5.06607C14.2862 5.91829 14.8665 7.0041 15.1017 8.18617C15.3368 9.36824 15.2161 10.5935 14.7549 11.707C14.2937 12.8205 13.5126 13.7722 12.5105 14.4418C11.5084 15.1114 10.3302 15.4688 9.125 15.4688C7.50943 15.4668 5.96059 14.8242 4.81821 13.6818C3.67583 12.5394 3.03319 10.9906 3.03125 9.375Z"
                fill="#1E1E1E"
              />
            </svg>
          </A>
          <A href="/calendar/create" class="text-md">
            {/* create icon */}
            <svg
              width="21"
              height="20"
              viewBox="0 0 21 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.8906 1.66406C11.8906 0.825732 11.2133 0.148438 10.375 0.148438C9.53667 0.148438 8.85938 0.825732 8.85938 1.66406V8.48438H2.03906C1.20073 8.48438 0.523438 9.16167 0.523438 10C0.523438 10.8383 1.20073 11.5156 2.03906 11.5156H8.85938V18.3359C8.85938 19.1743 9.53667 19.8516 10.375 19.8516C11.2133 19.8516 11.8906 19.1743 11.8906 18.3359V11.5156H18.7109C19.5493 11.5156 20.2266 10.8383 20.2266 10C20.2266 9.16167 19.5493 8.48438 18.7109 8.48438H11.8906V1.66406Z"
                fill="#1E1E1E"
              />
            </svg>
          </A>
          <button
            class="text-md"
            onclick={() => props.setIsSideMenuOpen(!props.isSideMenuOpen())}
          >
            {/* hamburger menu icon */}
            <svg
              width="22"
              height="18"
              viewBox="0 0 22 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.833374 1.37499C0.833374 1.03794 0.967265 0.714702 1.20559 0.476375C1.44392 0.238048 1.76716 0.104156 2.10421 0.104156H19.8959C20.2329 0.104156 20.5562 0.238048 20.7945 0.476375C21.0328 0.714702 21.1667 1.03794 21.1667 1.37499C21.1667 1.71204 21.0328 2.03528 20.7945 2.2736C20.5562 2.51193 20.2329 2.64582 19.8959 2.64582H2.10421C1.76716 2.64582 1.44392 2.51193 1.20559 2.2736C0.967265 2.03528 0.833374 1.71204 0.833374 1.37499ZM0.833374 16.625C0.833374 16.2879 0.967265 15.9647 1.20559 15.7264C1.44392 15.488 1.76716 15.3542 2.10421 15.3542H19.8959C20.2329 15.3542 20.5562 15.488 20.7945 15.7264C21.0328 15.9647 21.1667 16.2879 21.1667 16.625C21.1667 16.962 21.0328 17.2853 20.7945 17.5236C20.5562 17.7619 20.2329 17.8958 19.8959 17.8958H2.10421C1.76716 17.8958 1.44392 17.7619 1.20559 17.5236C0.967265 17.2853 0.833374 16.962 0.833374 16.625ZM9.7292 7.72915C9.39216 7.72915 9.06892 7.86305 8.83059 8.10137C8.59226 8.3397 8.45837 8.66294 8.45837 8.99999C8.45837 9.33703 8.59226 9.66027 8.83059 9.8986C9.06892 10.1369 9.39216 10.2708 9.7292 10.2708H19.8959C20.2329 10.2708 20.5562 10.1369 20.7945 9.8986C21.0328 9.66027 21.1667 9.33703 21.1667 8.99999C21.1667 8.66294 21.0328 8.3397 20.7945 8.10137C20.5562 7.86305 20.2329 7.72915 19.8959 7.72915H9.7292Z"
                fill="#1E1E1E"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
