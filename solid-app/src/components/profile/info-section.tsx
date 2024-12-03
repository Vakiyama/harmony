import { JSXElement, Show } from "solid-js";

export function InfoSection(props: { title?: string; content: JSXElement }) {
  return (
    <div>
      <Show when={props.title}>
        <h4 class="font-medium">{props.title}</h4>
      </Show>
      <p class="text-black/75 text-medium">{props.content}</p>
    </div>
  );
}
