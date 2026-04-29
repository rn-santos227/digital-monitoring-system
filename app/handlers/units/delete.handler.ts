interface UseDeleteUnitHandlerOptions {
  onDeleteBattalionAction: (row: Record<string, unknown>) => Promise<boolean>
  onDeleteCompanyAction: (row: Record<string, unknown>) => Promise<boolean>
}

export const useDeleteUnitHandler = ({
  onDeleteBattalionAction,
  onDeleteCompanyAction,
}: UseDeleteUnitHandlerOptions) => {
  const handleDeleteUnitBattalion = async (row: Record<string, unknown>) => {
    await onDeleteBattalionAction(row)
    return true
  }

  const handleDeleteUnitCompany = async (row: Record<string, unknown>) => {
    await onDeleteCompanyAction(row)
    return true
  }

  return {
    handleDeleteUnitBattalion,
    handleDeleteUnitCompany,
  }
}
