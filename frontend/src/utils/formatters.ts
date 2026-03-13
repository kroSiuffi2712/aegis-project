export const formatToMinutesSeconds = (dateString: string): string => {
  const date = new Date(dateString);

  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `[${minutes}:${seconds}]`;
};

export const formatDateTime = (date: string) => {
  return new Date(date).toLocaleString();
};