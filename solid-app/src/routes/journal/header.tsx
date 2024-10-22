interface HeaderProps {
  title: string;
  description: string;
}

export default function Header(props: HeaderProps) {
  return (
    <div>
      <h1 class="text-h2">{props.title}</h1>
      <p class="text-subtitle mb-[16px]">{props.description}</p>
    </div>
  );
}
