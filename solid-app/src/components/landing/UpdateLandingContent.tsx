import { Card } from "~/components/ui/landing/landing-card";
import {
  Tabs,
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsTrigger,
} from "~/components/ui/landing/landing-tabs";

const UpdateLandingContent = () => {
  return (
    <div class="mt-4">
      <Tabs defaultValue="medication taken" class="w-full">
        <TabsList class="flex flex-row items-center justify-center">
          <TabsTrigger value="mood" class="text-md">
            Mood
          </TabsTrigger>
          <TabsTrigger value="medication taken" class="text-md">
            Medication Taken
          </TabsTrigger>
          <TabsTrigger value="notes" class="text-md">
            Notes
          </TabsTrigger>
          <TabsTrigger value="nutrition" class="text-md">
            Nutrition
          </TabsTrigger>
          <TabsTrigger value="sleep" class="text-md">
            Sleep
          </TabsTrigger>
          <TabsIndicator />
        </TabsList>

        {/* tab content for mood */}
        <TabsContent value="mood">
          <Card>
            <div class="">
              <div class="rounded-xl w-full h-96 bg-gray-200 flex items-center justify-center">
                <div class="flex flex-col items-center justify-center">
                  <svg
                    width="20"
                    height="19"
                    viewBox="0 0 20 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 9.5H5L8 17.5L12 1.5L15 9.5H19"
                      stroke="black"
                      stroke-opacity="0.25"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>

                  <p class="text-neutral-400 mt-2">
                    recent care circle activity will show here
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* tab content for medication taken */}
        <TabsContent value="medication taken">
          <Card>
            <div class="">
              <div class="rounded-xl w-full h-96 bg-gray-200 flex items-center justify-center">
                <div class="flex flex-col items-center justify-center">
                  <svg
                    width="20"
                    height="19"
                    viewBox="0 0 20 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 9.5H5L8 17.5L12 1.5L15 9.5H19"
                      stroke="black"
                      stroke-opacity="0.25"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>

                  <p class="text-neutral-400 mt-2">
                    recent care circle activity will show here
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* tab content for notes */}
        <TabsContent value="notes">
          <Card>
            <div class="">
              <div class="rounded-xl w-full h-96 bg-gray-200 flex items-center justify-center">
                <div class="flex flex-col items-center justify-center">
                  <svg
                    width="20"
                    height="19"
                    viewBox="0 0 20 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 9.5H5L8 17.5L12 1.5L15 9.5H19"
                      stroke="black"
                      stroke-opacity="0.25"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>

                  <p class="text-neutral-400 mt-2">
                    recent care circle activity will show here
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* tab content for nutrition */}
        <TabsContent value="nutrition">
          <Card>
            <div class="">
              <div class="rounded-xl w-full h-96 bg-gray-200 flex items-center justify-center">
                <div class="flex flex-col items-center justify-center">
                  <svg
                    width="20"
                    height="19"
                    viewBox="0 0 20 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 9.5H5L8 17.5L12 1.5L15 9.5H19"
                      stroke="black"
                      stroke-opacity="0.25"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>

                  <p class="text-neutral-400 mt-2">
                    recent care circle activity will show here
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* tab content for sleep */}
        <TabsContent value="sleep">
          <Card>
            <div class="">
              <div class="rounded-xl w-full h-96 bg-gray-200 flex items-center justify-center">
                <div class="flex flex-col items-center justify-center">
                  <svg
                    width="20"
                    height="19"
                    viewBox="0 0 20 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 9.5H5L8 17.5L12 1.5L15 9.5H19"
                      stroke="black"
                      stroke-opacity="0.25"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>

                  <p class="text-neutral-400 mt-2">
                    recent care circle activity will show here
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UpdateLandingContent;
