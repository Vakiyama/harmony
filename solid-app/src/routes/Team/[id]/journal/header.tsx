interface HeaderProps {
  title: string;
  description: string;
}

export default function Header(props: HeaderProps) {
  return (
    <div class="w-full h-full flex flex-col items-center">
      <h1 class="w-full text-h2 text-center font-grotesque">{props.title}</h1>
      <p class="w-full text-subtitle text-center font-sf-pro">
        {props.description}
      </p>
    </div>
  );
}
