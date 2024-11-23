import { createAsync, useNavigate, useParams } from "@solidjs/router";
import {
  createMemo,
  createResource,
  createSignal,
  For,
  Match,
  onMount,
  Show,
  Switch,
} from "solid-js";
import {
  createEventParticipant,
  deleteEvent,
  deleteEventParticipant,
  getEvent,
  getEventParticipant,
  getEventParticipants,
  getTeamMembersFromTeamId,
  updateEvent,
  updateEventParticipant,
  updateTaskComplete,
} from "~/api/calendar";
import { FaSolidAngleDown } from "solid-icons/fa";
import { formatDateToLongForm } from "~/lib/formateDateLocal";
import BsQuestionCircleFill from "~/components/svg/BsQuestionCircleFill";
import IoCheckmarkCircle from "~/components/svg/IoCheckmarkCircle";
import FaSolidCircleXmark from "~/components/svg/FaSolidCircleXmark";
import EventDetailsTopNav from "~/components/calendar/calendar-detail-top-nav";
import FaSolidLocationDot from "~/components/icon/location-icon";
import UpdateEventModal from "./update-modal";
import placeholder from "./placeholder.png";
import TextInput from "../../Create/TextInput";
import SelectInput from "~/components/shadcn/Select";
import { TeamMember } from "@/schema/TeamMembers";
import { User } from "@/schema/Users";
import SelectMultipleInput from "~/components/shadcn/MultiSelect";
import TextArea from "../../Create/TextAreaInput";
import { mightFail } from "might-fail";
import DeleteConfirmation from "~/components/shared/delete-confirmation";
import { getUser } from "~/api/server";

type Participant = {
  participant: User;
  status: "yes" | "maybe" | "no" | null;
  eventParticipantId: number;
  role: string | null;
};

const parseTeamMemberToOption = (
  data: { teammembers: TeamMember; users: User }[] | undefined
) =>
  data
    ? data.map((data) => {
        return {
          value: data.teammembers.userId,
          label: data.users.displayName,
        };
      })
    : [];

