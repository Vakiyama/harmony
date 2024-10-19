interface AddNoteProps {
  title: string;
  placeholder: string;
}

export default function AddNote(props: AddNoteProps) {
  return (
    <div class="flex flex-col gap-2">
      <label class="text-h4">{props.title}</label>
      <textarea
        id="note"
        name="note"
        class="border rounded-input p-2 min-h-[111px]"
        placeholder={props.placeholder}
      ></textarea>
    </div>
  );
}
