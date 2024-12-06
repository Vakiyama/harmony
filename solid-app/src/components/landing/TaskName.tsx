import { JSXElement } from "solid-js";

interface TaskProps {
  taskName: string;
  taskDescription: string;
  startTime?: string;
  endTime?: string;
  icon?: JSXElement;
  colour?: string;
}
export function TaskName({ props }: { props: TaskProps }) {
  const { taskName, taskDescription, startTime, endTime, icon, colour } = props;

  return (
    <div class={`rounded-md ${colour ? colour : ""}`}>
      <div class="grid grid-cols-[auto_1fr_auto] items-center">
        {/* icon */}
        <div class="mx-4">{icon ? icon : null}</div>

        {/* taskName and taskDescription */}
        <div class="flex flex-col my-2">
          <h1 class="text-md-[36px] font-semibold">{taskName}</h1>
          <p class=" text-neutral-500 text-sm">{taskDescription}</p>
        </div>

        {/* startTime and endTime */}
        <div class="flex flex-col ml-8 py-2 mr-4 justify-end text-right">
          <p class=" text-neutral-500 text-sm">{startTime ? startTime : ""}</p>
          <p class=" text-neutral-500 text-sm">{endTime ? endTime : ""}</p>
        </div>
      </div>
    </div>
  );
}
