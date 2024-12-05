import TopNav from "../shared/TopNav";

export default function EventCreateTopNav(props: {
  handleCreate: (e: Event) => void;
  name?: string;
  teamId: number;
}) {
  return (
    <TopNav
      name={props.name ? `${props.name}'s Care Team` : ""}
      leftNavigation="Calendar"
    />
  );
}
