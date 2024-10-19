import { Image, ImageRoot } from "../ui/image";
import TeamImage from "./TeamImage";

export default function TeamCard(props: {
  teamName: string;
  imageUrl: string;
}) {
  return (
    <>
      <div class="flex flex-col items-center border-2 border-gray-300 rounded-2xl w-[175px] h-[130px]">
        <div class="">
          <TeamImage teamName="Lola's Care Team" imageUrl="" />
        </div>

        <div class="text-md w-full mt-2 ml-4">{props.teamName}</div>
      </div>
    </>
  );
}
