import { useNavigate } from "@solidjs/router";
import TeamTopNav from "~/components/team/team-top-nav";
import UserType from "~/components/team/user-type";

export default function Create() {
  const navigate = useNavigate();
  return (
    <div class="h-full flex flex-col">
      <TeamTopNav
        leftNavigation={() => {
          navigate("/profile");
        }}
        rightText=""
        isCreating={false}
      />

      <p class="flex justify-center text-subtitle13 text-stepsGray mt-3 ">
        1 of 8
      </p>
      <div class="flex items-center justify-end flex-col h-full mb-[53px] mx-3">
        <div class="flex flex-col justify-end w-full">
          <p class="text-h3 font-medium leading-[120%]">
            Who is receiving care?
          </p>
          {/* <UserType name="Me" link="/team/create/me" /> */}
          <UserType name="Someone Else" link="/team/create/someone" />
        </div>
      </div>
    </div>
  );
}
