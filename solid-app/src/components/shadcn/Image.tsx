import { Image, ImageFallback, ImageRoot } from "~/components/ui/image";

const ImageDemo = () => {
  return (
    <ImageRoot class="flex items-center justify-center h-48 w-48 bg-blue-300 rounded-full overflow-hidden">
      <Image
        src=""
        alt="hngngn"
        class="object-cover w-full h-full rounded-full bg-blue-300"
      />
      <ImageFallback class="flex items-center justify-center w-full h-full bg-gray-200 rounded-full">
        HN
      </ImageFallback>
    </ImageRoot>
  );
};

export default ImageDemo;
