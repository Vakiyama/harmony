import { JSXElement, Show } from "solid-js";

export function TeamInfoSection(props: {
  title?: string;
  content: JSXElement;
}) {
  return (
    <div>
      <Show when={props.title}>
        <p class="font-medium">{props.title}</p>
      </Show>
      <p class="text-black/75 text-subtitle">{props.content}</p>
    </div>
  );
}
