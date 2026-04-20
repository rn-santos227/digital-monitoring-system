import { ROUTE_PATHS } from '~/constants/routes.constants'

export const useViewPersonnelProfileHandler = () => {
  const handleViewPersonnelProfile = async (personnelId: string) => {
    await navigateTo(ROUTE_PATHS.personnelProfile(personnelId))
  }

  return {
    handleViewPersonnelProfile,
  }
}
