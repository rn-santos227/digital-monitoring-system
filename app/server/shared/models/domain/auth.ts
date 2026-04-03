export interface LoginBody {
  identifier?: string
  password?: string
}

export interface AuthenticatedUser {
  id: string
  username: string
  full_name: string | null
}
