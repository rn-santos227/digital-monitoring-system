import { describe, expect, it } from 'vitest'

import {
  formatBulkUpdateInputValue,
  validateAccountTypeBulkUpdate,
  validateDeploymentBulkUpdate,
  validateEngagementBulkUpdate,
  validateEquipmentBulkUpdate,
  validateIncidentBulkUpdate,
  validatePersonnelBulkUpdate,
  validateRankBulkUpdate,
  validateTrainingBulkUpdate,
  validateUserProfileBulkUpdate,
} from '@/app/utils/bulk-management-validation'

describe('bulk form selection and normalization', () => {
  it.each([
    { input: null, expected: '' },
    { input: undefined, expected: '' },
    { input: 0, expected: '0' },
    { input: false, expected: 'false' },
    { input: 'text', expected: 'text' },
  ])('formats $input for form input', ({ input, expected }) => {
    expect(formatBulkUpdateInputValue(input)).toBe(expected)
  })

  it('requires a selected field in every bulk domain', () => {
    expect(
      validateDeploymentBulkUpdate({ fields: [], form: {}, enabled: {} })
        .payload,
    ).toBeNull()
    expect(
      validateEngagementBulkUpdate({ fields: [], form: {}, enabled: {} })
        .payload,
    ).toBeNull()
    expect(
      validatePersonnelBulkUpdate({
        form: { rank_id: '', company_id: '', battalion_id: '', position: '' },
        enabled: {
          rank_id: false,
          company_id: false,
          battalion_id: false,
          position: false,
        },
      }).payload,
    ).toBeNull()
    expect(
      validateEquipmentBulkUpdate({ enabled: {}, values: {} }).payload,
    ).toBeNull()
    expect(
      validateTrainingBulkUpdate({ fields: [], form: {}, enabled: {} }).payload,
    ).toBeNull()
    expect(
      validateUserProfileBulkUpdate({
        enabled: { avatar_url: false, is_active: false },
        avatarUrl: '',
        isActive: false,
      }).payload,
    ).toBeNull()
    expect(
      validateAccountTypeBulkUpdate({
        enabled: { description: false, is_system: false },
        description: '',
        isSystem: false,
      }).payload,
    ).toBeNull()
  })

  it('includes only selected personnel fields and clears optional assignments', () => {
    const form = {
      rank_id: ' rank ',
      company_id: '',
      battalion_id: '',
      position: ' Officer ',
    }
    const enabled = {
      rank_id: true,
      company_id: true,
      battalion_id: true,
      position: false,
    }
    expect(validatePersonnelBulkUpdate({ form, enabled }).payload).toEqual({
      rank_id: 'rank',
      company_id: null,
      battalion_id: null,
    })
    expect(
      validatePersonnelBulkUpdate({ form: { ...form, rank_id: ' ' }, enabled })
        .payload,
    ).toBeNull()
    expect(
      validatePersonnelBulkUpdate({
        form,
        enabled: { ...enabled, position: true },
      }).payload?.position,
    ).toBe('Officer')
  })

  it.each(['', ' ', '-1', '1.5', 'NaN', 'Infinity'])(
    'rejects invalid rank sort order %s',
    (value) => {
      expect(validateRankBulkUpdate(value).payload).toBeNull()
    },
  )

  it('accepts nonnegative rank order and account-type booleans', () => {
    expect(validateRankBulkUpdate(' 0 ').payload).toEqual({ sort_order: 0 })
    expect(
      validateAccountTypeBulkUpdate({
        enabled: { description: true, is_system: true },
        description: ' ',
        isSystem: false,
      }).payload,
    ).toEqual({ description: null, is_system: false })
    expect(
      validateAccountTypeBulkUpdate({
        enabled: { description: true, is_system: false },
        description: ' Admin ',
        isSystem: true,
      }).payload,
    ).toEqual({ description: 'Admin' })
  })

  it('validates avatar URLs only when selected and preserves false activity', () => {
    expect(
      validateUserProfileBulkUpdate({
        enabled: { avatar_url: true, is_active: true },
        avatarUrl: ' https://example.test/avatar ',
        isActive: false,
      }).payload,
    ).toEqual({ avatar_url: 'https://example.test/avatar', is_active: false })
    expect(
      validateUserProfileBulkUpdate({
        enabled: { avatar_url: true, is_active: false },
        avatarUrl: 'bad-url',
        isActive: true,
      }).payload,
    ).toBeNull()
    expect(
      validateUserProfileBulkUpdate({
        enabled: { avatar_url: true, is_active: false },
        avatarUrl: '',
        isActive: true,
      }).payload,
    ).toEqual({ avatar_url: null })
    expect(
      validateUserProfileBulkUpdate({
        enabled: { avatar_url: false, is_active: true },
        avatarUrl: 'bad-url',
        isActive: true,
      }).payload,
    ).toEqual({ is_active: true })
  })
})

