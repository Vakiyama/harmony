import { Button } from "~/components/ui/button";
import MediumLogo from "~/components/svg/mediumLogo";
import { TextField, TextFieldRoot } from "~/components/ui/textfield";
import { emailLogin } from "~/api/auth-server-actions";

export default function Login() {
  return (
    <main class="w-full h-full mt-[120px] p-4 flex items-center justify-center space-y-2 overflow-hidden">
      <div class="mt-64 mb-16 flex flex-col items-center justify-center w-full">
        <MediumLogo class="mt-10 mb-10" />
        <div class="mt-[2px] mb-6 w-full flex items-center justify-center">
          <h1 class="text-h2 normal-case text-gray-600 ">Welcome back!</h1>
        </div>
        <form action={emailLogin} class="appearance-none w-full" method="post">
          <div class="mb-6 w-full">
            <TextFieldRoot>
              <TextField
                class="h-12 w-full rounded-[100px] mb-4 text-base"
                type="email"
                placeholder="Email"
                name="email"
              />
            </TextFieldRoot>
          </div>
          <div class="mt-4 w-full">
            <Button
              class="rounded-[100px] h-12 w-full mb-4 text-base"
              variant="default"
              type="submit"
            >
              Login
            </Button>
          </div>
        </form>
        {/* <div class="w-full">
          <a href="/api/auth/reset-password" class="m-0 text-[13px]">
            Forgot your Password?
          </a>
        </div> */}
      </div>
    </main>
  );
}
