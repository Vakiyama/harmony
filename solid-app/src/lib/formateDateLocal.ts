export const formatDateToLocaleString = (date: Date | null | undefined) => {
  return date ? date.toLocaleString() : "Not specified";
};

export const formatDateToLongForm = (date: Date | null | undefined) => {
  const options = {
    month: "short",
    day: "numeric",
  } as Intl.DateTimeFormatOptions;

  if (!date) return "Not specified";

  const today = new Date();
  // Reset time components for comparison
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  if (date.getTime() === today.getTime()) {
    return `Today, ${new Intl.DateTimeFormat("en-US", options).format(date)}`;
  }

  const longOptions = {
    weekday: "long",
    month: "long",
    day: "numeric",
  } as Intl.DateTimeFormatOptions;

  return new Intl.DateTimeFormat("en-US", longOptions).format(date);
};
