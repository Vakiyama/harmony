import { Image, ImageFallback, ImageRoot } from "~/components/ui/image";
export default function MedicationImage(props: { pharmacyImg: string | "" }) {
  return (
    <ImageRoot class="flex items-center justify-center h-[234px] w-full bg-gray-200  rounded-lg border overflow-hidden">
      <Image
        src={props.pharmacyImg}
        alt="hngngn"
        class="object-contain w-full h-full"
      />
      <ImageFallback class="flex items-center justify-center w-full h-full bg-gray-200 rounded-lg">
        Not available
      </ImageFallback>
    </ImageRoot>
  );
}
