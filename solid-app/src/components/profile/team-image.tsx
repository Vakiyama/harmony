import {
  Image,
  ImageFallback,
  ImageRoot,
} from "~/components/ui/teams/team-image";
import { createSignal } from "solid-js";

export default function TeamImage(props: {
  teamName: string;
  imageUrl: string;
}) {
  const [imageError, setImageError] = createSignal(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <>
      <div class="max-h-[161px] w-full">
        <ImageRoot class="items-center justify-center h-full w-full object-cover ">
          {!imageError ? (
            <Image
              src={props.imageUrl}
              alt={props.teamName}
              class="rounded-t-md"
              onError={handleImageError}
            />
          ) : (
            <ImageFallback class="h-full w-[185.2px] font-semi items-center justify-center bg-primary-purple-150">
              {""}
            </ImageFallback>
          )}
        </ImageRoot>
      </div>
    </>
  );
}
