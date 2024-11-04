import { useLocation } from "@solidjs/router";
import { children, ParentProps } from "solid-js";

function RootWrapper(props: ParentProps) {
  const location = useLocation();
  const content = children(() => props.children);
  return (
    <div
      class={
        ["harmony-ai", "calendar"].filter((path) =>
          location.pathname.includes(path)
        ).length !== 0
          ? "h-full border"
          : ""
      }
    >
      {content()}
    </div>
  );
}

export default RootWrapper;
