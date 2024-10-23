import AI from "../../../../components/svg/ai";
import BackButton from "../../../../components/svg/back-button";
import { useNavigate } from "@solidjs/router";

export default function PageHeader() {
  const navigate = useNavigate();

  const handleBackButtonClick = () => {
    navigate("/team/1/journal");
  };

  return (
    <div class="w-full h-full flex flex-row justify-between">
      <div class="cursor-pointer" onClick={handleBackButtonClick}>
        <BackButton />
      </div>
      <div>
        <AI />
      </div>
    </div>
  );
}
