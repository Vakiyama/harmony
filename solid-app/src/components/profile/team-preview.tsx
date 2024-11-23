import { Image, ImageFallback, ImageRoot } from "../ui/image";

type TeamPreviewProps = {
  memberName: string;
  imageUrl: string;
  description: string;
  userRole: string;
};
export default function TeamPreview(props: TeamPreviewProps) {
  const { memberName, imageUrl, description, userRole } = props;
  return (
    <div class="h-full flex flex-row items-center w-full border rounded-lg gap-3">
      <ImageRoot class="flex items-center justify-center h-16 w-16 bg-gray-300 rounded-full overflow-hidden my-3 ml-3">
        <Image
          src={imageUrl}
          alt={memberName}
          class="object-cover w-full h-full rounded-full bg-gray-300"
        />
        <ImageFallback class="flex items-center justify-center w-full h-full bg-gray-200 rounded-full"></ImageFallback>
      </ImageRoot>
      <div class="flex flex-col font-sf-pro">
        <div class="text-base font-medium ">{memberName}</div>
        <div class="text-subtitle text-gray-400">{description}</div>
      </div>
      <div class="absolute right-2 top-2 flex flex-row space-x-3 items-center font-sf-pro">
        <div class="text-subtitle">{userRole}</div>
      </div>
    </div>
  );
}
