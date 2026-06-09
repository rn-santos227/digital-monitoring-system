import type { Ref } from 'vue'
import type { PersonnelSearchQuery } from '~/types/domain/personnel'
import { usePersonnelSearchHandlers } from './search.handler'

export const usePersonnelPageHandlers = (filters: Ref<Partial<PersonnelSearchQuery>>) => {
  const { handleFilterApply, handleFilterReset } = usePersonnelSearchHandlers(filters)
  return {
    handleFilterApply,
    handleFilterReset,
  }
}

interface UsePersonnelTableActionHandlerOptions {
  handleViewPersonnelProfile: (id: string) => Promise<unknown>
  onEditPersonnelAction: (id: string) => Promise<unknown>
  onDeletePersonnel: (id: string) => Promise<unknown>
}

export const usePersonnelTableActionHandler = ({
  handleViewPersonnelProfile,
  onEditPersonnelAction,
  onDeletePersonnel,
}: UsePersonnelTableActionHandlerOptions) => {
  const handleTableAction = async ({
    actionKey,
    row,
  }: {
    actionKey: string
    row: { id: string }
  }) => {

  }

  return {
    handleTableAction,
  }
}
