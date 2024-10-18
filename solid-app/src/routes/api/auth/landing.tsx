import { Button } from "~/components/ui/button";
import WordMark from "~/components/svg/wordmark";
import PlaceholderMark from "~/components/svg/placeholder";
import { createSignal } from "solid-js";
import { type oauthMethods, oauthLogin } from "~/api/auth-server-actions";
import { useAction } from "@solidjs/router";

export default function Landing() {
  const [method, setMethod] = createSignal<oauthMethods>("");
  const oauthAction = useAction(oauthLogin);
  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    formData.append("method", method());
    return await oauthAction(formData);
  };
  return (
    <main class="w-full h-full mt-28 p-4 flex items-center justify-center space-y-2 overflow-hidden">
      <div class="mt-8 mb-8 flex flex-col items-center justify-center max-w-[368px] w-full">
        <WordMark class="mt-8 mb-8" />
        <form
          onSubmit={handleSubmit}
          class="appearance-none w-full max-w-[368px]"
          method="post"
        >
          <div class="mt-8 mb-8 grid grid-rows-3 w-full max-w-[368px]">
            <span class="row-span-1 relative">
              <Button
                class="rounded-[100px] h-12 w-full mb-4 border text-gray-500 text-base"
                variant="outline"
                onClick={() => setMethod("google")}
                type="submit"
              >
                <PlaceholderMark class="absolute left-[10%]" />
                Continue with Google
              </Button>
            </span>
            <span class="row-span-1 relative">
              <Button
                class="rounded-[100px] h-12 w-full mb-4 border text-gray-500 mx-auto text-base"
                variant="outline"
                onClick={() => setMethod("facebook")}
                type="submit"
              >
                <PlaceholderMark class="absolute left-[10%]" />
                Continue with Facebook
              </Button>
            </span>
            <span class="row-span-1 relative">
              <Button
                class="rounded-[100px] h-12 w-full mb-4 border text-gray-500 mx-auto text-base"
                variant="outline"
                onClick={() => setMethod("apple")}
                type="submit"
              >
                <PlaceholderMark class="absolute left-[10%]" />
                Continue with Apple
              </Button>
            </span>
          </div>
        </form>
        <div class="mt-8 w-full">
          <a href="/api/auth/login" class="mx-auto">
            <Button
              class="rounded-[100px] h-12 w-full mb-4 text-base"
              variant="default"
            >
              Login
            </Button>
          </a>
        </div>
        <div class="w-full">
          <a href="/api/auth/sign-up" class="m-0 text-subtitle_13">
            Sign Up
          </a>
        </div>
      </div>
    </main>
  );
}
