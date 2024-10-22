import AI from "../../../../components/svg/ai";
import BackButton from "../../../../components/svg/back-button";

export default function PageHeader() {
  return (
    <div class="w-full h-full flex flex-row justify-between">
      <div>
        <BackButton />
      </div>
      <div>
        <AI />
      </div>
    </div>
  );
}
