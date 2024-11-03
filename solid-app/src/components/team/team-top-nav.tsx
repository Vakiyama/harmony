export default function TeamTopNav(props: {
  backNavigation: string;
  cancelNavigation: string;
}) {
  return (
    <div class="w-full flex flex-row h-[95px] bg-white shadow-md">
      <div class="w-full flex flex-row justify-between items-end px-4 mb-4">
        <div class="flex items-center">
          <a href={props.backNavigation}>Back</a>
        </div>

        <div class="flex justify-end">
          <a href={props.cancelNavigation} class="text-md">
            Cancel
          </a>
        </div>
      </div>
    </div>
  );
}
