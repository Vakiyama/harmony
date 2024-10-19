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
      <div class="">
        <ImageRoot class="items-center justify-center w-[175px] h-[90px] bg-neutral-300 overflow-hidden">
          <Image src={props.imageUrl} alt={props.teamName} class="" />
          <ImageFallback class="font-semi items-center justify-center bg-gray-200"></ImageFallback>
        </ImageRoot>
      </div>
    </>
  );
}
