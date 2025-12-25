export const formatTh = (value?: string) => {
  if (!value) return "-";
  const date = new Date(value);

  return date.toLocaleString("th-TH", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
