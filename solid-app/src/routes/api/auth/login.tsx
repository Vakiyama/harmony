import { Button } from "~/components/ui/button";
import { A } from "@solidjs/router";
import MediumLogo from "~/components/svg/mediumLogo";
import { TextField, TextFieldRoot } from "~/components/ui/textfield";

export default function Login() {
  return (
    <main class="absolute top-[3rem] w-full h-[calc(100%-3rem)] p-4 flex items-center justify-center overflow-hidden">
      <div class="mt-8 mb-8 flex flex-col items-center justify-center max-w-md">
        <div class="mt-8 mb-8 grid grid-rows-3 w-full">
          <div class="h-12 mb-4"></div>
        </div>
        <MediumLogo class="mt-8 mb-8" />
        <div class="mb-4">
          <h1 class="text-[28px] normal-case text-gray-600">Welcome back!</h1>
        </div>
        <div>
          <TextFieldRoot>
            <TextField
              class="h-12 w-[368px] rounded-[100px] mb-4"
              type="email"
              placeholder="Email"
              name="email"
            />
          </TextFieldRoot>
          <TextFieldRoot>
            <TextField
              class="h-12 w-[368px] rounded-[100px] mb-4"
              type="password"
              placeholder="Password"
              name="password"
            />
          </TextFieldRoot>
        </div>
        <div class="mt-8 w-full">
          <a href="/api/auth/login" class="mx-auto">
            <Button
              class="rounded-[100px] h-12 w-[368px] mb-4"
              variant="default"
            >
              Login
            </Button>
          </a>
        </div>
        <div class="w-full">
          <a href="/" class="m-0 text-[13px]">
            Forgot your Password?
          </a>
        </div>
      </div>
    </main>
  );
}
