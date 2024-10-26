import { A } from "@solidjs/router";
import { Component, JSX } from "solid-js";

interface NavBarItemProps {
  icon: JSX.Element;
  label: string;
  href: string;
  active: boolean;
}

const NavBarItem: (props: NavBarItemProps) => JSX.Element = ({
  icon,
  label,
  href,
  active,
}) => {
  return (
    <div>
      <A
        href={href}
        class={`flex flex-col items-center justify-center py-2 px-3 text-sm font-medium cursor-pointer transition
            ${active ? "text-blue-600" : "text-gray-600"} hover:text-blue-600`}
      >
        <div class="text-xl mb-1">{icon}</div>
        <p class="text-xs">{label}</p>
      </A>
    </div>
  );
};

export default NavBarItem;
