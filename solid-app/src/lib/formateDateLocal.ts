import moment from "moment";

export const formatDateToLocaleString = (date: Date | null | undefined) => {
  return date ? moment(date).format("lll") : "Not specified";
};

export const formatDateToLongForm = (date: Date | null | undefined) => {
  if (!date) return "Not specified";

  const momentDate = moment(date).startOf("day");
  const today = moment().startOf("day");

  if (momentDate.isSame(today, "day")) {
    return `Today, ${momentDate.format("MMM D")}`;
  }

  return momentDate.format("dddd, MMMM D");
};

export const formatTimeForPicker = (date: Date | null | undefined) => {
  if (!date) return;

  const hours = ("0" + date.getHours()).slice(-2);
  const min = ("0" + date.getMinutes()).slice(-2);

  return `${hours}:${min}`;
};

export const formatCreatedDate = (date: Date) => {
  return `${new Date(date).toLocaleDateString("en-us", {
    month: "short",
    day: "numeric",
  })}. - ${new Date(date).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })}`;
};
