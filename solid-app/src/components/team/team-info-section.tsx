import { JSXElement, Show } from "solid-js";

export function TeamInfoSection(props: {
  title?: string;
  content: JSXElement;
}) {
  return (
    <div>
      <Show when={props.title}>
        <p class="text-sm font-semibold">{props.title}</p>
      </Show>
      <span class="text-black/75">{props.content}</span>
    </div>
  );
}
