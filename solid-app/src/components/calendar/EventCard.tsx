import { Event } from "../../../drizzle/schema/Events";
import { TaskName } from "../landing/TaskName";

export default function EventCard({ event }: { event: Event }) {
  if (event.type === "task") {
    return (
      <TaskName
        props={{
          taskName: event.title,
          taskDescription: event.notes,
          icon: (
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 1.6875C10.9394 1.6875 12.7994 2.45792 14.1707 3.82928C15.5421 5.20064 16.3125 7.0606 16.3125 9C16.3125 10.9394 15.5421 12.7994 14.1707 14.1707C12.7994 15.5421 10.9394 16.3125 9 16.3125C7.0606 16.3125 5.20064 15.5421 3.82928 14.1707C2.45792 12.7994 1.6875 10.9394 1.6875 9C1.6875 7.0606 2.45792 5.20064 3.82928 3.82928C5.20064 2.45792 7.0606 1.6875 9 1.6875ZM9 18C11.3869 18 13.6761 17.0518 15.364 15.364C17.0518 13.6761 18 11.3869 18 9C18 6.61305 17.0518 4.32387 15.364 2.63604C13.6761 0.948212 11.3869 0 9 0C6.61305 0 4.32387 0.948212 2.63604 2.63604C0.948212 4.32387 0 6.61305 0 9C0 11.3869 0.948212 13.6761 2.63604 15.364C4.32387 17.0518 6.61305 18 9 18ZM12.9727 7.34766C13.3031 7.01719 13.3031 6.48281 12.9727 6.15586C12.6422 5.82891 12.1078 5.82539 11.7809 6.15586L7.87852 10.0582L6.22617 8.40586C5.8957 8.07539 5.36133 8.07539 5.03437 8.40586C4.70742 8.73633 4.70391 9.2707 5.03437 9.59766L7.28437 11.8477C7.61484 12.1781 8.14922 12.1781 8.47617 11.8477L12.9727 7.34766Z"
                fill="#6FC94F"
              />
            </svg>
          ),
          colour: "bg-green-50",
        }}
      />
    );
  }
  if (event.type === "event") {
    return (
      <TaskName
        props={{
          taskName: event.title,
          taskDescription: event.notes,
          icon: (
            <svg
              width="2"
              height="40"
              viewBox="0 0 2 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="2" height="40" rx="1" fill="#7859EA" />
            </svg>
          ),
          startTime: event.timeStart!.toLocaleTimeString("en-us", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          endTime: event.timeEnd
            ? event.timeEnd.toLocaleTimeString("en-us", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : undefined,
          colour: "bg-purple-50",
        }}
      />
    );
  }
}
