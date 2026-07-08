export const formatNotificationDateRange = (startDate: string | null, endDate: string | null) => {
  if (startDate && endDate) {
    return `${startDate} to ${endDate}`
  }

  return startDate ?? endDate ?? 'No schedule date set'
}
