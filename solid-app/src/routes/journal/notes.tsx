"use client";
import { createNoteAction } from "~/api/journal";
import { createSignal } from "solid-js";
import { useAction } from "@solidjs/router";
import ShowError from "~/components/show-error";
import { Button } from "~/components/ui/button";
import AddNote from "~/components/add-notes";

export default function CreateNote() {
  const [formRef, setFormRef] = createSignal<HTMLFormElement | undefined>();
  const [error, setError] = createSignal("");
  const myAction = useAction(createNoteAction);
  type CreateNoteActionResponse = {
    success?: boolean;
    error?: string;
  };
  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();

    const result: CreateNoteActionResponse = await myAction(
      new FormData(event.target as HTMLFormElement)
    );

    if (result.success) {
      setError("");
      formRef()?.reset();
    } else if (result.error) {
      console.error(result.error);
      setError(result.error);
    }
  };
  return (
    <main class="absolute top-[3rem] w-full h-[calc(100%-3rem)] p-4 flex items-center justify-center space-y-2 overflow-hidden">
      <section class="mt-8 mb-8 flex flex-col w-full max-w-[368px] justify-center text-start">
        <div class="flex flex-col gap-1">
          <svg
            width="50"
            height="50"
            viewBox="0 0 50 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.5 12.5001C12.5 11.9475 12.7195 11.4176 13.1102 11.0269C13.5009 10.6362 14.0308 10.4167 14.5833 10.4167H35.4167C35.9692 10.4167 36.4991 10.6362 36.8898 11.0269C37.2805 11.4176 37.5 11.9475 37.5 12.5001C37.5 13.0526 37.2805 13.5825 36.8898 13.9732C36.4991 14.3639 35.9692 14.5834 35.4167 14.5834H14.5833C14.0308 14.5834 13.5009 14.3639 13.1102 13.9732C12.7195 13.5825 12.5 13.0526 12.5 12.5001ZM12.5 20.8334C12.5 20.2809 12.7195 19.751 13.1102 19.3603C13.5009 18.9696 14.0308 18.7501 14.5833 18.7501H35.4167C35.9692 18.7501 36.4991 18.9696 36.8898 19.3603C37.2805 19.751 37.5 20.2809 37.5 20.8334C37.5 21.3859 37.2805 21.9159 36.8898 22.3066C36.4991 22.6973 35.9692 22.9167 35.4167 22.9167H14.5833C14.0308 22.9167 13.5009 22.6973 13.1102 22.3066C12.7195 21.9159 12.5 21.3859 12.5 20.8334ZM14.5833 27.0834C14.0308 27.0834 13.5009 27.3029 13.1102 27.6936C12.7195 28.0843 12.5 28.6142 12.5 29.1667C12.5 29.7193 12.7195 30.2492 13.1102 30.6399C13.5009 31.0306 14.0308 31.2501 14.5833 31.2501H35.4167C35.9692 31.2501 36.4991 31.0306 36.8898 30.6399C37.2805 30.2492 37.5 29.7193 37.5 29.1667C37.5 28.6142 37.2805 28.0843 36.8898 27.6936C36.4991 27.3029 35.9692 27.0834 35.4167 27.0834H14.5833ZM12.5 37.5001C12.5 36.9475 12.7195 36.4176 13.1102 36.0269C13.5009 35.6362 14.0308 35.4167 14.5833 35.4167H22.9167C23.4692 35.4167 23.9991 35.6362 24.3898 36.0269C24.7805 36.4176 25 36.9475 25 37.5001C25 38.0526 24.7805 38.5825 24.3898 38.9732C23.9991 39.3639 23.4692 39.5834 22.9167 39.5834H14.5833C14.0308 39.5834 13.5009 39.3639 13.1102 38.9732C12.7195 38.5825 12.5 38.0526 12.5 37.5001Z"
              fill="black"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M4.16663 8.33325C4.16663 6.67565 4.82511 5.08594 5.99721 3.91383C7.16931 2.74173 8.75902 2.08325 10.4166 2.08325H39.5833C41.2409 2.08325 42.8306 2.74173 44.0027 3.91383C45.1748 5.08594 45.8333 6.67565 45.8333 8.33325V41.6666C45.8333 43.3242 45.1748 44.9139 44.0027 46.086C42.8306 47.2581 41.2409 47.9166 39.5833 47.9166H10.4166C8.75902 47.9166 7.16931 47.2581 5.99721 46.086C4.82511 44.9139 4.16663 43.3242 4.16663 41.6666V8.33325ZM10.4166 6.24992H39.5833C40.1358 6.24992 40.6657 6.46941 41.0564 6.86011C41.4471 7.25081 41.6666 7.78072 41.6666 8.33325V41.6666C41.6666 42.2191 41.4471 42.749 41.0564 43.1397C40.6657 43.5304 40.1358 43.7499 39.5833 43.7499H10.4166C9.86409 43.7499 9.33419 43.5304 8.94349 43.1397C8.55279 42.749 8.33329 42.2191 8.33329 41.6666V8.33325C8.33329 7.78072 8.55279 7.25081 8.94349 6.86011C9.33419 6.46941 9.86409 6.24992 10.4166 6.24992Z"
              fill="black"
            />
          </svg>
          <h1 class="text-h2">Note</h1>
          <p class="text-subtitle mb-[16px]">Description of what a log does</p>
        </div>
        <div class="flex flex-col mt-2 gap-2 w-full">
          <ShowError error={error()}></ShowError>
          <form
            ref={setFormRef}
            onSubmit={handleSubmit}
            method="post"
            class="flex flex-col gap-2"
          >
            <AddNote title="New Update" placeholder="User Input" />
            <Button
              class="rounded-button h-12 items-center w-full sm:max-w-368 mb-4"
              variant="default"
              type="submit"
            >
              Save
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
}
