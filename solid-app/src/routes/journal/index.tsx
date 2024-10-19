import { getUser } from "~/api";

const user = await getUser();

export default function Journal() {
  return (
    <main class="absolute top-[3rem] w-full h-[calc(100%-3rem)] p-4 flex items-center justify-center space-y-2 overflow-hidden">
      <div class="mt-8 mb-8 flex flex-col w-full text-start">
        <h1 class="text-[28px] min-w-full mb-[20px]">
          New Journal Entry
          <span class="block text-[19px]">for {user.displayName}</span>
        </h1>
        <p class="text-base mb-[16px] min-w-full">
          Description of what adding a log does
        </p>
        <div class="flex flex-col gap-2 mt-2">
          <div class="flex flex-row justify-between items-center bg-gray-300 rounded-[15px] p-[22px]">
            <div>
              <a href="/journal/medications" class="hover:text-blue-500">
                Medication
              </a>
              <p class="text-[11px]">Description</p>
            </div>
            <svg
              width="26"
              height="26"
              viewBox="0 0 26 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13 0C5.824 0 0 5.824 0 13C0 20.176 5.824 26 13 26C20.176 26 26 20.176 26 13C26 5.824 20.176 0 13 0ZM19.5 14.3H14.3V19.5H11.7V14.3H6.5V11.7H11.7V6.5H14.3V11.7H19.5V14.3Z"
                fill="white"
              />
            </svg>
          </div>
          <div class="flex flex-row justify-between items-center bg-gray-300 rounded-[15px] p-[22px]">
            <div>
              <a href="/journal/mood-tracker" class="hover:text-blue-500">
                Mood
              </a>
              <p class="text-[11px]">Description</p>
            </div>
            <svg
              width="26"
              height="26"
              viewBox="0 0 26 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13 0C5.824 0 0 5.824 0 13C0 20.176 5.824 26 13 26C20.176 26 26 20.176 26 13C26 5.824 20.176 0 13 0ZM19.5 14.3H14.3V19.5H11.7V14.3H6.5V11.7H11.7V6.5H14.3V11.7H19.5V14.3Z"
                fill="white"
              />
            </svg>
          </div>
          <div class="flex flex-row justify-between items-center bg-gray-300 rounded-[15px] p-[22px]">
            <div>
              <a href="/journal/nutrition-tracker" class="hover:text-blue-500">
                Nutrition
              </a>
              <p class="text-[11px]">Description</p>
            </div>
            <svg
              width="26"
              height="26"
              viewBox="0 0 26 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13 0C5.824 0 0 5.824 0 13C0 20.176 5.824 26 13 26C20.176 26 26 20.176 26 13C26 5.824 20.176 0 13 0ZM19.5 14.3H14.3V19.5H11.7V14.3H6.5V11.7H11.7V6.5H14.3V11.7H19.5V14.3Z"
                fill="white"
              />
            </svg>
          </div>
          <div class="flex flex-row justify-between items-center bg-gray-300 rounded-[15px] p-[22px]">
            <div>
              <a href="/journal/sleep-tracker" class="hover:text-blue-500">
                Sleep
              </a>
              <p class="text-[11px]">Description</p>
            </div>
            <svg
              width="26"
              height="26"
              viewBox="0 0 26 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13 0C5.824 0 0 5.824 0 13C0 20.176 5.824 26 13 26C20.176 26 26 20.176 26 13C26 5.824 20.176 0 13 0ZM19.5 14.3H14.3V19.5H11.7V14.3H6.5V11.7H11.7V6.5H14.3V11.7H19.5V14.3Z"
                fill="white"
              />
            </svg>
          </div>
          <div class="flex flex-row justify-between items-center bg-gray-300 rounded-[15px] p-[22px]">
            <div>
              <a href="/journal/notes" class="hover:text-blue-500">
                Note
              </a>
              <p class="text-[11px]">Description</p>
            </div>
            <svg
              width="26"
              height="26"
              viewBox="0 0 26 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13 0C5.824 0 0 5.824 0 13C0 20.176 5.824 26 13 26C20.176 26 26 20.176 26 13C26 5.824 20.176 0 13 0ZM19.5 14.3H14.3V19.5H11.7V14.3H6.5V11.7H11.7V6.5H14.3V11.7H19.5V14.3Z"
                fill="white"
              />
            </svg>
          </div>
        </div>
      </div>
    </main>
  );
}
