import { FaSolidPen } from "solid-icons/fa";
import { createSignal, For, JSXElement, onMount } from "solid-js";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/landing/landing-card";
import Member from "../Member";
import { Section } from "./Section";
import { AttachedUser } from "@/schema/Users";
import { A } from "@solidjs/router";
import { useTeam } from "~/context/team-context";
import { getListOfTeams } from "~/api/team";
import { getUser } from "~/api";
import { User } from "@/schema/Users";

export function JournalCard(props: {
  icon: JSXElement;
  value: string;
  title: string;
  dateTime: string;
  sections: { title?: string; content: JSXElement }[];
  withMember?: boolean;
  member: AttachedUser | null;
  entryId: number;
}) {
  const team = useTeam();
  const [teamId, setTeamId] = createSignal<number | undefined>();
  const [user, setUser] = createSignal<User>();

  onMount(async () => {
    const currentUser = await getUser();
    setUser(currentUser);
    if (team.state.id === -1 || team.state.id === undefined) {
      const teamData = await getListOfTeams();
      const defaultTeam = teamData.find(
        (team) => team.team.defaultTeam === true
      );
      if (!defaultTeam) return;
      setTeamId(defaultTeam?.team.id || undefined);
      team.updateTeamId(defaultTeam?.team.id!);
    } else {
      setTeamId(team.state.id);
    }
  });
  const backgroundColor = `bg-${props.value
    .split(" ")
    .map((c, i) => {
      return i === 1 ? c[0].toUpperCase() + c.substring(1) : c;
    })
    .join("")}Background`;
  const iconBGColor = `bg-${props.value
    .split(" ")
    .map((c, i) => {
      return i === 1 ? c[0].toUpperCase() + c.substring(1) : c;
    })
    .join("")}IconBackground`;

  return (
    <>
      <Card class="bg-[#fdfdfd]">
        <CardHeader>
          <div
            class={`w-full flex flex-row justify-between items-center gap-x-2 rounded-md ${backgroundColor}`}
          >
            <div class="flex justify-center items-center p-2">
              <div
                class={`flex items-center justify-center aspect-square rounded-full px-2 ${iconBGColor}`}
              >
                {props.icon}
              </div>
              <CardTitle class="ml-2">{props.title}</CardTitle>
            </div>
            <div class="flex flex-row gap-2 items-center justify-center mx-2">
              <CardDescription
                classList={{
                  flex: true,
                  "leading-none": true,
                  "items-center": true,
                  "text-subtitle": true,
                }}
              >
                {props.dateTime}
              </CardDescription>
              {user()?.id === props.member?.id && (
                <A
                  href={`/team/${teamId()}/journal/${
                    props.value === "medication taken"
                      ? "medications"
                      : props.value
                  }?edit=${props.entryId}`}
                >
                  <FaSolidPen size={11} color="#1E1E1EBF" />
                </A>
              )}
            </div>
          </div>
        </CardHeader>
        <div class="mx-3 bg-black/15 h-0.5 rounded-full" />
        <CardContent class="mt-3 flex flex-col gap-y-3 w-full">
          <For each={props.sections}>
            {(section) => <Section {...section} />}
          </For>
          <div class="bg-black/15 h-0.5 rounded-full" />
          {props.withMember && <Member member={props.member} />}
        </CardContent>
      </Card>
    </>
  );
}
