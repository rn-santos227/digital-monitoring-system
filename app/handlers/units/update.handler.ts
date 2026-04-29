import type { UpdateBattalionPayload, UpdateCompanyPayload } from '~/types/domain/units'

interface UseUpdateUnitHandlerOptions {
  onUpdateBattalion: (payload: UpdateBattalionPayload) => Promise<void>
  onUpdateCompany: (payload: UpdateCompanyPayload) => Promise<void>
}

export const useUpdateUnitHandler = ({
  onUpdateBattalion,
  onUpdateCompany,
}: UseUpdateUnitHandlerOptions) => {
  const handleUpdateUnitBattalion = async (payload: UpdateBattalionPayload) => {
    await onUpdateBattalion(payload)
  }

  const handleUpdateUnitCompany = async (payload: UpdateCompanyPayload) => {
    await onUpdateCompany(payload)
  }

  return {
    handleUpdateUnitBattalion,
    handleUpdateUnitCompany,
  }
}
