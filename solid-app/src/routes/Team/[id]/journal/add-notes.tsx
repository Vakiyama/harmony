interface AddNoteProps {
  title: string;
  placeholder: string;
  content: string | undefined;
}

export default function AddNote(props: AddNoteProps) {
  return (
    <div class="flex flex-col gap-2">
      <label class="text-h4 mb-2 font-grotesque leading-[120%] font-medium text-[#1E1E1E]">
        {props.title}
      </label>
      <textarea
        id="note"
        name="note"
        class="border border-lofiGray text-base rounded-md p-2 min-h-[198px]"
        placeholder={props.placeholder}
        value={props.content}
      ></textarea>
    </div>
  );
}
