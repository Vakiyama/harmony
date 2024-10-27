import { Image, ImageFallback, ImageRoot } from "~/components/ui/image";

export default function Member() {
  return (
    <div class="flex flex-row gap-x-2 items-center mb-4">
      <div>
        <ImageRoot class="flex items-center justify-center h-12 w-12 bg-black-300 rounded-full overflow-hidden">
          <Image
            src=""
            alt="hngngn"
            class="object-cover w-full h-full rounded-full bg-black-300"
          />
          <ImageFallback class="flex items-center justify-center w-full h-full bg-gray-200 rounded-full">
            HN
          </ImageFallback>
        </ImageRoot>
      </div>
      <div>
        <p class="text-sm font-semibold">Tina Duong</p>
        <p class="text-xs text-neutral-400">Granddaughter</p>
      </div>
    </div>
  );
}
