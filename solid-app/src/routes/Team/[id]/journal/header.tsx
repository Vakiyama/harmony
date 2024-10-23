interface HeaderProps {
  title: string;
  description: string;
}

export default function Header(props: HeaderProps) {
  return (
    <div class="w-full flex flex-col items-center">
      <h1 class="text-h2">{props.title}</h1>
      <p class="text-subtitle">{props.description}</p>
    </div>
  );
}
