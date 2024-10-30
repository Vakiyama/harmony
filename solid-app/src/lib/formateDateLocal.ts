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
