import { describe, expect, it } from 'vitest'

import {
  validateDateRangeFields,
  validateEmailField,
  validateField,
  validateFields,
} from '@/app/utils/field-validation'

describe('shared form field validation', () => {
  it('normalizes values and distinguishes optional and required fields', () => {
    expect(
      validateField({ field: 'name', label: 'Name', value: undefined }),
    ).toEqual({ isValid: true, value: '', error: '' })
    expect(
      validateField({
        field: 'name',
        label: 'Name',
        value: ' ',
        required: true,
      }).error,
    ).toBe('Name is required.')
    expect(
      validateField({ field: 'name', label: 'Name', value: ' Jane ' }).value,
    ).toBe('Jane')
    expect(
      validateField({
        field: 'password',
        label: 'Password',
        value: ' secret ',
        trim: false,
      }).value,
    ).toBe(' secret ')
  })

  it.each([
    [{ minLength: 4 }, 'abc', 'Name must be at least 4 characters.'],
    [{ maxLength: 3 }, 'abcd', 'Name must not exceed 3 characters.'],
    [{ pattern: /^[A-Z]+$/ }, 'abc', 'Name is invalid.'],
    [
      { pattern: /^[A-Z]+$/, patternMessage: 'Use capitals.' },
      'abc',
      'Use capitals.',
    ],
  ])('reports the constraint %j', (constraint, value, error) => {
    expect(
      validateField({ field: 'name', label: 'Name', value, ...constraint }),
    ).toEqual({ isValid: false, value, error })
  })

  it('accepts exact length boundaries and aggregates only invalid fields', () => {
    expect(
      validateField({
        field: 'name',
        label: 'Name',
        value: 'ABC',
        minLength: 3,
        maxLength: 3,
        pattern: /^[A-Z]+$/,
      }).isValid,
    ).toBe(true)
    expect(
      validateFields([
        { field: 'name', label: 'Name', value: ' Jane ' },
        { field: 'email', label: 'Email', value: '', required: true },
      ]),
    ).toEqual({
      isValid: false,
      values: { name: 'Jane', email: '' },
      errors: { email: 'Email is required.' },
    })
    expect(validateFields([])).toEqual({
      isValid: true,
      values: {},
      errors: {},
    })
  })

  it('accepts valid email and reports missing or malformed email', () => {
    expect(
      validateEmailField('email', 'Email', ' test@example.test ').isValid,
    ).toBe(true)
    expect(validateEmailField('email', 'Email', 'invalid').error).toBe(
      'Email must be a valid email address.',
    )
    expect(validateEmailField('email', 'Email', '').error).toBe(
      'Email is required.',
    )
  })

  it.each([
    ['', '', {}],
    ['2026-10-04', '2026-10-04', {}],
    ['2026/10/04', '', { startDate: 'Start date must use YYYY-MM-DD format.' }],
    ['', '04-10-2026', { endDate: 'End date must use YYYY-MM-DD format.' }],
    [
      '2026-10-04',
      '2026-10-03',
      { endDate: 'End date must be on or after the start date.' },
    ],
  ])('validates date range %s / %s', (start, end, errors) => {
    expect(validateDateRangeFields(start, end)).toEqual(errors)
  })
})
