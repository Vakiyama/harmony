import { useTeam } from "~/context/team-context";
import { TeamInfoCard } from "./team-info-card";

export default function TeamGeneralInfo() {
  const team = useTeam();
  const formatPhoneNumber = (value: string) => {
    const rawValue = value.replace(/\D/g, "");
    return rawValue.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3").slice(0, 12);
  };
  const {
    phoneNumber,
    email,
    gender,
    age,
    preferredLanguage,
    livesWith,
    employment,
  } = team.state.recipient;
  return (
    <div class="h-full m-2">
      <TeamInfoCard
        title="Contact Information"
        value={"general"}
        icon={
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.2171 13.9997C10.6071 13.9997 9.75027 13.7791 8.46715 13.0622C6.90683 12.1872 5.69996 11.3794 4.14808 9.83158C2.65183 8.33627 1.92371 7.36815 0.904646 5.51377C-0.246604 3.42002 -0.0503539 2.32252 0.169021 1.85346C0.430271 1.29283 0.815896 0.957523 1.31433 0.62471C1.59744 0.439221 1.89704 0.280216 2.20933 0.14971C2.24058 0.136273 2.26965 0.12346 2.29558 0.111898C2.45027 0.0422101 2.68465 -0.0631024 2.98152 0.0493976C3.17965 0.123773 3.35652 0.27596 3.6334 0.549398C4.20121 1.1094 4.97715 2.35659 5.2634 2.96908C5.45558 3.3819 5.58277 3.6544 5.58308 3.96002C5.58308 4.31783 5.40308 4.59377 5.18465 4.89158C5.14371 4.94752 5.10308 5.00096 5.06371 5.05283C4.8259 5.36533 4.77371 5.45565 4.80808 5.6169C4.87777 5.94096 5.39746 6.90565 6.25152 7.75784C7.10558 8.61002 8.04246 9.0969 8.36777 9.16627C8.5359 9.20221 8.62808 9.14783 8.95058 8.90158C8.99683 8.86627 9.04433 8.82971 9.09402 8.79315C9.42715 8.54534 9.69027 8.37002 10.0396 8.37002H10.0415C10.3456 8.37002 10.6059 8.5019 11.0371 8.7194C11.5996 9.00315 12.8843 9.76908 13.4478 10.3375C13.7218 10.6138 13.8746 10.79 13.9493 10.9878C14.0618 11.2856 13.9559 11.5191 13.8868 11.6753C13.8753 11.7013 13.8625 11.7297 13.849 11.7613C13.7175 12.073 13.5575 12.372 13.3712 12.6544C13.039 13.1513 12.7025 13.536 12.1406 13.7975C11.8521 13.934 11.5363 14.0031 11.2171 13.9997Z"
              fill="#D7CDF9"
            />
          </svg>
        }
        sections={[
          {
            title: "Phone Number",
            content: (
              <p class="text-xs">
                {phoneNumber ? formatPhoneNumber(phoneNumber) : phoneNumber}
              </p>
            ),
          },
          {
            title: "Email",
            content: <p class="text-xs ">{email ? email : "empty"}</p>,
          },
        ]}
      />

      <TeamInfoCard
        title="Other Information"
        value={"general information"}
        icon={
          <svg
            width="14"
            height="16"
            viewBox="0 0 14 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.2222 16H0.777778C0.571498 16 0.373667 15.9157 0.227806 15.7657C0.0819442 15.6157 0 15.4122 0 15.2V0.8C0 0.587827 0.0819442 0.384344 0.227806 0.234315C0.373667 0.0842854 0.571498 0 0.777778 0H13.2222C13.4285 0 13.6263 0.0842854 13.7722 0.234315C13.9181 0.384344 14 0.587827 14 0.8V15.2C14 15.4122 13.9181 15.6157 13.7722 15.7657C13.6263 15.9157 13.4285 16 13.2222 16ZM3.88889 4V5.6H10.1111V4H3.88889ZM3.88889 7.2V8.8H10.1111V7.2H3.88889ZM3.88889 10.4V12H7.77778V10.4H3.88889Z"
              fill="#D7CDF9"
            />
          </svg>
        }
        sections={[
          {
            title: "Gender",
            content: <p class="text-xs">{gender}</p>,
          },
          {
            title: "Preferred Language",
            content: <p class="text-xs ">{preferredLanguage}</p>,
          },
          {
            title: "Lives With",
            content: <p class="text-xs ">{livesWith ? livesWith : "empty"}</p>,
          },
          {
            title: "Employment",
            content: (
              <p class="text-xs ">{employment ? employment : "empty"}</p>
            ),
          },
        ]}
      />
    </div>
  );
}
