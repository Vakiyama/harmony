import { logout } from "~/api";
import TopNav from "~/components/shared/TopNav";

export default function Settings() {
  return (
    <main class="flex flex-col">
      <section class="h-full">
        <TopNav leftNavigation="Back" />
        <div class="flex flex-col w-full text-start h-full mx-2">
          <div class="w-full flex flex-col gap-2">
            <div class="flex flex-col justify-between gap-4">
              <h1 class="text-2xl">Settings</h1>
              <form action={logout} method="post">
                <button
                  name="logout"
                  type="submit"
                  class="w-[366px] bg-primary-purple-400 hover:bg-primary-purple-300 text-white font-medium text-h4 py-2 px-4 rounded-lg"
                >
                  Logout
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
