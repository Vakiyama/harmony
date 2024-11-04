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
        class="border border-lofiGray text-base rounded-md p-2 min-h-[198px]"
        placeholder={props.placeholder}
      ></textarea>
    </div>
  );
}
