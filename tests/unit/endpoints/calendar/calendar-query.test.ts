import { describe, expect, it } from 'vitest'

import { parseCalendarEventsQuery } from '../../../../server/shared/validations/domain/calendar'

describe('calendar endpoint queries', () => {
 it('resolves a complete week around the requested date', () => {
    expect(parseCalendarEventsQuery({

    })).toEqual({

    })
 })
})
