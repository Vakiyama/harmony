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
    <div class="flex flex-col w-full items-center">
      <div class="w-full flex flex-row border rounded-md items-center justify-center p-2">
        <div class="w-full flex flex-col">
          <p class="font-medium text-h4">{medicineName}</p>
          <p class="text-gray-500 text-subtitle">
            {medicineDose}, {medicineInstructions}
          </p>
        </div>
        <A href={medicineLink}>
          <svg
            width="12"
            height="20"
            viewBox="0 0 12 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_5494_3366)">
              <path
                d="M11.291 8.89673C11.9014 9.50708 11.9014 10.4983 11.291 11.1086L3.47852 18.9211C2.86816 19.5315 1.87695 19.5315 1.2666 18.9211C0.65625 18.3108 0.65625 17.3196 1.2666 16.7092L7.97559 10.0002L1.27148 3.29126C0.661133 2.68091 0.661133 1.6897 1.27148 1.07935C1.88184 0.468994 2.87305 0.468994 3.4834 1.07935L11.2959 8.89184L11.291 8.89673Z"
                fill="#1E1E1E"
                fill-opacity="0.5"
              />
            </g>
            <defs>
              <clipPath id="clip0_5494_3366">
                <rect
                  width="12"
                  height="19"
                  fill="white"
                  transform="translate(0 0.5)"
                />
              </clipPath>
            </defs>
          </svg>
        </A>
      </div>
    </div>
  );
}
