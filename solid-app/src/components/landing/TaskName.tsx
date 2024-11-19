// interface TaskProps {
//   taskName: string;
//   taskDescription: string;
//   startTime?: Date;
//   endTime?: Date;
//   icon?: string;
// }
// export function TaskName({ props }: { props: TaskProps }) {
//   const { taskName, taskDescription, startTime, endTime, icon } = props;
//   return (
//     <div>
//       <h2>{taskName}</h2>
//       <p>{taskDescription}</p>
//       <p>Start Time: {startTime?.toLocaleString()}</p>
//       <p>End Time: {endTime?.toLocaleString()}</p>
//       {icon && <img src={icon} alt={taskName} />}
//     </div>
//   );
// }

import { JSX, JSXElement } from "solid-js";

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
      <div class="flex flex-col gap-2 items-center">
        <div class="flex flex-row items-center justify-between">
          {/* icon */}
          <div class="mx-4">{icon ? icon : null}</div>

          {/* taskName and taskDescription */}
          <div class="flex flex-col my-2">
            <h1 class="text-md-[36px] font-semibold">{taskName}</h1>
            <p class=" text-neutral-500 text-sm">{taskDescription}</p>
          </div>

          {/* startTime and endTime */}
          <div class="flex flex-col py-2 justify-end text-right">
            <p class=" text-neutral-500 text-sm">
              {startTime ? startTime : ""}
            </p>
            <p class=" text-neutral-500 text-sm">{endTime ? endTime : ""}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
