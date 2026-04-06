import { defineStore } from 'pinia'
import { AUTH_API_ENDPOINTS } from '../constants/api.constants'

interface SessionUser {
  id: string
  username: string
  fullName: string | null
}

interface SessionResponse {
  ok: boolean
  user: SessionUser
}

interface LoginPayload {
  identifier: string
  password: string
}

