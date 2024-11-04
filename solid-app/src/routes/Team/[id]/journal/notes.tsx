"use client";
import { createNoteAction } from "~/api/journal";
import { createSignal } from "solid-js";
import { useAction, useNavigate, useParams } from "@solidjs/router";
import ShowError from "~/routes/Team/[id]/journal/show-error";
import { Button } from "~/components/ui/button";
import AddNote from "~/routes/Team/[id]/journal/add-notes";
import Header from "./header";
import Upload from "./upload";
import { showNotification } from "~/routes/api/notificationStore";
import NotesIcon from "~/components/icon/notes-icon";

export default function CreateNote() {
  const [formRef, setFormRef] = createSignal<HTMLFormElement | undefined>();
  const [error, setError] = createSignal("");
  const navigate = useNavigate();
  const params = useParams();

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
      showNotification("Note Entry Posted");
      navigate(`/team/${params.id}/journal`);
    } else if (result.error) {
      console.error(result.error);
      setError(result.error);
    }
  };
  return (
    <>
      <main class="w-full h-full p-4 flex flex-col items-center justify-center space-y-2">
        <section class="mt-8 mb-8 flex flex-col w-full justify-center text-start">
          <div class="flex flex-col items-center gap-1 mt-16">
            <NotesIcon iconColor="#F7D844" bgColor="#4E412B" />
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
              class="flex flex-col gap-5"
            >
              <AddNote
                title="New Update"
                placeholder="Add your notes for the day!"
              />
              <label class="text-h4">Add Media</label>
              <div class="flex flex-row w-full gap-2">
                <Upload description="Tap to add a photo" />
                <Upload description="Tap to upload a file" />
              </div>
              <Button
                class="rounded-[100px] h-12 w-full mb-4 bg-primary-purple-300 text-black"
                variant="default"
                type="submit"
              >
                Finish Entry
              </Button>
            </form>
          </div>
        </section>
      </main>
    </>
  );
}
