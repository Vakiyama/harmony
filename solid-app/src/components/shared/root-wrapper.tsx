import { useLocation } from "@solidjs/router";
import { children, ParentProps } from "solid-js";

function RootWrapper(props: ParentProps) {
  const location = useLocation();
  const content = children(() => props.children);
  return (
    <div
      class={location.pathname.startsWith("/harmony-ai") ? "h-full border" : ""}
    >
      {content()}
    </div>
  );
}

export default RootWrapper;
