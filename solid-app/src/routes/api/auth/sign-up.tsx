import { Button } from "~/components/ui/button";
import { TextField, TextFieldRoot } from "~/components/ui/textfield";
import { emailRegistration } from "~/api/auth-server-actions";
import DatePickerComponent from "~/components/shadcn/DatePicker";
import { createSignal } from "solid-js";
import ShowError from "~/routes/Team/[id]/journal/show-error";
import { useAction } from "@solidjs/router";

export default function SignUp() {
  const [errors, setErrors] = createSignal<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const registerAction = useAction(emailRegistration);
  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.target as HTMLFormElement);
    try {
      await registerAction(formData);
      setErrors({});
    } catch (error: any) {
      if (error.errors) {
        setErrors(error.errors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <main class="w-full h-full p-4 flex items-center justify-center space-y-2 overflow-hidden">
      <div class="flex flex-col items-center justify-center w-full h-full mb-16">
        <form
          onSubmit={handleSubmit}
          class="appearance-none w-full mt-1"
          method="post"
        >
          <div class="mb-8 w-full mx-auto">
            <div class="mb-4 text-left self-start justify-self-start h-[84px]">
              <h1 class="text-h2 normal-case text-black mb-4">Sign Up</h1>
              <p class="text-gray-600 text-subtitle_13 w-full">
                Please enter your name and email below.
              </p>
            </div>
            <h2 class="text-left mb-3">Your Name</h2>
            <div>
              <ShowError error={errors()?.firstName} />
              <TextFieldRoot>
                <TextField
                  class="h-12 w-full rounded-[8px] mb-4 text-base"
                  type="text"
                  placeholder="First Name"
                  name="firstName"
                  required={true}
                />
              </TextFieldRoot>
              <ShowError error={errors()?.lastName} />
              <TextFieldRoot>
                <TextField
                  class="h-12 w-full rounded-[8px] mb-8 text-base"
                  type="text"
                  placeholder="Last Name"
                  name="lastName"
                  required={true}
                />
              </TextFieldRoot>
              <ShowError error={errors()?.dob} />
              <h2 class="text-left mb-3">Date of Birth</h2>
              <div class="h-12 w-full">
                <DatePickerComponent required={true} />
              </div>
              <h2 class="text-left mt-4 mb-3">Email</h2>
              <ShowError error={errors()?.email} />
              <TextFieldRoot>
                <TextField
                  class="h-12 w-full rounded-[8px] mb-4 text-base"
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
              class="w-full rounded-full h-12 mb-4 text-base text-black bg-primary-purple-300"
              variant="default"
              type="submit"
              disabled={isSubmitting()}
            >
              {isSubmitting() ? "..." : "Next"}
            </Button>
            <div class="w-full mb-0 flex justify-center">
              <a href="/api/auth/landing" class="m-0 text-subtitle13">
                Already have an account? Log In
              </a>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
