export default function Team() {
  return (
    <div class="m-4">
      <h1 class="">Teams</h1>
      <div class="flex flex-col gap-2 mt-2">
        <a href="/teams/profile" class="hover:text-blue-500">
          Profile
        </a>
        <a href="/teams/specific-team" class="hover:text-blue-500">
          Specific Team
        </a>
        <a href="/teams/recipient-info" class="hover:text-blue-500">
          Recipient Info
        </a>
      </div>
    </div>
  );
}
