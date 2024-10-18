import { Button } from "~/components/ui/button";
import { TextField, TextFieldRoot } from "~/components/ui/textfield";
import { emailRegistration } from "~/api/auth-server-actions";
import DatePickerComponent from "~/components/shadcn/DatePicker";

export default function SignUp() {
  return (
    <main class="w-full h-full mt-20 p-4 flex items-center justify-center space-y-2 overflow-hidden">
      <div class="flex flex-col items-center justify-center max-w-[368px] w-full h-full">
        <div class="mt-16 mb-4 text-left self-start justify-self-start h-[84px]">
          <h1 class="text-h2 normal-case text-black mb-4">Sign Up</h1>
          <p class="text-gray-600 text-subtitle_13 w-3/4">
            Please enter your name and email below.
          </p>
        </div>
        <form
          action={emailRegistration}
          class="appearance-none w-full mt-1 max-w-[368px]"
          method="post"
        >
          <div class="mb-8 w-full mx-auto">
            <h2 class="text-left mb-3">Your Name</h2>
            <div>
              <TextFieldRoot>
                <TextField
                  class="h-12 max-w-[368px] w-full rounded-[100px] mb-4 text-base"
                  type="text"
                  placeholder="First Name"
                  name="firstName"
                  required={true}
                />
              </TextFieldRoot>
              <TextFieldRoot>
                <TextField
                  class="h-12 max-w-[368px] w-full rounded-[100px] mb-8 text-base"
                  type="text"
                  placeholder="Last Name"
                  name="lastName"
                  required={true}
                />
              </TextFieldRoot>
              <h2 class="text-left mb-3">Date of Birth</h2>
              <div class="h-12 max-w-[368px] w-full">
                <DatePickerComponent required={true} />
              </div>
              <h2 class="text-left mt-4 mb-3">Email</h2>
              <TextFieldRoot>
                <TextField
                  class="h-12 max-w-[368px] w-full rounded-[100px] mb-4 text-base"
                  type="email"
                  placeholder="Email"
                  name="email"
                  required={true}
                />
              </TextFieldRoot>
            </div>
          </div>
          <div class="mt-4 w-full">
            <Button
              class="max-w-[368px] w-full rounded-[100px] h-12 mb-4 text-base"
              variant="default"
              type="submit"
            >
              Let's Go
            </Button>
          </div>
        </form>
        <div class="w-full mb-0">
          <a href="/api/auth/landing" class="m-0 text-[13px]">
            Already have an account? Log In
          </a>
        </div>
      </div>
    </main>
  );
}
