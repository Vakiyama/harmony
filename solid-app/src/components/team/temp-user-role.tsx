export default function TempUserRole({
  key,
  role,
  onClick,
}: {
  key: string;
  role: string;
  onClick: () => void;
}) {
  return (
    <div
      class="flex items-center justify-start bg-[#E4DEFB] rounded-xl mt-2"
      onClick={onClick}
    >
      <p class="text-sm p-4 font-semibold">{role}</p>
    </div>
  );
}
