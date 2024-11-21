import { Button } from "~/components/ui/button";
import MediumLogo from "~/components/svg/mediumLogo";
import { TextField, TextFieldRoot } from "~/components/ui/textfield";
import { emailLogin } from "~/api/auth-server-actions";

export default function Login() {
  return (
    <main class="w-full h-full p-4 flex justify-center space-y-2 overflow-hidden">
      <div class="flex flex-col items-center justify-end w-full mb-[142px]">
        <MediumLogo class="mt-10 mb-10" />
        <div class="mt-[2px] mb-6 w-full flex items-center justify-center">
          <h1 class="text-h2 normal-case text-gray-600 ">Welcome back!</h1>
        </div>
        <form action={emailLogin} class="appearance-none w-full" method="post">
          <div class="mb-6 w-full">
            <TextFieldRoot>
              <TextField
                class="h-12 w-full rounded-[8px] mb-4 text-base"
                type="email"
                placeholder="Email"
                name="email"
              />
            </TextFieldRoot>
          </div>
          <div class="w-full">
            <Button
              class="rounded-full h-12 w-full text-base text-black bg-primary-purple-300"
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
