export const isScheduledNotificationStatus = (statusName: string | null) => {
  return (statusName ?? '').toLowerCase().includes('sched')
}
