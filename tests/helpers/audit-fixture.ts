import type { AuditLogDetail } from '@/app/types/domain/audit'

export const auditFixture: AuditLogDetail = {
  id: 'audit',
  userId: 'user',
  action: 'UPDATE',
  tableName: 'personnel',
  recordId: null,
  oldData: { name: 'Before' },
  newData: { name: 'After' },
  requestData: null,
  responseData: null,
  requestHeaders: null,
  ipAddress: null,
  statusCode: 200,
  metadata: null,
  createdAt: '2026-10-04T12:00:00Z',
  actor: {
    id: 'user',
    fullName: 'Unit User',
    email: 'unit@example.test',
    avatarUrl: null,
    isActive: true,
  },
}
