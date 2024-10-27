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
        "flex flex-col items-center justify-center py-2 px-3 text-sm font-medium cursor-pointer transition":
          true,
        "text-purple-600": props.active,
        "text-gray-600": !props.active,
        "hover:text-purple-600": true,
      }}
    >
      <div
        classList={{
          "text-xl mb-1": true,
          "bg-purple-300 text-white rounded-full px-4 py-2": props.active,
        }}
      >
        {props.icon}
      </div>
      <p class="text-xs">{props.label}</p>
    </A>
  );
};

export default NavBarItem;
