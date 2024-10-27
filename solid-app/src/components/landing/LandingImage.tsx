import { Image, ImageFallback, ImageRoot } from "~/components/ui/image";

const LandingImage = () => {
  return (
    <ImageRoot class="flex items-center justify-center h-36 w-48 bg-blue-300 rounded-lg border overflow-hidden">
      <Image
        src="https://res.cloudinary.com/daobc6dfz/image/upload/v1729999438/06210700462_1200x1200_vspw2e.webp"
        alt="hngngn"
        class="object-fill w-full"
      />
      <ImageFallback class="flex items-center justify-center w-full h-full bg-gray-200 rounded-full">
        HN
      </ImageFallback>
    </ImageRoot>
  );
};

export default LandingImage;
