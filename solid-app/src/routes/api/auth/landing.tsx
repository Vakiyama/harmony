import { Button } from "~/components/ui/button";
import WordMark from "~/components/svg/wordmark";
import PlaceholderMark from "~/components/svg/placeholder";
export default function Landing() {
  return (
    <main class="absolute top-[3rem] w-full h-[calc(100%-3rem)] p-4 flex items-center justify-center space-y-2 overflow-hidden">
      <div class="mt-8 mb-8 flex flex-col items-center justify-center max-w-md">
        <WordMark class="mt-8 mb-8" />
        <div class="mt-8 mb-8 grid grid-rows-3 w-full">
          <span class="row-span-1 relative">
            <Button
              class="rounded-[100px] h-12 w-[368px] mb-4 border text-gray-500 mx-auto"
              variant="outline"
            >
              <PlaceholderMark class="absolute left-[10%]" />
              Continue with Google
            </Button>
          </span>
          <span class="row-span-1 relative">
            <Button
              class="rounded-[100px] h-12 w-[368px] mb-4 border text-gray-500 mx-auto"
              variant="outline"
            >
              <PlaceholderMark class="absolute left-[10%]" />
              Continue with Facebook
            </Button>
          </span>
          <span class="row-span-1 relative">
            <Button
              class="rounded-[100px] h-12 w-[368px] mb-4 border text-gray-500 mx-auto"
              variant="outline"
            >
              <PlaceholderMark class="absolute left-[10%]" />
              Continue with Apple
            </Button>
          </span>
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
            Sign Up
          </a>
        </div>
      </div>
    </main>
  );
}
