import { logout } from "~/api";
import TopNav from "~/components/shared/TopNav";

export default function Settings() {
  return (
    <main class="h-screen overflow-hidden flex flex-col">
      <section class="h-full mt-20">
        <TopNav leftNavigation="Back" />
        <div class="flex flex-col w-full text-start h-full">
          <div class="w-full flex flex-col gap-2 mt-4 overflow-hidden">
            <div class="flex flex-col justify-between mx-2 gap-4">
              <h1 class="text-2xl">Settings</h1>
              <form action={logout} method="post">
                <button
                  name="logout"
                  type="submit"
                  class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg"
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
