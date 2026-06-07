import type { Ref } from 'vue'
import type {
  EngagementManagementSearchQuery,
  EngagementRecordsTabId,
} from '~/types/domain/engagement'
import { useEngagementSearchHandlers } from './search.handler'

const ENGAGEMENT_RECORDS_TAB_IDS: readonly EngagementRecordsTabId[] = [
  'records',
  'engagements',
]

export const useEngagementManagementPageHandlers = (
  engagementFilters: Ref<Partial<EngagementManagementSearchQuery>>,
) => {
  const { handleEngagementFilterApply, handleEngagementFilterReset } =
    useEngagementSearchHandlers(engagementFilters)

  return {
    handleEngagementFilterApply,
    handleEngagementFilterReset,
  }
}

interface UseEngagementTableActionHandlersOptions {
  onOpenViewEngagementModal: (id: string) => Promise<unknown>
  onOpenUpdateEngagementModal: (id: string) => Promise<unknown>
  onDeleteEngagement: (id: string) => Promise<unknown>
  onOpenViewEngagementRecordModal: (id: string) => Promise<unknown>
  onOpenUpdateEngagementRecordModal: (id: string) => Promise<unknown>
  onDeleteEngagementRecord: (id: string) => Promise<unknown>
}

export const useEngagementTableActionHandlers = ({
  onOpenViewEngagementModal,
  onOpenUpdateEngagementModal,
  onDeleteEngagement,
  onOpenViewEngagementRecordModal,
  onOpenUpdateEngagementRecordModal,
  onDeleteEngagementRecord,
}: UseEngagementTableActionHandlersOptions) => {
  const onEngagementAction = async ({
    actionKey,
    row,
  }: {
    actionKey: string
    row: Record<string, unknown>
  }) => {
    const id = String(row.id ?? '')

    if (!id) {
      return
    }

    if (actionKey === 'view-engagement') {
      await onOpenViewEngagementModal(id)
      return
    }

    if (actionKey === 'edit-engagement') {
      await onOpenUpdateEngagementModal(id)
      return
    }

    if (actionKey === 'delete-engagement') {
      await onDeleteEngagement(id)
    }
  }

  const onEngagementRecordAction = async ({
    actionKey,
    row,
  }: {
    actionKey: string
    row: Record<string, unknown>
  }) => {
    const id = String(row.id ?? '')

    if (!id) {
      return
    }

    if (actionKey === 'view-engagement-record') {
      await onOpenViewEngagementRecordModal(id)
      return
    }

    if (actionKey === 'edit-engagement-record') {
      await onOpenUpdateEngagementRecordModal(id)
      return
    }

    if (actionKey === 'delete-engagement-record') {
      await onDeleteEngagementRecord(id)
    }
  }

  return {
    onEngagementAction,
    onEngagementRecordAction,
  }
}

export const useEngagementTabHandler = (
  activeTab: Ref<EngagementRecordsTabId>,
) => {
  const handleTabChange = (tabId: string) => {
    if (ENGAGEMENT_RECORDS_TAB_IDS.includes(tabId as EngagementRecordsTabId)) {
      activeTab.value = tabId as EngagementRecordsTabId
    }
  }

  return {
    handleTabChange,
  }
}
