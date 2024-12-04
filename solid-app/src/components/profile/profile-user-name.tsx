import { Show } from "solid-js";
import { Image, ImageFallback, ImageRoot } from "../ui/image";
export default function ProfileUserName(props: {
  photoUrl?: string | null;
  firstName?: string;
  lastName?: string;
  inviteCode?: string | null;
}) {
  return (
    <div class="w-full flex flex-row items-center gap-3">
      {/* Avatar */}
      <div class="flex items-start space-x-2">
        <ImageRoot class="flex items-center justify-center h-[83px] w-[83px] rounded-full overflow-hidden">
          <Image
            src={props.photoUrl ? props.photoUrl : ""}
            alt={`${props?.firstName} ${props?.lastName}`}
            class="object-cover w-full h-full rounded-full"
          />
          <ImageFallback class="flex items-center justify-center w-full h-full rounded-full">{`${
            props.firstName ? props.firstName[0] : ""
          } ${props.lastName ? props.lastName[0] : ""}`}</ImageFallback>
        </ImageRoot>
      </div>

      {/* Username and description */}
      <div class="flex flex-row justify-between w-full items-baseline">
        <div class="h-full text-h2 font-medium">{`${props?.firstName} ${props?.lastName}`}</div>
        <Show when={props.inviteCode}>
          <p class="h-full text-h4 font-medium">
            Invite Code - {props.inviteCode}
          </p>
        </Show>
      </div>
    </div>
  );
}
