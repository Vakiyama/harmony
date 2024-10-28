import { Accessor } from "solid-js";
import Modal from "~/components/ui/modal";
import { Event } from "@/schema/Events";

const DeleteModal = (props: {
  closeModal: () => void;
  handleDeleteEvent: () => void;
  currentEvent: Accessor<Event | null>;
  onClick: () => void;
}) => {
  return (
    <Modal
      title="Delete Event"
      onClose={props.closeModal}
      onSubmit={props.handleDeleteEvent}
      onClick={props.onClick}
    >
      <p>
        Are you sure you want to delete "
        {props.currentEvent() ? props.currentEvent()!.title : ""}"?
      </p>
    </Modal>
  );
};

export default DeleteModal;
