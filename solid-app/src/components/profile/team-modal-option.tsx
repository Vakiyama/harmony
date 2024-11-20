import { JSXElement } from "solid-js";

interface ModalOptionProps {
  title: string;
  description: string;
  link: string;
  background: string;
  iconBackground: string;
  svg?: JSXElement;
}

export default function TeamModalOption(props: ModalOptionProps) {
  const handleClick = () => {
    window.location.href = props.link;
  };
  return (
    <div
      class={`w-full h-[84px] flex flex-row items-center rounded-md p-4 bg-${props.background}`}
      onClick={handleClick}
    >
      <div class="w-full flex flex-col">
        <a href={props.link} class={`text-left w-full text-h4`}>
          {props.title}
        </a>
        <p class="text-[11px] min-w-full">{props.description}</p>
      </div>
      <div class="cursor-pointer">
        <svg
          width="12"
          height="19"
          viewBox="0 0 12 19"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.291 8.39624C11.9014 9.00659 11.9014 9.9978 11.291 10.6082L3.47852 18.4207C2.86816 19.031 1.87695 19.031 1.2666 18.4207C0.65625 17.8103 0.65625 16.8191 1.2666 16.2087L7.97559 9.49975L1.27148 2.79077C0.661133 2.18042 0.661133 1.18921 1.27148 0.578857C1.88184 -0.0314941 2.87305 -0.0314941 3.4834 0.578857L11.2959 8.39136L11.291 8.39624Z"
            fill="#7859EA"
          />
        </svg>
      </div>
    </div>
  );
}
