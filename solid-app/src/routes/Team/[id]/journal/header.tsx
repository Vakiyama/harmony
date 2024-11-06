interface HeaderProps {
  title: string;
  description: string;
}

export default function Header(props: HeaderProps) {
  return (
    <div class="w-full flex flex-col items-center mb-7">
      <h1 class="w-full text-h2 text-center">{props.title}</h1>
      <p class="w-full text-subtitle text-center">{props.description}</p>
    </div>
  );
}
