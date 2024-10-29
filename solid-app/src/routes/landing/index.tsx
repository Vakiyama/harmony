import { MetaProvider } from "@solidjs/meta";
import { LandingHeader } from "~/components/landing/LandingHeader";
import LandingContent from "~/components/landing/LandingContent";
import { TaskName } from "~/components/landing/TaskName";
import Member from "~/components/landing/Member";

export default function Index() {
  return (
    <MetaProvider>
      <div class="mt-4">
        <LandingHeader />
        <div class="flex flex-row items-center justify-between">
          <h1 class="mt-8 ml-4 text-2xl">Coming up</h1>
          <p class="mt-8 mr-4 text-neutral-600">see all</p>
        </div>
        <div>
          {/* 1st Task Name*/}
          <TaskName
            props={{
              taskName: "Task Name",
              taskDescription: "Member",
              icon: (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 1.6875C10.9394 1.6875 12.7994 2.45792 14.1707 3.82928C15.5421 5.20064 16.3125 7.0606 16.3125 9C16.3125 10.9394 15.5421 12.7994 14.1707 14.1707C12.7994 15.5421 10.9394 16.3125 9 16.3125C7.0606 16.3125 5.20064 15.5421 3.82928 14.1707C2.45792 12.7994 1.6875 10.9394 1.6875 9C1.6875 7.0606 2.45792 5.20064 3.82928 3.82928C5.20064 2.45792 7.0606 1.6875 9 1.6875ZM9 18C11.3869 18 13.6761 17.0518 15.364 15.364C17.0518 13.6761 18 11.3869 18 9C18 6.61305 17.0518 4.32387 15.364 2.63604C13.6761 0.948212 11.3869 0 9 0C6.61305 0 4.32387 0.948212 2.63604 2.63604C0.948212 4.32387 0 6.61305 0 9C0 11.3869 0.948212 13.6761 2.63604 15.364C4.32387 17.0518 6.61305 18 9 18ZM12.9727 7.34766C13.3031 7.01719 13.3031 6.48281 12.9727 6.15586C12.6422 5.82891 12.1078 5.82539 11.7809 6.15586L7.87852 10.0582L6.22617 8.40586C5.8957 8.07539 5.36133 8.07539 5.03437 8.40586C4.70742 8.73633 4.70391 9.2707 5.03437 9.59766L7.28437 11.8477C7.61484 12.1781 8.14922 12.1781 8.47617 11.8477L12.9727 7.34766Z"
                    fill="#6FC94F"
                  />
                </svg>
              ),
              colour: "bg-green-50",
            }}
          />

          {/* 2nd Task Name*/}
          <TaskName
            props={{
              taskName: "Medication Name",
              taskDescription: "Info",
              icon: (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M9.49275 2.06774C10.3367 1.22386 11.4814 0.749808 12.6749 0.749878C13.8684 0.749948 15.013 1.22413 15.8569 2.06812C16.7008 2.9121 17.1748 4.05675 17.1747 5.25026C17.1747 6.44376 16.7005 7.58836 15.8565 8.43224L8.4315 15.8572C7.58752 16.7011 6.44287 17.1752 5.24936 17.1751C4.05586 17.175 2.91126 16.7009 2.06738 15.8569C1.22349 15.0129 0.749441 13.8682 0.749512 12.6747C0.749582 11.4812 1.22377 10.3366 2.06775 9.49274L9.49275 2.06774ZM14.7953 7.37099L11.6138 10.5532L7.371 6.31049L10.5533 3.12899C10.8306 2.84527 11.1616 2.6194 11.5268 2.46445C11.8921 2.3095 12.2845 2.22856 12.6813 2.2263C13.0781 2.22405 13.4714 2.30053 13.8384 2.45131C14.2054 2.6021 14.5389 2.8242 14.8195 3.10474C15.1001 3.38529 15.3223 3.71872 15.4731 4.08572C15.624 4.45271 15.7005 4.84599 15.6983 5.24277C15.6961 5.63956 15.6153 6.03197 15.4604 6.39728C15.3055 6.76259 15.0789 7.09355 14.7953 7.37099Z"
                    fill="#FE7258"
                  />
                </svg>
              ),
              startTime: "START TIME",
              colour: "bg-red-50",
            }}
          />
          {/* 3rd Task Name*/}
          <TaskName
            props={{
              taskName: "Event Name",
              taskDescription: "Member",
              icon: (
                <svg
                  width="2"
                  height="40"
                  viewBox="0 0 2 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="2" height="40" rx="1" fill="#7859EA" />
                </svg>
              ),
              startTime: "START TIME",
              endTime: "END TIME",
              colour: "bg-purple-50",
            }}
          />
        </div>

        <p class="text-2xl font-semibold mt-8 ml-4">While you were away...</p>
        <LandingContent />
      </div>
    </MetaProvider>
  );
}

// export default Index;
