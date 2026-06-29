export type GlobalSearchSuggestionDomain = 'personnel' | 'equipment' | 'incident'

export interface GlobalSearchSuggestionItem {
  id: string
  domain: GlobalSearchSuggestionDomain
  title: string
  subtitle: string
  matchedText: string
  redirectTo: string
  score: number
}

export interface GlobalSearchAuthorizedUserPermissions {
  permission_codes: string[]
}

