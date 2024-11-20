import { JSXElement } from "solid-js";
import { twMerge } from "tailwind-merge";

export function BottomModal(props: { children: JSXElement; height?: number }) {
  return (
    <>
      <div
        class={twMerge(
          "absolute top-0 left-0 backdrop-blur bg-black/60 w-full z-10 h-screen",
        )}
      />
      <div
        class={`
        rounded-b-none
        py-5
        pt-2
        fixed bottom-0 w-full flex flex-col items-center z-10 bg-white h-fit border rounded-[45px]`}
        style={{ height: props.height ? `${props.height}px` : "fit-content" }}
      >
        <div class="w-48 bg-black/50 h-[3px] rounded-full my-2" />
        {props.children}
      </div>
    </>
  );
}
