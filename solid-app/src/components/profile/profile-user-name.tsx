import { Image, ImageFallback, ImageRoot } from "../ui/image";
import { RiSystemSettings4Fill } from "solid-icons/ri";
export default function ProfileUserName(props: {
  photoUrl: string | null | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
}) {
  return (
    <div class="w-full flex flex-row items-center gap-3">
      {/* Avatar */}
      <div class="flex items-start space-x-2">
        <ImageRoot class="flex items-center justify-center h-[83px] w-[83px] bg-gray-300 rounded-full overflow-hidden">
          <Image
            src={props.photoUrl ? props.photoUrl : ""}
            alt={`${props?.firstName} ${props?.lastName}`}
            class="object-cover w-full h-full rounded-full"
          />
          <ImageFallback class="flex items-center justify-center w-full h-full bg-gray-200 rounded-full">{`${
            props.firstName ? props.firstName[0] : ""
          } ${props.lastName ? props.lastName[0] : ""}`}</ImageFallback>
        </ImageRoot>
      </div>

      {/* Username and description */}
      <div class="flex">
        <div class="text-h2 font-medium">{`${props?.firstName} ${props?.lastName}`}</div>
      </div>
    </div>
  );
}
