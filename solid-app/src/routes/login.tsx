import {
  useSubmission,
  type RouteSectionProps
} from "@solidjs/router";
import { Show } from "solid-js";
import { loginOrRegister } from "~/api";

export default function Login(props: RouteSectionProps) {
  const loggingIn = useSubmission(loginOrRegister);

  return (
    <main>
      <h1 class="w-full text-3xl font-bold text-blue-500 cursor-default">Login</h1>
      <form action={loginOrRegister} method="post" class="flex flex-col items-center gap-2">
        <input type="hidden" name="redirectTo" value={props.params.redirectTo ?? "/"} />
        <fieldset class="flex gap-2">
          <legend class="cursor-default">Login or Register?</legend>
          <label>
            <input type="radio" name="loginType" value="login" checked={true} class="cursor-pointer" /> Login
          </label>
          <label>
            <input type="radio" name="loginType" value="register" class="cursor-pointer" /> Register
          </label>
        </fieldset>
        <div class="border border-gray-200 mt-4 flex gap-2 px-2 rounded-sm">
          <label for="username-input">Username</label>
          <input name="username" placeholder="kody" autocomplete="username" />
        </div>
        <div class="border border-gray-200 flex gap-2 px-2 rounded-sm">
          <label for="password-input">Password</label>
          <input name="password" type="password" placeholder="twixrox" autocomplete="current-password" />
        </div>
        <button type="submit" class="mt-4 text-blue-500 border border-blue-500 px-2 rounded-[8px]">Login</button>
        <Show when={loggingIn.result}>
          <p style={{color: "red"}} role="alert" id="error-message">
            {loggingIn.result!.message}
          </p>
        </Show>
      </form>
    </main>
  );
}
