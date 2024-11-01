import { JSXElement, Show } from "solid-js";

export function Section(props: { title?: string; content: JSXElement }) {
  return (
    <div>
      <Show when={props.title}>
        <p class="text-subtitle13 font-semibold">{props.title}</p>
      </Show>
      <span class="text-black/75">{props.content}</span>
    </div>
  );
}
