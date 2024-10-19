import { cn } from "~/libs/cn";
import type {
  ImageFallbackProps,
  ImageImgProps,
  ImageRootProps,
} from "@kobalte/core/image";
import { Image as ImagePrimitive } from "@kobalte/core/image";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import type { ValidComponent } from "solid-js";
import { splitProps } from "solid-js";

type imageRootProps<T extends ValidComponent = "span"> = ImageRootProps<T> & {
  class?: string;
};

export const ImageRoot = <T extends ValidComponent = "span">(
  props: PolymorphicProps<T, imageRootProps<T>>
) => {
  const [local, rest] = splitProps(props as imageRootProps, ["class"]);

  return (
    <ImagePrimitive
      class={cn(
        "relative flex h-20 w-10 shrink-0 overflow-hidden border-t rounded-t-2xl",
        local.class
      )}
      {...rest}
    />
  );
};

type imageProps<T extends ValidComponent = "img"> = ImageImgProps<T> & {
  class?: string;
};

export const Image = <T extends ValidComponent = "img">(
  props: PolymorphicProps<T, imageProps<T>>
) => {
  const [local, rest] = splitProps(props as imageProps, ["class"]);

  return (
    <ImagePrimitive.Img
      class={cn("aspect-square h-full w-full mt-0 pt-0", local.class)}
      {...rest}
    />
  );
};

type imageFallbackProps<T extends ValidComponent = "span"> =
  ImageFallbackProps<T> & {
    class?: string;
  };

export const ImageFallback = <T extends ValidComponent = "span">(
  props: PolymorphicProps<T, imageFallbackProps<T>>
) => {
  const [local, rest] = splitProps(props as imageFallbackProps, ["class"]);

  return (
    <ImagePrimitive.Fallback
      class={cn(
        "flex h-full w-full items-center justify-center border-t rounded-t-2xl bg-muted mt-0 pt-0",
        local.class
      )}
      {...rest}
    />
  );
};
