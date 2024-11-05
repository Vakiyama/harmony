import { A } from "@solidjs/router";
import { For } from "solid-js";
import { createStore } from "solid-js/store";
import TextFieldLine from "~/components/shared/text-field-line";
import TeamTopNav from "~/components/team/team-top-nav";
import { Button } from "~/components/ui/button";

const formFields = [
  { name: "phoneNumber", label: "Phone Number", placeholder: "Phone Number" },
  {
    name: "email",
    label: "Email",
    placeholder: "email@here.com",
  },
];
export default function UserInfo1({
  onClick,
}: {
  // recipientName: string;
  onClick: () => void;
}) {
  const [formData, setFormData] = createStore({
    phoneNumber: "",
    email: "",
  });

  const handleInput = (e: InputEvent & { currentTarget: HTMLInputElement }) => {
    const { name, value } = e.currentTarget;
    setFormData({ [value]: value });
  };
  const handleSubmit = (e: Event) => {
    e.preventDefault();
    console.log("Form data", formData);
  };

  return (
    <>
      {/* <TeamTopNav backNavigation={onClick} cancelNavigation="/" /> */}
      <div class="relative flex flex-col min-h-screen mx-2">
        <div class="flex items-center justify-center mt-2">
          <p class="text-xs text-gray-400">4 of 8</p>
        </div>
        <form onSubmit={() => {}} class="px-2 mt-6 flex flex-col flex-grow">
          <div>
            <p class="text-[30px] font-semi">Tell us about "User"</p>
            <p class="text-[24px] mt-2">Contact Information</p>
            <For each={formFields}>
              {(field) => (
                <TextFieldLine
                  key={field.name}
                  name={field.name}
                  label={field.label}
                  placeholder={field.placeholder}
                  // value={formData[field.name]}
                  // onInput={handleInput}
                />
              )}
            </For>
          </div>
          {/* space */}
          <div class="flex-grow"></div>
          <div class="flex flex-col items-center justify-center">
            <Button
              type="button"
              onClick={onClick}
              class="rounded-full w-full bg-[#AE9BF2] text-black h-[50px]"
            >
              Next
            </Button>
            <A href="/" class="text-xs p-2">
              skip for now
            </A>
          </div>
        </form>
        {/* Space for bottom */}
        <div class="h-[102px]"></div> {/* temporary */}
      </div>
    </>
  );
}
