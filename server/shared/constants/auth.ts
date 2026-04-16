export const SESSION_COOKIE_NAME = 'dms_session'
export const SESSION_DURATION_HOURS = 12
export const SESSION_TOKEN_HEADER_NAME = 'x-dms-session-token'

export const PERMISSION_CODES = {
  auditView: 'audit.view',
  userCreate: 'user.create',
  userUpdate: 'user.update',
  userDelete: 'user.delete',
  accountTypeCreate: 'account_type.create',
  accountTypeUpdate: 'account_type.update',
  accountTypeDelete: 'account_type.delete',
} as const
