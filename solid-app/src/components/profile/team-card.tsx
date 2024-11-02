import { A } from "@solidjs/router";
import { Image, ImageRoot } from "../ui/image";
import TeamImage from "./team-image";

export default function TeamCard(props: {
  teamName: string;
  imageUrl: string;
  href: string;
}) {
  return (
    <>
      <div class="flex flex-col items-center border-2 border-gray-300 rounded-md w-[177px] h-[150px]">
        <div class="">
          <TeamImage teamName="Lola's Care Team" imageUrl={props.imageUrl} />
        </div>

        <A href={props.href} class="text-md w-full mt-2 ml-4">
          <div>{props.teamName}</div>
        </A>
      </div>
    </>
  );
}
