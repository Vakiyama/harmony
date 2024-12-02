import { A } from "@solidjs/router";
import { Image, ImageRoot } from "../ui/image";
import TeamImage from "./team-image";

export default function TeamCard(props: {
  teamName: string;
  imageUrl: string;
  href: string;
}) {
  return (
    <A
      href={props.href}
      class="flex flex-col items-center border border-gray-300 rounded-md min-w-[177px] min-h-[196px] w-full h-full"
    >
      <div class="flex flex-grow">
        <TeamImage teamName={props.teamName} imageUrl={props.imageUrl} />
      </div>

      <div class="flex items-center justify-center text-base font-medium w-full h-[35px] overflow-hidden">
        {props.teamName}
      </div>
    </A>
  );
}