export default function EventPage() {
  const params = useParams();
  const teamId = parseInt(params.id);
  const eventId = parseInt(params.eventId);
  let currentUserId: number;
  const navigate = useNavigate();

  const [event, { refetch }] = createResource(
    async () => await getEvent(eventId)
  );
  const [teamMembers, setTeamMembers] = createSignal<
    {
      users: User;
      teammembers: TeamMember;
    }[]
  >();
  const [participants, setParticipants] = createSignal<Participant[]>([]);
  const [isTeamMembersOpen, setIsTeamMembersOpen] = createSignal(false);
  const [isModalOpen, setIsModalOpen] = createSignal(false);
  const [title, setTitle] = createSignal(event()?.title ?? "");
  const [location, setLocation] = createSignal(event()?.location ?? "");
  const [repeat, setRepeat] = createSignal<
    "never" | "daily" | "weekly" | "monthly"
  >(event()?.repeat ?? "never");
  const [teamMemberIds, setTeamMemberIds] = createSignal<number[]>(
    participants()?.map((p) => p.participant.id) ?? []
  );
  const [notes, setNotes] = createSignal(event()?.notes ?? "");
  const [isDeleteOpen, setIsDeleteOpen] = createSignal(false);
  const teamMemberOptions = createMemo(() =>
    parseTeamMemberToOption(teamMembers())
  );
  const [currentStatus, setCurrentStatus] = createSignal<
    "yes" | "no" | "maybe" | undefined | null
  >();
  const complete = createMemo(
    (v) => (v = event()?.complete),
    event()?.complete
  );
  const [statusCount, setStatusCount] = createSignal({
    yes: 0,
    maybe: 0,
    no: 0,
    null: 0,
  });

  onMount(async () => {
    const user = (await getUser()) as User;
    currentUserId = user.id;
    await fetchParticipants();
    await fetchTeamMembers();
    await fetchCurrentStatus();
    setStatus();
  });

  const fetchParticipants = async () => {
    const participants = await getEventParticipants(eventId, teamId);
    setParticipants(participants);
  };
  const fetchTeamMembers = async () => {
    const teamMemebers = await getTeamMembersFromTeamId(teamId);
    setTeamMembers(teamMemebers);
  };
  const fetchCurrentStatus = async () => {
    const status = (await getEventParticipant(eventId, currentUserId)).status;
    setCurrentStatus(status);
  };
  const setStatus = () => {
    for (const participant of participants()!) {
      const status = participant.status;
      if (status === "yes") {
        setStatusCount({ ...statusCount(), yes: statusCount().yes + 1 });
      } else if (status === "maybe") {
        setStatusCount({ ...statusCount(), maybe: statusCount().maybe + 1 });
      } else if (status === "no") {
        setStatusCount({ ...statusCount(), no: statusCount().no + 1 });
      } else {
        setStatusCount({ ...statusCount(), null: statusCount().null + 1 });
      }
    }
  };

  const openModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleBackdropModalClick = (e: Event) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };
  const handleBackdropDeleteClick = (e: Event) => {
    if (e.target === e.currentTarget) {
      setIsDeleteOpen(false);
    }
  };
  const handleDeleteEvent = async () => {
    for (const participant of participants()) {
      const [deleteEventParticipantsError, deleteEventParticipantsResult] =
        await mightFail(
          deleteEventParticipant(participant.participant.id, eventId)
        );
      if (deleteEventParticipantsError) {
        return console.error(deleteEventParticipantsError);
      }
    }
    const [deleteEventError, deleteEventResult] = await mightFail(
      deleteEvent(eventId)
    );
    if (deleteEventError) {
      return console.error(deleteEventError);
    }
    navigate(`/team/${teamId}/calendar`);
  };

  const handleUpdateEvent = async () => {
    const [updateEventError, updateEventResult] = await mightFail(
      updateEvent(event()?.id!, {
        location: location(),
        notes: notes(),
        repeat: repeat(),
        title: title(),
      })
    );
    if (updateEventError) {
      return console.error(updateEventError);
    }
    const participantIds = participants()?.map((p) => p.participant.id)!;

    // deleting the last member doesnt work right now, maybe its a multi select problem
    const deletedMembers = participantIds.filter(
      (id) => !teamMemberIds().includes(id)
    );

    for await (const deletedMember of deletedMembers) {
      const [deletedMemberError, deletedMemberResult] = await mightFail(
        deleteEventParticipant(deletedMember, eventId)
      );
      if (deletedMemberError) {
        return console.error(deletedMemberError);
      }
    }

    const newMembers = teamMemberIds()?.filter(
      (id) => !participantIds.includes(id)
    );

    for await (const newMember of newMembers) {
      const [newMemberError, newMemberResult] = await mightFail(
        createEventParticipant(eventId, newMember)
      );
      if (newMemberError) {
        return console.error(newMemberError);
      }
    }
    await refetch();
    await fetchParticipants();
    // reset team member ids
    // setTeamMemberIds(participants()?.map((p) => p.participant.id) ?? []);
    closeModal();
    // temp need to invalidate
  };

  const handleUpdateStatus = async (
    status: "yes" | "no" | "maybe" | undefined | null
  ) => {
    const [updateStatusError, updateStatusResult] = await mightFail(
      currentStatus() === status
        ? updateEventParticipant(currentUserId, eventId, null)
        : updateEventParticipant(currentUserId, eventId, status)
    );
    if (updateStatusError) {
      return console.error(updateStatusError);
    }
    await refetch();
    await fetchParticipants();
  };

  const handleUpdateComplete = async (complete: boolean) => {
    const [updateCompleteError, updateCompleteResult] = await mightFail(
      updateTaskComplete(complete, eventId)
    );
    if (updateCompleteError) {
      return console.error(updateCompleteError);
    }
    await refetch();
    await fetchParticipants();
  };

  return (
    <Show when={event()}>
      <EventDetailsTopNav
        eventType={event()?.type!}
        setModalOpen={openModal}
        teamId={teamId}
      />
      <div class="flex flex-col p-4 justify-between">
        <div class="flex flex-col gap-3 mb-32">
          <div class="flex flex-col gap-1 ">
            <h1 class="text-[#1e1e1e] text-[28px] font-grotesque font-medium leading-tight">
              {event()?.title}
            </h1>
            <div class="flex flex-col gap-0.5">
              <p class="text-[#1e1e1e]/50 text-base leading-tight font-sf-pro">
                {formatDateToLongForm(event()?.timeStart)}
              </p>
              <p class="text-[#1e1e1e]/50 text-base leading-tight font-sf-pro">
                From{" "}
                {event()?.timeStart?.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                <Show when={event()?.timeEnd}>
                  to{" "}
                  {event()?.timeEnd?.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Show>
              </p>
              <p class="text-[#7859ea] text-base leading-tight font-sf-pro">
                Repeats {event()?.repeat.charAt(0).toUpperCase()}
                {event()?.repeat.slice(1)}
              </p>
            </div>
          </div>
          <div class="flex flex-col space-y-4">
            <div class="flex items-center space-x-2">
              <FaSolidLocationDot />
              <div class="flex flex-col items-start">
                <p class="text-center text-[#1e1e1e] text-base font-sf-pro leading-tight">
                  {event()?.location}
                </p>
                <p class="text-center text-[#1e1e1e]/50 text-sm font-sf-pro leading-none">
                  1780 E Broadway, Vancouver, BC V5N 1W3
                </p>
              </div>
            </div>
            {/* temp */}
            <div class="flex items-center justify-center ">
              <img
                class="max-h-96 max-w-96 rounded-lg border border-[#1e1e1e]/20"
                src={placeholder}
              />
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-5">
          <div class="flex flex-col space-y-3">
            <button
              class="flex justify-between items-center"
              onClick={() => setIsTeamMembersOpen(!isTeamMembersOpen())}
            >
              <div class="flex flex-col ">
                <div class="text-[#1e1e1e] text-left text-lg font-medium leading-7 font-grotesque">
                  {participants()?.length}{" "}
                  {participants()?.length === 1 ? "Person" : "People"}
                </div>
                <p class="text-[#1e1e1e]/50 text-sm leading-none font-sf-pro">
                  {statusCount().yes} yes, {statusCount().null} awaiting,{" "}
                  {statusCount().no} no, {statusCount().maybe} maybe
                </p>
              </div>
              <FaSolidAngleDown />
            </button>
            <Show when={isTeamMembersOpen()}>
              <div class="space-y-2">
                <For each={participants()}>
                  {(participant) => (
                    <div class="flex items-center space-x-2 ">
                      <div class="relative">
                        <Show
                          when={participant.participant.photo}
                          fallback={
                            <div class="w-10 h-10 bg-[#d9d9d9] rounded-full"></div>
                          }
                        >
                          <img
                            class="w-10 h-10 rounded-full"
                            src={participant.participant.photo!}
                            alt="temp alt"
                          />
                          <div class="absolute right-0 bottom-0">
                            <Switch>
                              <Match when={participant.status === "yes"}>
                                <IoCheckmarkCircle />
                              </Match>
                              <Match when={participant.status === "maybe"}>
                                <BsQuestionCircleFill />
                              </Match>
                              <Match when={participant.status === "no"}>
                                <FaSolidCircleXmark />
                              </Match>
                            </Switch>
                          </div>
                        </Show>
                      </div>
                      <div>
                        <div class="text-[#1e1e1e] text-lg font-medium font-grotesque">
                          {participant.participant.firstName}{" "}
                          {participant.participant.lastName}
                        </div>
                        <div class="text-[#1e1e1e]/50 text-sm font-sf-pro">
                          {participant.role}
                        </div>
                      </div>
                    </div>
                  )}
                </For>
              </div>
            </Show>
          </div>
          <div>
            <div class="flex flex-col space-y-1">
              <hr class="border-t border-[#1e1e1e]/20" />
              <h2 class="text-[#1e1e1e] text-lg font-medium font-grotesque">
                Notes
              </h2>
              <p class=" text-[#1e1e1e]/50 text-base leading-tight font-sf-pro break-words">
                {event()?.notes}
              </p>
            </div>
          </div>
        </div>
        {isModalOpen() && (
          <div
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]"
            onClick={handleBackdropModalClick}
          >
            <UpdateEventModal onClose={closeModal} update={handleUpdateEvent}>
              <div class="w-full flex flex-col gap-2 ">
                <TextInput
                  label="Title"
                  placeholder="Title"
                  value={title}
                  setValue={setTitle}
                />
                <TextInput
                  label="Location"
                  placeholder="Location"
                  setValue={setLocation}
                  value={location}
                />
                <p class="text-lg  font-grotesque">Repeat</p>
                <SelectInput
                  defaultValue={{
                    value: repeat(),
                    label:
                      repeat()[0].toUpperCase() +
                      repeat().slice(1, repeat.length),
                  }}
                  class="w-full p-1 rounded-lg py-6 ps-4"
                  placeholder="Never"
                  options={
                    [
                      { value: "never", label: "Never" },
                      { value: "daily", label: "Daily" },
                      { value: "weekly", label: "Weekly" },
                      { value: "monthly", label: "Monthly" },
                    ] as const
                  }
                  setSelectedOption={setRepeat}
                />
                <p class="text-lg font-grotesque">Person</p>

                <SelectMultipleInput
                  defaultValue={participants()?.map((p) => {
                    return {
                      value: p.participant.id,
                      label: p.participant.displayName,
                    };
                  })}
                  class="w-full p-1 rounded-lg py-6 ps-4 "
                  placeholder="Person"
                  options={teamMemberOptions()}
                  setSelectedOptions={setTeamMemberIds}
                />
              </div>
              <TextArea
                label="Notes"
                placeholder="Notes"
                value={notes}
                setValue={setNotes}
              />
              <button
                class="bg-[#1e1e1e]/10 font-sf-pro w-[367px] text-[#fe463c] rounded-full h-[48px]"
                onClick={() => setIsDeleteOpen(!isDeleteOpen())}
              >
                Delete Event
              </button>
            </UpdateEventModal>
          </div>
        )}
        {isDeleteOpen() && (
          <div
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]" //temp z-60 to override navbar
            onClick={handleBackdropDeleteClick}
          >
            <DeleteConfirmation
              onDelete={handleDeleteEvent}
              buttonText=" Event"
              description=""
              onCancel={() => setIsDeleteOpen(false)}
              onClose={() => setIsDeleteOpen(false)}
              title="Event"
            />
          </div>
        )}
      </div>
      <div class="absolute bottom-0 w-full h-[100px]">
        <div class="sticky flex justify-end items-center bottom-0 h-[100px] w-full bg-[#fcfcfc] border-t border-[#1e1e1e]/20">
          {event()?.type === "event" ? (
            <div class="flex justify-end space-x-4 items-center h-[30px] mt-[8px] mb-[20px] pr-[12px]">
              {["Yes", "No", "Maybe"].map((response) => (
                <button
                  class={`${
                    currentStatus() === "yes" && response === "Yes"
                      ? "bg-[#6fc94f] text-[#fcfcfc]"
                      : currentStatus() === "no" && response === "No"
                      ? "bg-[#FE7258] text-[#fcfcfc]"
                      : currentStatus() === "maybe" && response === "Maybe"
                      ? "bg-[#F7D844] text-[#fcfcfc]"
                      : "bg-[#1e1e1e]/20 text-[#1e1e1e]"
                  } rounded-full px-[15px] h-[30px] text-lg font-medium font-grotesque`}
                  onclick={() =>
                    handleUpdateStatus(
                      response.toLowerCase() as "yes" | "no" | "maybe"
                    )
                  }
                >
                  {response}
                </button>
              ))}
            </div>
          ) : (
            <div class="justify-end items-center flex h-[30px] mt-[8px] mb-[20px] pr-[12px]">
              <button
                class="rounded-[999px] h-[30px] px-[15px] border border-[#1e1e1e]/25 flex-col justify-center items-center flex"
                onclick={() => {
                  handleUpdateComplete(!complete());
                }}
              >
                <p class="self-stretch text-center text-[#1e1e1e] text-[19px] font-medium font-grotesque ">
                  {!complete() ? "Mark As Incomplete" : "Mark as Complete"}
                </p>
              </button>
            </div>
          )}
        </div>
      </div>
    </Show>
  );
}
