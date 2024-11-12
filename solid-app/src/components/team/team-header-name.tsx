import { Image, ImageFallback, ImageRoot } from "../ui/image";
export default function TeamHeaderName(props: {
  photoUrl: string | null | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
}) {
  return (
    <div class="w-full flex flex-row items-center">
      {/* Avatar */}
      <div class="flex items-start space-x-2">
        <ImageRoot class="flex items-center justify-center h-20 w-20 bg-gray-300 rounded-full overflow-hidden">
          <Image
            src={props.photoUrl ? props.photoUrl : ""}
            alt={`${props?.firstName} ${props?.lastName}`}
            class="object-cover w-full h-full rounded-full bg-gray-300"
          />
          <ImageFallback class="flex items-center justify-center w-full h-full bg-gray-200 rounded-full">{`${
            props.firstName ? props.firstName[0] : ""
          } ${props.lastName ? props.lastName[0] : ""}`}</ImageFallback>
        </ImageRoot>
      </div>

      {/* Username and description */}
      <div class="flex">
        <div class="mx-4 text-2xl font-semi ">{`${props?.firstName} ${props?.lastName}`}</div>
      </div>
    </div>
  );
}
