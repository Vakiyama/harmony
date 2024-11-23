import { A } from "@solidjs/router";
import { Component, JSX } from "solid-js";

interface NavBarItemProps {
  icon: JSX.Element;
  label: string;
  href: string;
  active: boolean;
}

const NavBarItem: Component<NavBarItemProps> = (props) => {
  return (
    <A
      href={props.href}
      classList={{
        "flex flex-col items-center justify-center h-[50px] w-full text-sm text-black50 font-medium cursor-pointer transition":
          true,
      }}
    >
      <div
        classList={{
          "text-xl mb-1 w-[50px] h-[25px] flex items-center justify-center rounded-full transition":
            true,
          "bg-[#C9BDF7] text-black50": props.active,
          "text-black50": !props.active,
        }}
      >
        {props.icon}
      </div>
      <p class="text-xs">{props.label}</p>
    </A>
  );
};

export default NavBarItem;
