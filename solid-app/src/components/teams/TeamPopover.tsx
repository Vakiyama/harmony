import type { PopoverTriggerProps } from "@kobalte/core/popover";
import { createSignal } from "solid-js";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  TextField,
  TextFieldLabel,
  TextFieldRoot,
} from "~/components/ui/textfield";

const TeamPopover = () => {
  const [isOpen, setIsOpen] = createSignal(false);
  return (
    <Popover open={isOpen()} onOpenChange={setIsOpen}>
      <PopoverTrigger
        as={(props: PopoverTriggerProps) => (
          <Button
            variant="outline"
            {...props}
            class="rounded-full border bg-gray-300 p-3 aspect-square h-15"
          >
            {/* check Popover is open or not to show a corresponding icon for button */}
            {isOpen() ? (
              <svg
                width="26"
                height="26"
                viewBox="0 0 26 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M23.5625 13C23.5625 13.8988 22.8363 14.625 21.9375 14.625H4.0625C3.16367 14.625 2.4375 13.8988 2.4375 13C2.4375 12.1012 3.16367 11.375 4.0625 11.375H21.9375C22.8363 11.375 23.5625 12.1012 23.5625 13Z"
                  fill="#787878"
                />
              </svg>
            ) : (
              <svg
                width="27"
                height="27"
                viewBox="0 0 27 27"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.1875 4.21875C15.1875 3.28535 14.4334 2.53125 13.5 2.53125C12.5666 2.53125 11.8125 3.28535 11.8125 4.21875V11.8125H4.21875C3.28535 11.8125 2.53125 12.5666 2.53125 13.5C2.53125 14.4334 3.28535 15.1875 4.21875 15.1875H11.8125V22.7812C11.8125 23.7146 12.5666 24.4688 13.5 24.4688C14.4334 24.4688 15.1875 23.7146 15.1875 22.7812V15.1875H22.7812C23.7146 15.1875 24.4688 14.4334 24.4688 13.5C24.4688 12.5666 23.7146 11.8125 22.7812 11.8125H15.1875V4.21875Z"
                  fill="#787878"
                />
              </svg>
            )}
          </Button>
        )}
      />
      <PopoverContent class="w-70 rounded-2xl">
        <div class="flex flex-row space-x-1 items-center mx-2">
          <div class="mx-2 items-center">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.25 10.5C2.25 10.5 1.5 10.5 1.5 9.75C1.5 9 2.25 6.75 6 6.75C9.75 6.75 10.5 9 10.5 9.75C10.5 10.5 9.75 10.5 9.75 10.5H2.25ZM6 6C6.59674 6 7.16903 5.76295 7.59099 5.34099C8.01295 4.91903 8.25 4.34674 8.25 3.75C8.25 3.15326 8.01295 2.58097 7.59099 2.15901C7.16903 1.73705 6.59674 1.5 6 1.5C5.40326 1.5 4.83097 1.73705 4.40901 2.15901C3.98705 2.58097 3.75 3.15326 3.75 3.75C3.75 4.34674 3.98705 4.91903 4.40901 5.34099C4.83097 5.76295 5.40326 6 6 6Z"
                fill="black"
              />
            </svg>
          </div>
          <div class="mx-2 items-center">
            <PopoverTitle class="space-y-2">
              <a class="font-medium leading-none">Create New Team</a>
            </PopoverTitle>
          </div>
        </div>
        <hr class="my-2" />
        <div class="flex flex-row space-x-1 items-center mx-2">
          <div class="mx-2 items-center">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.25 10.5C5.25 10.5 4.5 10.5 4.5 9.75C4.5 9 5.25 6.75 8.25 6.75C11.25 6.75 12 9 12 9.75C12 10.5 11.25 10.5 11.25 10.5H5.25ZM8.25 6C8.84674 6 9.41903 5.76295 9.84099 5.34099C10.2629 4.91903 10.5 4.34674 10.5 3.75C10.5 3.15326 10.2629 2.58097 9.84099 2.15901C9.41903 1.73705 8.84674 1.5 8.25 1.5C7.65326 1.5 7.08097 1.73705 6.65901 2.15901C6.23705 2.58097 6 3.15326 6 3.75C6 4.34674 6.23705 4.91903 6.65901 5.34099C7.08097 5.76295 7.65326 6 8.25 6ZM3.912 10.5C3.80082 10.2659 3.74537 10.0092 3.75 9.75C3.75 8.73375 4.26 7.6875 5.202 6.96C4.73182 6.81513 4.24196 6.74428 3.75 6.75C0.75 6.75 0 9 0 9.75C0 10.5 0.75 10.5 0.75 10.5H3.912ZM3.375 6C3.87228 6 4.34919 5.80246 4.70083 5.45083C5.05246 5.09919 5.25 4.62228 5.25 4.125C5.25 3.62772 5.05246 3.15081 4.70083 2.79917C4.34919 2.44754 3.87228 2.25 3.375 2.25C2.87772 2.25 2.40081 2.44754 2.04917 2.79917C1.69754 3.15081 1.5 3.62772 1.5 4.125C1.5 4.62228 1.69754 5.09919 2.04917 5.45083C2.40081 5.80246 2.87772 6 3.375 6Z"
                fill="black"
              />
            </svg>
          </div>
          <div class="mx-2 items-center">
            <PopoverTitle class="space-y-2">
              <a class="font-medium leading-none">Join an Existing team</a>
            </PopoverTitle>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TeamPopover;
