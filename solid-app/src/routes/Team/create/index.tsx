import { A } from "@solidjs/router";
import { onCleanup, onMount, useContext } from "solid-js";
import TopNav from "~/components/shared/TopNav";
import { BottomNavContext } from "~/context/bottom-nav-provider";

export default function CreateTeam() {
  // const { setShowBottomNav } = useContext(BottomNavContext);

  // onMount(() => {
  //   setShowBottomNav(false);
  // });

  // onCleanup(() => {
  //   setShowBottomNav(true);
  // });
  return (
    <div class="relative flex flex-col min-h-screen">
      {/* Header */}
      <div class="w-full flex flex-row h-[95px] bg-white shadow-md">
        <div class="w-full flex flex-row justify-between items-end px-4 mb-4">
          <div class="flex items-center">
            <a href="/">Back</a>
          </div>
          <div class="flex-1 flex justify-center">
            <h4 class="text-md"></h4>
          </div>
          <div class="flex justify-end">
            <a href="/" class="text-md">
              Cancel
            </a>
          </div>
        </div>
      </div>
      <div class="flex items-center justify-center">
        <p class="mt-3 text-xs text-gray-500 items-center">1 or 8</p>
      </div>
      {/* Space */}
      <div class="flex-grow"></div>

      {/* pick person to care */}
      <div class="px-2">
        <p class="text-[23px] font-semi">Who is receiving care?</p>
        <div class="relative items-center">
          <div class="flex h-[70px] bg-[#E4DEFB] rounded-[15px] mt-3 relative items-center">
            <p class="pl-[20px] font-semi text-md justify-start">Me</p>
            <A
              href="/team/create/me"
              class="absolute right-4 top-1/2 transform -translate-y-1/2"
            >
              <svg
                width="12"
                height="20"
                viewBox="0 0 12 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.291 8.89624C11.9014 9.50659 11.9014 10.4978 11.291 11.1082L3.47852 18.9207C2.86816 19.531 1.87695 19.531 1.2666 18.9207C0.65625 18.3103 0.65625 17.3191 1.2666 16.7087L7.97559 9.99975L1.27148 3.29077C0.661133 2.68042 0.661133 1.68921 1.27148 1.07886C1.88184 0.468506 2.87305 0.468506 3.4834 1.07886L11.2959 8.89136L11.291 8.89624Z"
                  fill="#7859EA"
                />
              </svg>
            </A>
          </div>
        </div>

        <div class="relative items-center">
          <div class="flex h-[70px] bg-[#E4DEFB] rounded-[15px] mt-3 relative items-center">
            <p class="pl-[20px] font-semi text-md">Someone Else</p>
            <A
              href="/team/create/someone"
              class="absolute right-4 top-1/2 transform -translate-y-1/2"
            >
              <svg
                width="12"
                height="20"
                viewBox="0 0 12 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.291 8.89624C11.9014 9.50659 11.9014 10.4978 11.291 11.1082L3.47852 18.9207C2.86816 19.531 1.87695 19.531 1.2666 18.9207C0.65625 18.3103 0.65625 17.3191 1.2666 16.7087L7.97559 9.99975L1.27148 3.29077C0.661133 2.68042 0.661133 1.68921 1.27148 1.07886C1.88184 0.468506 2.87305 0.468506 3.4834 1.07886L11.2959 8.89136L11.291 8.89624Z"
                  fill="#7859EA"
                />
              </svg>
            </A>
          </div>
        </div>
      </div>

      {/* Space for bottom */}
      <div class="h-[32px]"></div>
    </div>
  );
}
