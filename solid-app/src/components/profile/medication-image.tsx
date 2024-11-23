import { Image, ImageFallback, ImageRoot } from "~/components/ui/image";
export default function MedicationImage() {
  return (
    <ImageRoot class="flex items-center justify-center h-[234px] w-full bg-blue-300 rounded-lg border">
      <Image
        src="https://res.cloudinary.com/daobc6dfz/image/upload/v1729999438/06210700462_1200x1200_vspw2e.webp"
        alt="hngngn"
        class="object-fill w-full"
      />
      <ImageFallback class="flex items-center justify-center w-full h-full bg-gray-200 rounded-lg">
        TD
      </ImageFallback>
    </ImageRoot>
  );
}
