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
  setIsCalendarOpen: Setter<boolean>;
  isCalendarOpen: Accessor<boolean>;
  teamId: number;
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
    <div class="absolute top-0 w-full flex flex-row h-[110px] bg-white z-[1]">
      {/* Left section: Month and dropdown */}
      <div class="w-full flex flex-row justify-between items-end px-4 mb-4 h-full">
        <div
          class="flex flex-row gap-x-3 items-center justify-center pb-[9px] cursor-pointer"
          onclick={() => props.setIsCalendarOpen(!props.isCalendarOpen())}
        >
          <button class="text-3xl">{props.month()}</button>
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

        {/* Right section: Icons */}
        <div class="flex flex-row items-center justify-center py-2 gap-x-6 pb-[9px]">
          <button
            class="w-[22px] h-[22px] border-2 rounded-sm border-black flex flex-col align-center justify-center"
            onClick={handleReturnToToday}
          >
            <p class="text-subtitle13 w-full font-grotesque">
              {moment().date()}
            </p>
          </button>
          <button
            class="text-md"
            onclick={() => props.setIsSideMenuOpen(!props.isSideMenuOpen())}
          >
            {/* Hamburger menu icon */}
            <svg
              width="22"
              height="18"
              viewBox="0 0 22 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.833374 1.37499C0.833374 1.03794 0.967265 0.714702 1.20559 0.476375C1.44392 0.238048 1.76716 0.104156 2.10421 0.104156H19.8959C20.2329 0.104156 20.5562 0.238048 20.7945 0.476375C21.0328 0.714702 21.1667 1.03794 21.1667 1.37499C21.1667 1.71204 21.0328 2.03528 20.7945 2.2736C20.5562 2.51193 20.2329 2.64582 19.8959 2.64582H2.10421C1.76716 2.64582 1.44392 2.51193 1.20559 2.2736C0.967265 2.03528 0.833374 1.71204 0.833374 1.37499ZM0.833374 16.625C0.833374 16.2879 0.967265 15.9647 1.20559 15.7264C1.44392 15.4881 1.76716 15.3542 2.10421 15.3542H19.8959C20.2329 15.3542 20.5562 15.4881 20.7945 15.7264C21.0328 15.9647 21.1667 16.2879 21.1667 16.625C21.1667 16.962 21.0328 17.2853 20.7945 17.5236C20.5562 17.7619 20.2329 17.8958 19.8959 17.8958H2.10421C1.76716 17.8958 1.44392 17.7619 1.20559 17.5236C0.967265 17.2853 0.833374 16.962 0.833374 16.625ZM0.833374 9C0.833374 8.66295 0.967265 8.33972 1.20559 8.10139C1.44392 7.86306 1.76716 7.72917 2.10421 7.72917H19.8959C20.2329 7.72917 20.5562 7.86306 20.7945 8.10139C21.0328 8.33972 21.1667 8.66295 21.1667 9C21.1667 9.33705 21.0328 9.66028 20.7945 9.89861C20.5562 10.1369 20.2329 10.2708 19.8959 10.2708H2.10421C1.76716 10.2708 1.44392 10.1369 1.20559 9.89861C0.967265 9.66028 0.833374 9.33705 0.833374 9Z"
                fill="#1E1E1E"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
