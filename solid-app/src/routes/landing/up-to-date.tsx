import { MetaProvider } from "@solidjs/meta";
import { LandingHeader } from "~/components/landing/LandingHeader";
import LandingContent from "~/components/landing/LandingContent";
import { TaskName } from "~/components/landing/TaskName";
import Member from "~/components/landing/Member";

export default function UpToDate() {
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
                width="22"
                height="16"
                viewBox="0 0 22 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21.0594 0.940674C21.6453 1.52661 21.6453 2.47817 21.0594 3.06411L9.05938 15.0641C8.47344 15.65 7.52188 15.65 6.93594 15.0641L0.935944 9.06411C0.350006 8.47817 0.350006 7.52661 0.935944 6.94067C1.52188 6.35474 2.47344 6.35474 3.05938 6.94067L8.00001 11.8766L18.9406 0.940674C19.5266 0.354736 20.4781 0.354736 21.0641 0.940674H21.0594Z"
                  fill="black"
                  fill-opacity="0.25"
                />
              </svg>
              <p class="text-neutral-400 mt-2">You are up to date!</p>
            </div>
          </div>
        </div>

        <p class="text-2xl font-semibold mt-8 ml-4">While you were away...</p>
        <div class="mx-4">
          <div class="mt-4 rounded-xl w-full h-24 bg-gray-200 flex items-center justify-center">
            <div class="flex flex-col items-center justify-center">
              <svg
                width="22"
                height="16"
                viewBox="0 0 22 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21.0594 0.940674C21.6453 1.52661 21.6453 2.47817 21.0594 3.06411L9.05938 15.0641C8.47344 15.65 7.52188 15.65 6.93594 15.0641L0.935944 9.06411C0.350006 8.47817 0.350006 7.52661 0.935944 6.94067C1.52188 6.35474 2.47344 6.35474 3.05938 6.94067L8.00001 11.8766L18.9406 0.940674C19.5266 0.354736 20.4781 0.354736 21.0641 0.940674H21.0594Z"
                  fill="black"
                  fill-opacity="0.25"
                />
              </svg>
              <p class="text-neutral-400 mt-2">You are all caught up!</p>
            </div>
          </div>
        </div>

        <LandingContent />
      </div>
    </MetaProvider>
  );
}

// export default Index;
