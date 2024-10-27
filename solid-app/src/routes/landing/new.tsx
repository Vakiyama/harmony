import { MetaProvider } from "@solidjs/meta";
import { LandingHeader } from "~/components/landing/LandingHeader";
import LandingContent from "~/components/landing/LandingContent";
import { TaskName } from "~/components/landing/TaskName";
import Member from "~/components/landing/Member";
import UpdateLandingContent from "~/components/landing/UpdateLandingContent";

export default function New() {
  return (
    <MetaProvider>
      <div class="mt-4">
        <LandingHeader />
        <div class="flex flex-row items-center justify-between">
          <h1 class="mt-8 ml-4 text-2xl">Coming up</h1>
          <p class="mt-8 mr-4 text-neutral-600">see all</p>
        </div>
        <div class="mx-4">
          <div class="mt-4 rounded-xl w-full h-36 bg-gray-200 flex items-center justify-center">
            <div class="flex flex-col items-center justify-center">
              <svg
                width="18"
                height="21"
                viewBox="0 0 18 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.85714 1.27059V2.54118H1.92857C0.863839 2.54118 0 3.39485 0 4.44706V6.35294H18V4.44706C18 3.39485 17.1362 2.54118 16.0714 2.54118H14.1429V1.27059C14.1429 0.567794 13.5683 0 12.8571 0C12.146 0 11.5714 0.567794 11.5714 1.27059V2.54118H6.42857V1.27059C6.42857 0.567794 5.85402 0 5.14286 0C4.4317 0 3.85714 0.567794 3.85714 1.27059ZM18 7.62353H0V18.4235C0 19.4757 0.863839 20.3294 1.92857 20.3294H16.0714C17.1362 20.3294 18 19.4757 18 18.4235V7.62353Z"
                  fill="#6D6D6D"
                  fill-opacity="0.5"
                />
              </svg>

              <p class="text-neutral-400 mt-2">
                upcoming events will show here
              </p>
            </div>
          </div>
        </div>

        <p class="text-2xl font-semibold mt-8 ml-4">While you were away...</p>

        <UpdateLandingContent />
      </div>
    </MetaProvider>
  );
}

// export default Index;
