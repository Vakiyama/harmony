import { createSignal } from "solid-js";
import ProfileHeaderHome from "~/components/profile/profile-header-home";
import ProfilePopover from "~/components/profile/profile-popover";
import ProfileUserName from "~/components/profile/profile-user-name";
import TeamCard from "~/components/profile/team-card";
import TeamModal from "~/components/profile/team-modal";
import Modal from "~/components/shared/modal";
export default function Profile() {
  const [isModalOpen, setIsModalOpen] = createSignal(false);

  const handleButtonClick = () => {
    setIsModalOpen((prev) => !prev);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleBackdropClick = (e: Event) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };
  return (
    <div class="relative p-4">
      <div>
        <ProfileHeaderHome />
      </div>
      <ProfileUserName
        userNameUrl="https://res.cloudinary.com/daobc6dfz/image/upload/v1724046745/pexels-conojeghuo-375889_iij9gb.jpg"
        userName="Tina Duong"
      />
      <div class="flex flex-row justify-between mt-4 ">
        <h1 class="text-[24px]">Your teams</h1>
        <button
          onClick={handleButtonClick}
          class="flex flex-row gap-1 w-[65px] h-[27px] bg-white items-center justify-center"
        >
          <p class="text-base">New</p>
          <svg
            fill="#7859EA"
            stroke-width="0"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            height="27px"
            width="27px"
            style="overflow: visible; color: currentcolor;"
          >
            <path d="M256 512a256 256 0 1 0 0-512 256 256 0 1 0 0 512zm-24-168v-64h-64c-13.3 0-24-10.7-24-24s10.7-24 24-24h64v-64c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24h-64v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"></path>
          </svg>
        </button>
        {/* <ProfilePopover /> */}
      </div>
      {/* Team Cards */}
      <div class="w-full flex flex-wrap gap-3 justify-start mt-2">
        <TeamCard
          teamName="Lola's Care Team"
          imageUrl="https://res.cloudinary.com/daobc6dfz/image/upload/v1724046745/pexels-conojeghuo-375889_iij9gb.jpg"
        />
        <TeamCard
          teamName="Tina's Team"
          imageUrl="https://res.cloudinary.com/daobc6dfz/image/upload/v1724046745/pexels-conojeghuo-375889_iij9gb.jpg"
        />
        <TeamCard
          teamName="Tina's Team"
          imageUrl="https://res.cloudinary.com/daobc6dfz/image/upload/v1724046745/pexels-conojeghuo-375889_iij9gb.jpg"
        />
        {/* <TeamCard
          teamName="Tina's Team"
          imageUrl="https://res.cloudinary.com/daobc6dfz/image/upload/v1724046745/pexels-conojeghuo-375889_iij9gb.jpg"
        /> */}

        {isModalOpen() && (
          <div
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]" //temporary z-60 to override navbar
            onClick={handleBackdropClick}
          >
            <TeamModal onClose={closeModal} />
          </div>
        )}
      </div>
    </div>
  );
}
