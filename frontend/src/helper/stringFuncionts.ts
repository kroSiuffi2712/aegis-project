export const formatHourMinute = (dateString: string): string => {
  const formatted = new Date(dateString).toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return `[${formatted}]`;
};