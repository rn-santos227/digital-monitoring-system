import { describe, expect, it } from 'vitest'

import {
  assertPersonnelAssignable,
  buildAssignedPersonnelProfileMap,
  mapAccountTypeListItem,
  mapPrivilegeListItem,
  mapUserProfileCompactListItem,
  mapUserProfileDetail,
  mapUserProfileListItem,
  normalizeOptionalText,
} from '@/server/shared/utils/user-management'

const accountType = { id: 'operator', code: 'operator', name: 'Operator' }
const profile = {
  id: 'user',
  personnel_id: 'person',
  email: 'unit@example.test',
  full_name: 'Unit User',
  avatar_url: null,
  is_active: false,
  last_login_at: null,
  password_updated_at: null,
  created_at: 'created',
  updated_at: 'updated',
}

describe('user and access response mapping', () => {
  it.each(['object', 'array', 'empty', 'null'] as const)(
    'normalizes %s account-type relations',
    (kind) => {
      const relation =
        kind === 'object'
          ? accountType
          : kind === 'array'
            ? [accountType]
            : kind === 'empty'
              ? []
              : null
      const row = {
        ...profile,
        user_account_types: [{ account_types: relation }],
      }
      const expected =
        kind === 'object' || kind === 'array' ? [accountType] : []
      expect(mapUserProfileListItem(row)).toMatchObject({
        personnelId: 'person',
        isActive: false,
        accountTypes: expected,
      })
      expect(mapUserProfileDetail(row)).toMatchObject({
        passwordUpdatedAt: null,
        accountTypes: expected,
      })
      expect(mapUserProfileCompactListItem(row).accountTypes).toEqual(
        expected.map(({ code }) => ({ code })),
      )
    },
  )

  it('uses an empty list when account relations are absent', () => {
    expect(
      mapUserProfileListItem({ ...profile, user_account_types: null })
        .accountTypes,
    ).toEqual([])
    expect(
      mapUserProfileDetail({ ...profile, user_account_types: null })
        .accountTypes,
    ).toEqual([])
    expect(
      mapUserProfileCompactListItem({ ...profile, user_account_types: null })
        .accountTypes,
    ).toEqual([])
  })

  it('flattens account privileges and marks assignment membership', () => {
    const permission = {
      id: 'permission',
      code: 'personnel.view',
      name: 'View personnel',
      module: 'personnel',
    }
    const row = {
      ...accountType,
      description: null,
      is_system: false,
      created_at: 'created',
      updated_at: 'updated',
    }
    expect(
      mapAccountTypeListItem({
        ...row,
        account_type_permissions: [
          { permissions: permission },
          { permissions: [permission] },
          { permissions: null },
        ],
      }).permissions,
    ).toEqual([permission, permission])
    expect(mapAccountTypeListItem(row).permissions).toEqual([])
    expect(
      mapPrivilegeListItem(permission, new Set(['permission'])).isAssigned,
    ).toBe(true)
    expect(mapPrivilegeListItem(permission, new Set()).isAssigned).toBe(false)
  })
})

describe('personnel profile assignment safety', () => {
  it('ignores unassigned profiles and rejects assigning personnel linked to another profile', () => {
    const map = buildAssignedPersonnelProfileMap([
      { id: 'unassigned', personnel_id: null, email: 'none@example.test' },
      { id: 'user', personnel_id: 'person', email: 'unit@example.test' },
    ])
    expect(map.size).toBe(1)
    expect(() =>
      assertPersonnelAssignable({
        selectedPersonnelId: null,
        assignedProfileByPersonnelId: map,
        personnelId: 'new',
      }),
    ).not.toThrow()
    expect(() =>
      assertPersonnelAssignable({
        selectedPersonnelId: 'person',
        assignedProfileByPersonnelId: map,
        personnelId: 'person',
      }),
    ).not.toThrow()
    expect(() =>
      assertPersonnelAssignable({
        selectedPersonnelId: null,
        assignedProfileByPersonnelId: map,
        personnelId: 'person',
      }),
    ).toThrow(expect.objectContaining({ statusCode: 409 }))
    expect(() =>
      assertPersonnelAssignable({
        selectedPersonnelId: 'other',
        assignedProfileByPersonnelId: map,
        personnelId: 'person',
        message: 'Already linked',
      }),
    ).toThrow('Already linked')
  })

  it.each([
    { input: undefined, expected: null },
    { input: null, expected: null },
    { input: false, expected: null },
    { input: ' ', expected: null },
    { input: ' Name ', expected: 'Name' },
  ])('normalizes optional text $input', ({ input, expected }) => {
    expect(normalizeOptionalText(input)).toBe(expected)
  })
})
