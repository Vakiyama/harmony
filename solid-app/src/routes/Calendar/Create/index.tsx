import { createSignal } from "solid-js";
import { EventFormData } from "..";
import { Button } from "~/components/ui/button";

const UpdateModal = () => {
  const [formData, setFormData] = createSignal<EventFormData>({
    name: "",
    description: "",
    timeStart: null,
    timeEnd: null,
    location: null,
  });
  const [eventType, setEventType] = createSignal<"event" | "task">("event");
  return (
    <form class="flex flex-col items-center">
      <div class="flex w-full justify-center">
        <Button variant="outline" onClick={() => setEventType("event")}>
          Event
        </Button>
        <Button variant="outline" onClick={() => setEventType("task")}>
          Task
        </Button>
      </div>
      <input
        type="text"
        placeholder="Event Name"
        value={formData().name}
        onInput={(e) =>
          setFormData({
            ...formData(),
            name: e.currentTarget.value,
          })
        }
      />
      <input
        type="text"
        placeholder="Description"
        value={formData().description}
        onInput={(e) =>
          setFormData({
            ...formData(),
            description: e.currentTarget.value,
          })
        }
      />
      <input
        type="datetime-local"
        value={formData().timeStart?.toISOString().slice(0, 16) || ""}
        onInput={(e) =>
          setFormData({
            ...formData(),
            timeStart: new Date(e.currentTarget.value),
          })
        }
      />
      <input
        type="datetime-local"
        value={formData().timeEnd?.toISOString().slice(0, 16) || ""}
        onInput={(e) =>
          setFormData({
            ...formData(),
            timeEnd: new Date(e.currentTarget.value),
          })
        }
      />
      <input
        type="text"
        placeholder="Location"
        value={formData().location || ""}
        onInput={(e) =>
          setFormData({
            ...formData(),
            location: e.currentTarget.value,
          })
        }
      />
    </form>
  );
};

export default UpdateModal;
