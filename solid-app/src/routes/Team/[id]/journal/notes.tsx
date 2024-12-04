"use client";
import {
  createNoteAction,
  deleteNoteAction,
  getNoteById,
  updateNoteAction,
} from "~/api/journal";
import { createMemo, createSignal, Show } from "solid-js";
import {
  createAsync,
  useAction,
  useLocation,
  useNavigate,
  useParams,
} from "@solidjs/router";
import ShowError from "~/routes/Team/[id]/journal/show-error";
import { Button } from "~/components/ui/button";
import AddNote from "~/routes/Team/[id]/journal/add-notes";
import Header from "./header";
import { showNotification } from "~/routes/api/notificationStore";
import NotesIcon from "~/components/icon/notes-icon";
import DeleteConfirmation from "~/components/shared/delete-confirmation";
import AddPhotoModal from "~/components/shared/add-photo-modal";

export default function CreateNote() {
  const params = useParams();
  const location = useLocation();
  const existingNote = location.search.split("?edit=")[1];
  const noteData = createAsync(
    async () => await getNoteById(parseInt(existingNote)),
    {
      deferStream: true,
    }
  );

  const [showAddPhoto, setShowAddPhoto] = createSignal(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] =
    createSignal(false);
  const [isEditing, setIsEditing] = createSignal<boolean>(false);
  if (existingNote) {
    setIsEditing(true);
  }
  const [formRef, setFormRef] = createSignal<HTMLFormElement | undefined>();
  const [noteValue, setNoteValue] = createSignal<string | undefined>();
  const [error, setError] = createSignal("");
  const navigate = useNavigate();
  createMemo(() => {
    setNoteValue(noteData()?.note);
  });
  const createAction = useAction(createNoteAction);
  const updateAction = useAction(updateNoteAction);
  const deleteAction = useAction(deleteNoteAction);
  type NoteActionResponse = {
    error?: string;
    success?: boolean;
    message?: string;
  };
  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    formData.append("teamId", params.id);
    let result: NoteActionResponse;
    if (isEditing()) {
      formData.append("noteId", existingNote);
      result = await updateAction(formData);
    } else {
      result = await createAction(formData);
    }

    if (result.success) {
      setError("");
      formRef()?.reset();
      showNotification(
        isEditing() ? "Note Entry Updated" : "Note Entry Posted"
      );
      navigate(`/team/${params.id}/journal`);
    } else if (result.error) {
      console.error(result.error);
      setError(result.error);
    }
  };

  const handleDelete = async () => {
    const result = await deleteAction(parseInt(existingNote));
    if (result.success) {
      showNotification("Note Entry Deleted");
      navigate(`/team/${params.id}/journal`);
    } else {
      console.error("Error deleting entry:", result.error);
    }
  };

  return (
    <>
      <main class="flex flex-col items-center justify-center mb-4 mx-2">
        <section class="flex flex-col w-full justify-center text-start">
          <div class="flex flex-col items-center gap-1">
            <NotesIcon iconColor="#F7D844" bgColor="#4E412B" />
            <Header
              title={isEditing() ? "Edit Entry" : "Note"}
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
              <Show when={(isEditing() && noteValue()) || !isEditing()}>
                <AddNote
                  title="New Update"
                  placeholder="Add your notes for the day!"
                  content={noteValue()}
                />
                <Button
                  class="rounded-[100px] h-12 w-full bg-primary-purple-300 text-black"
                  variant="default"
                  type="submit"
                >
                  Finish Entry
                </Button>
                {isEditing() && (
                  <Button
                    onClick={() => setShowDeleteConfirmation(true)}
                    class="bg-transparent shadow-none font-sf-pro font-medium text-base text-error hover:bg-transparent"
                  >
                    Delete Entry
                  </Button>
                )}
              </Show>
            </form>
          </div>
          <Show when={showDeleteConfirmation()}>
            <DeleteConfirmation
              title="Journal Entry"
              description="this entry"
              buttonText="Entry"
              onCancel={() => setShowDeleteConfirmation(false)}
              onClose={() => setShowDeleteConfirmation(false)}
              onDelete={handleDelete}
            />
          </Show>
          <Show when={showAddPhoto()}>
            <AddPhotoModal
              onCancel={() => setShowAddPhoto(false)}
              onClose={() => setShowAddPhoto(false)}
            />
          </Show>
        </section>
      </main>
    </>
  );
}
