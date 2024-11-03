import { A } from "@solidjs/router";
import TextFieldLine from "~/components/shared/text-field-line";
import TeamTopNav from "~/components/team/team-top-nav";
import { Button } from "~/components/ui/button";

export default function UploadPhoto(props: { recipientName: string }) {
  return (
    <>
      <TeamTopNav backNavigation="/" cancelNavigation="/" />

      <div class="relative flex flex-col min-h-screen mx-2">
        <div class="flex items-center justify-center mt-2">
          <p class="text-xs text-gray-400">3 of 8</p>
        </div>
        {/* upload photo part */}
        <div class="px-2 mt-6 flex flex-col flex-grow">
          <p class="text-[30px] font-semi">
            Upload a photo of "User" {props.recipientName}
          </p>
          <p class="text-xs text-gray-400">
            Choose your team's cover photo to identify your team and make it
            recognizable
          </p>

          {/* Add photo here */}
          <div class="border-[1px] w-full h-[310px] rounded-lg mt-6 grid grid-rows-5">
            <div></div>
            <div></div>
            <label
              for="photo-upload"
              class="flex flex-col items-center justify-center"
            >
              <svg
                width="16"
                height="14"
                viewBox="0 0 16 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="mb-2"
              >
                <path
                  d="M0.00201416 2C0.00201416 1.46957 0.212728 0.960859 0.587801 0.585786C0.962873 0.210714 1.47158 0 2.00201 0H14.002C14.5324 0 15.0412 0.210714 15.4162 0.585786C15.7913 0.960859 16.002 1.46957 16.002 2V12C16.002 12.5304 15.7913 13.0391 15.4162 13.4142C15.0412 13.7893 14.5324 14 14.002 14H2.00201C1.47158 14 0.962873 13.7893 0.587801 13.4142C0.212728 13.0391 0.00201416 12.5304 0.00201416 12V2ZM1.00201 11V12C1.00201 12.2652 1.10737 12.5196 1.29491 12.7071C1.48244 12.8946 1.7368 13 2.00201 13H14.002C14.2672 13 14.5216 12.8946 14.7091 12.7071C14.8967 12.5196 15.002 12.2652 15.002 12V8.5L11.225 6.553C11.1312 6.50602 11.0251 6.48973 10.9215 6.50642C10.818 6.52311 10.7223 6.57194 10.648 6.646L6.93801 10.356L4.27801 8.584C4.18197 8.52006 4.06678 8.4913 3.95195 8.5026C3.83713 8.5139 3.72975 8.56456 3.64801 8.646L1.00201 11ZM6.00201 4.5C6.00201 4.10218 5.84398 3.72064 5.56267 3.43934C5.28137 3.15804 4.89984 3 4.50201 3C4.10419 3 3.72266 3.15804 3.44135 3.43934C3.16005 3.72064 3.00201 4.10218 3.00201 4.5C3.00201 4.89782 3.16005 5.27936 3.44135 5.56066C3.72266 5.84196 4.10419 6 4.50201 6C4.89984 6 5.28137 5.84196 5.56267 5.56066C5.84398 5.27936 6.00201 4.89782 6.00201 4.5Z"
                  fill="#5A5A5A"
                />
              </svg>
              <p class="text-xs text-gray-400">Tab to add a photo</p>
            </label>
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              class="hidden"
            />
            <div></div>
          </div>

          {/* space */}
          <div class="flex-grow"></div>

          <div class="flex flex-col items-center justify-center">
            <Button class="rounded-full w-full mt-4 bg-[#AE9BF2] text-black h-[50px]">
              Next
            </Button>
            <A href="/" class="text-xs p-2">
              skip for now
            </A>
          </div>
        </div>
        {/* Space for bottom */}
        <div class="h-[102px]"></div> {/* temporary */}
      </div>
    </>
  );
}
