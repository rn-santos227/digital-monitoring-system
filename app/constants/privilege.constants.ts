export const PRIVILEGE_CODES = Object.freeze({
  auditView: 'audit.view',
  userView: 'user.view',
  userCreate: 'user.create',
  userUpdate: 'user.update',
  userDelete: 'user.delete',
  accountTypeView: 'account_type.view',
  accountTypeCreate: 'account_type.create',
  accountTypeUpdate: 'account_type.update',
  accountTypeDelete: 'account_type.delete',
})

export const USER_PROFILE_PRIVILEGES = Object.freeze({
  view: Object.freeze([PRIVILEGE_CODES.userView]),
  create: Object.freeze([PRIVILEGE_CODES.userCreate]),
  edit: Object.freeze([PRIVILEGE_CODES.userUpdate]),
  delete: Object.freeze([PRIVILEGE_CODES.userDelete]),
})

export const ACCOUNT_TYPE_PRIVILEGES = Object.freeze({
  view: Object.freeze([PRIVILEGE_CODES.accountTypeView]),
  create: Object.freeze([PRIVILEGE_CODES.accountTypeCreate]),
  edit: Object.freeze([PRIVILEGE_CODES.accountTypeUpdate]),
  delete: Object.freeze([PRIVILEGE_CODES.accountTypeDelete]),
})


