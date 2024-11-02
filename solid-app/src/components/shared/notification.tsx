import { createSignal, onCleanup, onMount } from "solid-js";

interface NotificationProps {
  title: string;
  onClose: () => void;
}

export default function Notification(props: NotificationProps) {
  const [isVisible, setIsVisible] = createSignal(true);

  onMount(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      props.onClose();
    }, 3000);

    onCleanup(() => clearTimeout(timer));
  });

  return (
    isVisible() && (
      <div class="absolute bottom-24 left-1/2 transform -translate-x-1/2 flex flex-row gap-2 justify-center items-center px-4 rounded-md w-[345px] h-[47px] bg-[#937AEE] text-white z-20">
        {/*z-20 temporary */}
        <p>{props.title}</p>
        <svg
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13.7871 3.08789C14.1533 3.4541 14.1533 4.04883 13.7871 4.41504L6.28711 11.915C5.9209 12.2812 5.32617 12.2812 4.95996 11.915L1.20996 8.16504C0.84375 7.79883 0.84375 7.2041 1.20996 6.83789C1.57617 6.47168 2.1709 6.47168 2.53711 6.83789L5.625 9.92285L12.4629 3.08789C12.8291 2.72168 13.4238 2.72168 13.79 3.08789H13.7871Z"
            fill="#FCFCFC"
          />
        </svg>
      </div>
    )
  );
}
