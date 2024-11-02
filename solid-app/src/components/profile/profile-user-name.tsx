import { Image, ImageFallback, ImageRoot } from "../ui/image";
import { RiSystemSettings4Fill } from "solid-icons/ri";
export default function ProfileUserName({
  userNameUrl,
  userName,
}: {
  userNameUrl: string;
  userName: string;
}) {
  return (
    <div class="w-full flex flex-row items-center w-full">
      {/* Avatar */}
      <div class="flex items-start space-x-2">
        <ImageRoot class="flex items-center justify-center h-20 w-20 bg-gray-300 rounded-full overflow-hidden">
          <Image
            src={userNameUrl}
            alt={userName}
            class="object-cover w-full h-full rounded-full bg-gray-300"
          />
          <ImageFallback class="flex items-center justify-center w-full h-full bg-gray-200 rounded-full"></ImageFallback>
        </ImageRoot>
      </div>

      {/* Username and description */}
      <div class="flex">
        <div class="mx-4 text-2xl font-semi ">{userName}</div>
      </div>
    </div>
  );
}
