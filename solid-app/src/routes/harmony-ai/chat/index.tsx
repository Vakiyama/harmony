import { getUser } from "~/api/server";
import { HarmonyChat } from "./harmony-chat";
import { Show, createSignal, onMount } from "solid-js";
import { InferSelectModel } from "drizzle-orm";
import { users } from "@/schema/Users";
import { BottomModal } from "./components/bottom-modal";
import { OnboardingIntro } from "./components/onboarding-intro";

export default function Index() {
  const [user, setUser] = createSignal<null | InferSelectModel<typeof users>>();

  onMount(fetchUser);

  async function fetchUser() {
    const user = await getUser();

    if (user.type === "user") {
      setUser(user);
      return user;
    } else setTimeout(fetchUser, 200);
  }

  return (
    <>
      <Show when={user() && !user()?.chosenVoice}>
        <BottomModal close={() => {}}>
          <OnboardingIntro user={user()!} fetchUser={fetchUser} />
        </BottomModal>
      </Show>
      <Show when={user() && user()!.chosenVoice}>
        <HarmonyChat />
      </Show>
    </>
  );
}
