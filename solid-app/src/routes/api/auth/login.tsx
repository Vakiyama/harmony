import { Button } from "~/components/ui/button";
import MediumLogo from "~/components/svg/mediumLogo";
import { TextField, TextFieldRoot } from "~/components/ui/textfield";
import { emailLogin } from "~/api/auth-server-actions";

export default function Login() {
  return (
    <main class="absolute top-[3rem] w-full h-[calc(100%-3rem)] p-4 flex items-center justify-center overflow-hidden">
      <div class="mt-64 mb-6 flex flex-col items-center justify-center max-w-md">
        <MediumLogo class="mt-8 mb-8" />
        <div class="mb-8">
          <h1 class="text-[28px] normal-case text-gray-600">Welcome back!</h1>
        </div>
        <form action={emailLogin} class="appearance-none" method="post">
          <div class="mb-8">
            <TextFieldRoot>
              <TextField
                class="h-12 w-[368px] rounded-[100px] mb-4"
                type="email"
                placeholder="Email"
                name="email"
              />
            </TextFieldRoot>
          </div>
          <div class="mt-4 w-full">
            <Button
              class="rounded-[100px] h-12 w-[368px] mb-4"
              variant="default"
              type="submit"
            >
              Login
            </Button>
          </div>
        </form>
        <div class="w-full">
          <a href="/api/auth/reset-password" class="m-0 text-[13px]">
            Forgot your Password?
          </a>
        </div>
      </div>
    </main>
  );
}
