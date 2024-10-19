import { Accessor, Setter } from "solid-js";
import Modal from "~/components/ui/modal";
import { EventFormData } from ".";

const UpdateModal = (props: {
  closeModal: () => void;
  handleUpdateEvent: () => void;
  formData: Accessor<EventFormData>;
  setFormData: Setter<EventFormData>;
  onClick: () => void;
}) => {
  return (
    <Modal
      title="Update Event"
      onClose={props.closeModal}
      onSubmit={props.handleUpdateEvent}
      onClick={props.onClick}
    >
      <input
        type="text"
        placeholder="Event Name"
        value={props.formData().name}
        onInput={(e) =>
          props.setFormData({
            ...props.formData(),
            name: e.currentTarget.value,
          })
        }
      />
      <input
        type="text"
        placeholder="Description"
        value={props.formData().description}
        onInput={(e) =>
          props.setFormData({
            ...props.formData(),
            description: e.currentTarget.value,
          })
        }
      />
      <input
        type="datetime-local"
        value={props.formData().timeStart?.toISOString().slice(0, 16) || ""}
        onInput={(e) =>
          props.setFormData({
            ...props.formData(),
            timeStart: new Date(e.currentTarget.value),
          })
        }
      />
      <input
        type="datetime-local"
        value={props.formData().timeEnd?.toISOString().slice(0, 16) || ""}
        onInput={(e) =>
          props.setFormData({
            ...props.formData(),
            timeEnd: new Date(e.currentTarget.value),
          })
        }
      />
      <input
        type="text"
        placeholder="Location"
        value={props.formData().location || ""}
        onInput={(e) =>
          props.setFormData({
            ...props.formData(),
            location: e.currentTarget.value,
          })
        }
      />
    </Modal>
  );
};

export default UpdateModal;
