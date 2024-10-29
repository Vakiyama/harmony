import { Show } from "solid-js"

export default function ShowError(prop: {error: string}) {
    return (
        <>
            <Show when={prop.error}>
                    <h2 class="text-red-500">{prop.error}</h2>
                </Show>
        </>
    )
}