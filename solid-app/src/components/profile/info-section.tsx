import { JSXElement, Show } from "solid-js";

export function InfoSection(props: { title?: string; content: JSXElement }) {
  return (
    <div>
      <Show when={props.title}>
        <h4 class="text-h4 font-medium">{props.title}</h4>
      </Show>
      <span class="text-black/75">{props.content}</span>
    </div>
  );
}
