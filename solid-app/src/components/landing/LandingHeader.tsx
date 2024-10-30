import { Title } from "@solidjs/meta";
import { BiSolidBell } from "solid-icons/bi";
import { FaSolidAngleDown } from "solid-icons/fa";

export function LandingHeader() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    // year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div class="flex justify-between items-center p-4 bg-white shadow-md top-0 sticky">
      <Title class="text-3xl">Lola's Care Circle</Title>

      <div class="flex items-center">
        <div class="flex flex-col">
          <h1 class="text-2xl font-semibold mr-2">Lola's Care Circle</h1>

          <p class="text-sm text-gray-500">{currentDate}</p>
        </div>
        <div class="p-2">
          <FaSolidAngleDown class="text-gray-600" size={20} />
        </div>
      </div>

      <div class="flex flex-col items-end">
        <BiSolidBell class="text-black-600 text-xl mb-2" size={27} />
      </div>
    </div>
  );
}
