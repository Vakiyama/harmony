import {
  Image,
  ImageFallback,
  ImageRoot,
} from "~/components/ui/teams/team-image";
export default function TeamImage(props: {
  teamName: string;
  imageUrl: string;
}) {
  return (
    <>
      <div class="h-[161px] w-full overflow-hidden rounded-t-md">
        <ImageRoot class="items-center justify-center h-full w-full object-cover">
          <Image
            src={props.imageUrl}
            alt={props.teamName}
            class="object-cover w-full h-full"
          />
          <ImageFallback class="font-semi items-center justify-center bg-purple-200"></ImageFallback>
        </ImageRoot>
      </div>
    </>
  );
}
