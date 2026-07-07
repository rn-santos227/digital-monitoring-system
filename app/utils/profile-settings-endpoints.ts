import { USER_MANAGEMENT_API_ENDPOINTS, API_LOADING_MESSAGES } from '~/constants/api.constants'
import type { ProfileDetailsPayload, ProfileEmailPayload, ProfileOtherDetailsPayload, ProfilePasswordPayload } from '~/types/domain/profile'
import { withApiLoading } from '~/utils/api-request'
import { createSessionHeaders } from '~/utils/auth-session'

