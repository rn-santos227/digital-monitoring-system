export type UserManagementTabId = 'user-profile' | 'user-account'

export interface UserProfileRecord {
  id: string
  fullName: string
  battalion: string
  company: string
  rank: string
  status: 'Active' | 'Reserve'
}

export interface UserAccountRecord {
  id: string
  username: string
  email: string
  role: string
  accountStatus: 'Enabled' | 'Locked'
}

export interface UsersState {
  profileItems: UserProfileRecord[]
  accountItems: UserAccountRecord[]
  isLoading: boolean
}
