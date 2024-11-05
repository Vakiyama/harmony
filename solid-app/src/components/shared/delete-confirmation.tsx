export default function DeleteConfirmation(props: {
  title: string;
  description: string;
  buttonText: string;
  onCancel: () => void;
  onClose: () => void;
  onDelete: () => void;
}) {
  return (
    <div class="fixed inset-0 flex items-center justify-center z-20">
      {/* Overlay */}
      <div
        class="absolute inset-0 bg-black bg-opacity-50"
        onClick={props.onClose}
      ></div>

      {/* Popup container */}
      <div class="relative flex flex-col justify-center items-center p-4 bg-white border rounded-lg max-w-[270px] max-h-[138px]">
        <h1 class="w-full text-center font-sf-pro text-lg font-semibold">
          Delete {props.title}
        </h1>
        <p class="w-full text-center">
          Are you sure you want to delete this {props.description}?
        </p>
        <div class="w-full flex flex-row justify-between mt-4">
          <button onClick={props.onCancel} class="text-black">
            Cancel
          </button>
          <button onClick={props.onDelete} class="text-red-500 font-medium">
            Delete {props.buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
