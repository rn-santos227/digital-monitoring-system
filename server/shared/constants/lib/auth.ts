export const SESSION_COOKIE_NAME = 'dms_session'
export const SESSION_DURATION_HOURS = 12
export const SESSION_TOKEN_HEADER_NAME = 'x-dms-session-token'

export const PERMISSION_CODES = {
  auditView: 'audit.view',
  rankView: 'rank.view',
  rankCreate: 'rank.create',
  rankDelete: 'rank.delete',
  personnelView: 'personnel.view',
  personnelCreate: 'personnel.create',
  personnelUpdate: 'personnel.update',
  personnelDelete: 'personnel.delete',
  battalionView: 'battalion.view',
  userCreate: 'user.create',
  userUpdate: 'user.update',
  userDelete: 'user.delete',
  accountTypeCreate: 'account_type.create',
  accountTypeUpdate: 'account_type.update',
  accountTypeDelete: 'account_type.delete',
  battalionCreate: 'battalion.create',
  battalionUpdate: 'battalion.update',
  battalionDelete: 'battalion.delete',
  companyView: 'company.view',
  companyCreate: 'company.create',
  companyUpdate: 'company.update',
  companyDelete: 'company.delete',
  trainingView: 'training.view',
  trainingCreate: 'training.create',
  trainingUpdate: 'training.update',
  trainingDelete: 'training.delete',
} as const
