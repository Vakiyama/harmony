import { createSignal, For } from "solid-js";

const Tabs = () => {
  const [activeTab, setActiveTab] = createSignal("tab1");

  const tabs = [
    { id: "tab1", label: "Account" },
    { id: "tab2", label: "Password" },
  ];

  return (
    <div class="flex flex-col w-72 shadow-lg">
      <div
        class="flex-shrink-0 flex border-b border-gray-200"
        role="tablist"
        aria-label="Manage your account"
      >
        <For each={tabs}>
          {(tab) => (
            <button
              class="flex-1 bg-white px-5 h-12 flex items-center justify-center text-base leading-none text-gray-700 select-none first:rounded-tl-md last:rounded-tr-md hover:text-violet-600 focus:outline-none"
              classList={{
                "text-violet-600 shadow-inner border-b-2 border-violet-600":
                  activeTab() === tab.id,
              }}
              role="tab"
              aria-selected={activeTab() === tab.id}
              aria-controls={`panel-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          )}
        </For>
      </div>

      <div
        class="flex-grow p-5 bg-white rounded-b-md focus:shadow-outline"
        role="tabpanel"
        id="panel-tab1"
        aria-labelledby="tab1"
        hidden={activeTab() !== "tab1"}
      >
        <p class="mt-0 mb-5 text-gray-600 text-sm leading-normal">
          Make changes to your account here. Click save when you're done.
        </p>
        <fieldset class="mb-4 w-full flex flex-col">
          <label class="text-sm mb-2 text-violet-800" for="name">
            Name
          </label>
          <input
            class="rounded px-2.5 text-base text-violet-700 shadow border-gray-300 h-9 focus:border-violet-500 focus:ring-2 focus:ring-violet-300"
            id="name"
            value="Pedro Duarte"
          />
        </fieldset>
        <fieldset class="mb-4 w-full flex flex-col">
          <label class="text-sm mb-2 text-violet-800" for="username">
            Username
          </label>
          <input
            class="rounded px-2.5 text-base text-violet-700 shadow border-gray-300 h-9 focus:border-violet-500 focus:ring-2 focus:ring-violet-300"
            id="username"
            value="@peduarte"
          />
        </fieldset>
        <div class="flex mt-5 justify-end">
          <button class="inline-flex items-center justify-center rounded px-4 text-base font-medium h-9 bg-green-100 text-green-800 hover:bg-green-200 focus:ring-2 focus:ring-green-400">
            Save changes
          </button>
        </div>
      </div>

      <div
        class="flex-grow p-5 bg-white rounded-b-md focus:shadow-outline"
        role="tabpanel"
        id="panel-tab2"
        aria-labelledby="tab2"
        hidden={activeTab() !== "tab2"}
      >
        <p class="mt-0 mb-5 text-gray-600 text-sm leading-normal">
          Change your password here. After saving, you'll be logged out.
        </p>
        <fieldset class="mb-4 w-full flex flex-col">
          <label class="text-sm mb-2 text-violet-800" for="currentPassword">
            Current password
          </label>
          <input
            class="rounded px-2.5 text-base text-violet-700 shadow border-gray-300 h-9 focus:border-violet-500 focus:ring-2 focus:ring-violet-300"
            id="currentPassword"
            type="password"
          />
        </fieldset>
        <fieldset class="mb-4 w-full flex flex-col">
          <label class="text-sm mb-2 text-violet-800" for="newPassword">
            New password
          </label>
          <input
            class="rounded px-2.5 text-base text-violet-700 shadow border-gray-300 h-9 focus:border-violet-500 focus:ring-2 focus:ring-violet-300"
            id="newPassword"
            type="password"
          />
        </fieldset>
        <fieldset class="mb-4 w-full flex flex-col">
          <label class="text-sm mb-2 text-violet-800" for="confirmPassword">
            Confirm password
          </label>
          <input
            class="rounded px-2.5 text-base text-violet-700 shadow border-gray-300 h-9 focus:border-violet-500 focus:ring-2 focus:ring-violet-300"
            id="confirmPassword"
            type="password"
          />
        </fieldset>
        <div class="flex mt-5 justify-end">
          <button class="inline-flex items-center justify-center rounded px-4 text-base font-medium h-9 bg-green-100 text-green-800 hover:bg-green-200 focus:ring-2 focus:ring-green-400">
            Change password
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tabs;
