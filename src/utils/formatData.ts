export function formatDateMMDDYYYY(dateString: string) {
  if (!dateString) return "-"
  const date = new Date(dateString)
  const mm = String(date.getMonth() + 1).padStart(2, "0") // Months are 0-indexed
  const dd = String(date.getDate()).padStart(2, "0")
  const yyyy = date.getFullYear()
  return `${mm}/${dd}/${yyyy}`
}
