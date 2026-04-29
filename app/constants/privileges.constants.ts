export const PRIVILEGE_CODES = Object.freeze({
  auditView: 'audit.view',
  rankView: 'rank.view',
  rankCreate: 'rank.create',
  rankDelete: 'rank.delete',
  personnelView: 'personnel.view',
  personnelCreate: 'personnel.create',
  personnelUpdate: 'personnel.update',
  personnelDelete: 'personnel.delete',
  userView: 'user.view',
  userCreate: 'user.create',
  userUpdate: 'user.update',
  userDelete: 'user.delete',
  accountTypeView: 'account_type.view',
  accountTypeCreate: 'account_type.create',
  accountTypeUpdate: 'account_type.update',
  accountTypeDelete: 'account_type.delete',
  battalionView: 'battalion.view',
  battalionCreate: 'battalion.create',
  battalionUpdate: 'battalion.update',
  battalionDelete: 'battalion.delete',
  companyView: 'company.view',
  companyCreate: 'company.create',
  companyUpdate: 'company.update',
  companyDelete: 'company.delete',
  trainingManage: 'training.manage',
  trainingView: 'training.view',
  trainingCreate: 'training.create',
  trainingUpdate: 'training.update',
  trainingDelete: 'training.delete',
  deploymentManage: 'deployment.manage',
  deploymentView: 'deployment.view',
  deploymentCreate: 'deployment.create',
  deploymentUpdate: 'deployment.update',
  deploymentDelete: 'deployment.delete',
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

export const AUDIT_PRIVILEGES = Object.freeze({
  view: Object.freeze([PRIVILEGE_CODES.auditView]),
})

export const PERSONNEL_PRIVILEGES = Object.freeze({
  view: Object.freeze([PRIVILEGE_CODES.personnelView]),
  create: Object.freeze([PRIVILEGE_CODES.personnelCreate]),
  edit: Object.freeze([PRIVILEGE_CODES.personnelUpdate]),
  delete: Object.freeze([PRIVILEGE_CODES.personnelDelete]),
})

export const RANK_PRIVILEGES = Object.freeze({
  view: Object.freeze([PRIVILEGE_CODES.rankView]),
  create: Object.freeze([PRIVILEGE_CODES.rankCreate]),
  delete: Object.freeze([PRIVILEGE_CODES.rankDelete]),
})

export const BATTALION_PRIVILEGES = Object.freeze({
  view: Object.freeze([PRIVILEGE_CODES.battalionView]),
  create: Object.freeze([PRIVILEGE_CODES.battalionCreate]),
  edit: Object.freeze([PRIVILEGE_CODES.battalionUpdate]),
  delete: Object.freeze([PRIVILEGE_CODES.battalionDelete]),
})

export const COMPANY_PRIVILEGES = Object.freeze({
  view: Object.freeze([PRIVILEGE_CODES.companyView]),
  create: Object.freeze([PRIVILEGE_CODES.companyCreate]),
  edit: Object.freeze([PRIVILEGE_CODES.companyUpdate]),
  delete: Object.freeze([PRIVILEGE_CODES.companyDelete]),
})

export const TRAINING_PRIVILEGES = Object.freeze({
  manage: Object.freeze([PRIVILEGE_CODES.trainingManage]),
  view: Object.freeze([PRIVILEGE_CODES.trainingView]),
  create: Object.freeze([PRIVILEGE_CODES.trainingCreate]),
  edit: Object.freeze([PRIVILEGE_CODES.trainingUpdate]),
  delete: Object.freeze([PRIVILEGE_CODES.trainingDelete]),
})

export const DEPLOYMENT_PRIVILEGES = Object.freeze({
  manage: Object.freeze([PRIVILEGE_CODES.deploymentManage]),
  view: Object.freeze([PRIVILEGE_CODES.deploymentView]),
  create: Object.freeze([PRIVILEGE_CODES.deploymentCreate]),
  edit: Object.freeze([PRIVILEGE_CODES.deploymentUpdate]),
  delete: Object.freeze([PRIVILEGE_CODES.deploymentDelete]),
})
