export const PERSONNEL_ROUTE_PARAM_KEY = 'id'

export const PERSONNEL_ROUTE_ID_REQUIRED_MESSAGE = 'Personnel id is required.'

export const withPersonnelId = <T extends object>(body: T, personnelId: string): T & { personnelId: string } => ({
  ...body,
  personnelId,
})