describe('scheduled bulk updates', () => {
  const fields = [
    'deployment_area',
    'start_date',
    'end_date',
    'assignment_role',
    'operation_name',
    'location',
    'remarks',
    'default_remarks',
  ] as const
  const form = {
    deployment_area: ' Area ',
    start_date: '2026-10-04',
    end_date: '2026-10-05',
    assignment_role: '',
    operation_name: ' Operation ',
    location: '',
    remarks: '',
    default_remarks: '',
  }
  const enabled = Object.fromEntries(fields.map((field) => [field, true]))

  it('normalizes every enabled deployment field', () => {
    expect(
      validateDeploymentBulkUpdate({ fields, form, enabled }).payload,
    ).toEqual({
      deployment_area: 'Area',
      start_date: '2026-10-04',
      end_date: '2026-10-05',
      assignment_role: null,
      operation_name: 'Operation',
      location: null,
      remarks: null,
      default_remarks: null,
    })
  })

  it('requires selected deployment area and start date and rejects reversed dates', () => {
    expect(
      validateDeploymentBulkUpdate({
        fields,
        form: { ...form, deployment_area: '' },
        enabled,
      }).payload,
    ).toBeNull()
    expect(
      validateDeploymentBulkUpdate({
        fields,
        form: { ...form, start_date: '' },
        enabled,
      }).payload,
    ).toBeNull()
    expect(
      validateDeploymentBulkUpdate({
        fields,
        form: { ...form, end_date: '2026-10-03' },
        enabled,
      }).payload,
    ).toBeNull()
  })

  it('validates engagement and training ranges only when both date fields are selected', () => {
    const fields = ['start_date', 'end_date', 'remarks'] as const
    const form = {
      start_date: '2026-10-04',
      end_date: '2026-10-03',
      remarks: ' ',
    }
    const enabled = { start_date: true, end_date: true, remarks: true }
    expect(
      validateEngagementBulkUpdate({ fields, form, enabled }).payload,
    ).toBeNull()
    expect(
      validateTrainingBulkUpdate({
        fields,
        form,
        enabled,
        dateRange: { start: 'start_date', end: 'end_date' },
      }).payload,
    ).toBeNull()
    expect(
      validateEngagementBulkUpdate({
        fields,
        form,
        enabled: { ...enabled, end_date: false },
      }).payload,
    ).toEqual({ start_date: '2026-10-04', remarks: null })
    expect(
      validateTrainingBulkUpdate({
        fields,
        form,
        enabled: { ...enabled, end_date: false },
        dateRange: { start: 'start_date', end: 'end_date' },
      }).payload,
    ).toEqual({ start_date: '2026-10-04', remarks: null })
  })
})

describe('equipment and incident bulk fields', () => {
  it('validates selected required and numeric equipment fields and keeps disabled values out', () => {
    const values = { name: ' Radio ', cost: 0, remarks: ' ignored ' }
    const options = {
      values,
      enabled: { name: true, cost: true, remarks: false },
      requiredFields: ['name'] as const,
      numericFields: ['cost'] as const,
    }
    expect(validateEquipmentBulkUpdate(options).payload).toEqual({
      name: 'Radio',
      cost: 0,
    })
    expect(
      validateEquipmentBulkUpdate({
        ...options,
        values: { ...values, name: ' ' },
      }).payload,
    ).toBeNull()
    expect(
      validateEquipmentBulkUpdate({
        ...options,
        values: { ...values, cost: -1 },
      }).payload,
    ).toBeNull()
    expect(
      validateEquipmentBulkUpdate({
        ...options,
        values: { ...values, cost: Number.NaN },
      }).payload,
    ).toBeNull()
    expect(
      validateEquipmentBulkUpdate({
        enabled: { required: true },
        values: { required: null },
        requiredFields: ['required'],
      }).payload,
    ).toBeNull()
  })

  const values = {
    equipment_asset_id: ' asset ',
    personnel_id: '',
    deployment_id: '',
    incident_type_id: 'type',
    incident_date: '2026-10-04',
    location: '',
    location_latitude: null,
    location_longitude: null,
    description: ' Damage ',
    investigation_status_id: '',
    resolution: '',
    remarks: '',
  }
  const enabled = {
    equipment_asset_id: true,
    personnel_id: false,
    deployment_id: false,
    incident_type_id: true,
    incident_date: true,
    location: true,
    location_latitude: true,
    location_longitude: true,
    description: true,
    investigation_status_id: false,
    resolution: false,
    remarks: true,
  }

  it('normalizes selected incident fields, preserving nullable coordinates', () => {
    expect(validateIncidentBulkUpdate({ enabled, values }).payload).toEqual({
      equipment_asset_id: 'asset',
      incident_type_id: 'type',
      incident_date: '2026-10-04',
      location: null,
      location_latitude: null,
      location_longitude: null,
      description: 'Damage',
      remarks: null,
    })
    expect(
      validateIncidentBulkUpdate({
        enabled: Object.fromEntries(
          Object.keys(enabled).map((field) => [field, false]),
        ) as typeof enabled,
        values,
      }).payload,
    ).toBeNull()
  })

  it('rejects empty required incident fields and coordinates outside bounds', () => {
    expect(
      validateIncidentBulkUpdate({
        enabled,
        values: { ...values, description: '' },
      }).payload,
    ).toBeNull()
    expect(
      validateIncidentBulkUpdate({
        enabled,
        values: { ...values, location_latitude: 91 },
      }).payload,
    ).toBeNull()
    expect(
      validateIncidentBulkUpdate({
        enabled,
        values: { ...values, location_longitude: -181 },
      }).payload,
    ).toBeNull()
  })
})
