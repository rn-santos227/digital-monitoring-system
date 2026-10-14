import type { H3Event } from 'h3'
import type { PersonnelSkillAuditInput } from '../../shared/models'
import { PERSONNEL_SKILL_AUDIT_ACTIONS, PERSONNEL_SKILL_AUDIT_ENDPOINTS } from '../../shared/constants'
import { recordManagementAuditLog } from '../audit/recordManagementAuditLog'

export async function recordPersonnelSkillAudit(event: H3Event, input: PersonnelSkillAuditInput): Promise<void> {
  const error = input.error
  const statusCode = input.outcome === 'success'
    ? (input.action === 'create' ? 201 : 200)
    : (typeof error === 'object' && error && 'statusCode' in error && typeof error.statusCode === 'number' ? error.statusCode : 500)
  await recordManagementAuditLog(event, {
    userId: input.userId,
    action: PERSONNEL_SKILL_AUDIT_ACTIONS[input.action],
    tableName: 'personnel_qualifications',
    endpoint: PERSONNEL_SKILL_AUDIT_ENDPOINTS[input.action],
    recordId: input.recordId,
    requestData: { personnelId: input.personnelId, ...input.requestData },
    oldData: input.oldData,
    newData: input.newData,
    statusCode,
    outcome: input.outcome,
    message: error instanceof Error ? error.message : `Personnel skill ${input.action} ${input.outcome}.`,
  })
}
