import { createContext, createSignal, JSXElement } from "solid-js";

type BottomNavContextType = {
  showBottomNav: () => boolean;
  setShowBottomNav: (show: boolean) => void;
};

const BottomNavContext = createContext<BottomNavContextType>({
  showBottomNav: () => true,
  setShowBottomNav: () => {},
});

function BottomNavProvider(props: { children: JSXElement }) {
  const [showBottomNav, setShowBottomNav] = createSignal(true);
  return (
    <BottomNavContext.Provider value={{ showBottomNav, setShowBottomNav }}>
      {props.children}
    </BottomNavContext.Provider>
  );
}

export { BottomNavContext, BottomNavProvider };
