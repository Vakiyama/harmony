"use client";
import { createNoteAction } from "~/api/journal";
import { createSignal } from "solid-js";
import { useAction } from "@solidjs/router";
import ShowError from "~/routes/Team/[id]/journal/show-error";
import { Button } from "~/components/ui/button";
import AddNote from "~/routes/Team/[id]/journal/add-notes";
import Header from "./header";
import PageHeader from "~/routes/Team/[id]/journal/page-header";
import Upload from "./upload";

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
    <>
      <main class="w-full h-full p-4 flex flex-col items-center justify-center space-y-2">
        <PageHeader />
        <section class="mt-8 mb-8 flex flex-col w-full justify-center text-start">
          <div class="flex flex-col items-center gap-1">
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.71429 0C2.5625 0 0 2.5625 0 5.71429V34.2857C0 37.4375 2.5625 40 5.71429 40H25.7143V30C25.7143 27.6339 27.6339 25.7143 30 25.7143H40V5.71429C40 2.5625 37.4375 0 34.2857 0H5.71429ZM40 28.5714H30C29.2143 28.5714 28.5714 29.2143 28.5714 30V40L31.4286 37.1429L37.1429 31.4286L40 28.5714Z"
                fill="#1E1E1E"
              />
            </svg>
            <Header
              title="Note"
              description="Add personal notes to note details and observations for the day."
            />
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
              <label class="text-h4">Add Media</label>
              <div class="flex flex-row w-full gap-2">
                <Upload description="Tap to add a photo" />
                <Upload description="Tap to upload a file" />
              </div>
              <Button
                class="rounded-[100px] h-12 w-full mb-4 bg-lofiGray text-black"
                variant="default"
                type="submit"
              >
                Done
              </Button>
            </form>
          </div>
        </section>
      </main>
    </>
  );
}
