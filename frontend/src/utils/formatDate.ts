export function formatDateStr(dateString: string): string {
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
}

export function formatDate(date: Date): string {
  return new Date(date).toLocaleString("en-US", {
    timeZone: "America/Chicago",
  });
}
