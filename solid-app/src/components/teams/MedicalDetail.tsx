import { A } from "@solidjs/router";

type MedicalDetailProps = {
  medicineName: string;
  medicineDose: string;
  medicineInstructions: string;
  medicineLink: string;
};
export default function MedicalDetail(props: MedicalDetailProps) {
  const { medicineName, medicineDose, medicineInstructions, medicineLink } =
    props;
  return (
    <div class="relative items-center">
      <div class="flex flex-col border-[1px] rounded-md mt-3 items-start">
        <p class="ml-3 mt-3 font-semi text-md">{medicineName}</p>
        <p class="ml-3 mt-1 mb-2 font-semi text-gray-500 text-sm">
          {medicineDose}, {medicineInstructions}
        </p>
        <A href={medicineLink}>
          <svg
            width="26"
            height="23"
            viewBox="0 0 26 23"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="absolute right-3 transform top-6"
          >
            <path
              d="M24.8426 12.6593C25.5506 11.9513 25.5506 10.8015 24.8426 10.0935L15.7801 1.03101C15.0721 0.322998 13.9223 0.322998 13.2143 1.03101C12.5063 1.73901 12.5063 2.88882 13.2143 3.59683L19.1898 9.56675H1.8125C0.809961 9.56675 0 10.3767 0 11.3792C0 12.3818 0.809961 13.1917 1.8125 13.1917H19.1842L13.2199 19.1617C12.5119 19.8697 12.5119 21.0195 13.2199 21.7275C13.9279 22.4355 15.0777 22.4355 15.7857 21.7275L24.8482 12.665L24.8426 12.6593Z"
              fill="#A9A9A9"
            />
          </svg>
        </A>
      </div>
    </div>
  );
}
