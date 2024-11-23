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
    <div class="h-full flex flex-row items-center w-full border rounded-lg gap-3 relative">
      <ImageRoot class="flex items-center justify-center h-16 w-16 bg-gray-300 rounded-full overflow-hidden my-3 ml-3">
        <Image
          src={imageUrl}
          alt={memberName}
          class="object-cover w-full h-full rounded-full bg-gray-300"
        />
        <ImageFallback class="flex items-center justify-center w-full h-full bg-gray-200 rounded-full"></ImageFallback>
      </ImageRoot>
      <div class="flex-grow flex-col font-sf-pro">
        <div class="flex-grow text-start text-base font-medium">
          {memberName}
        </div>
        <div class="text-subtitle text-gray-400">{description}</div>
      </div>
      <div class="absolute top-2 right-2 text-sm font-sf-pro text-gray-600 capitalize">
        {userRole}
      </div>
    </div>
  );
}
