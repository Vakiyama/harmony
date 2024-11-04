import { JSXElement } from "solid-js";

interface ModalOptionProps {
  title: string;
  description: string;
  link: string;
  svg: JSXElement;
}

export default function ModalOption(props: ModalOptionProps) {
  const handleClick = () => {
    window.location.href = props.link;
  };
  return (
    <div
      class="w-full flex flex-row items-center bg-lofiGray rounded-md p-4"
      onClick={handleClick}
    >
      <div class="w-full flex flex-col">
        <a href={props.link} class="text-left w-full text-h4">
          {props.title}
        </a>
        <p class="text-[11px] min-w-full">{props.description}</p>
      </div>
      <div class="cursor-pointer">{props.svg}</div>
    </div>
  );
}
