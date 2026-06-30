export type GlobalSearchSuggestionDomain = 'personnel' | 'equipment' | 'incident'

export interface GlobalSearchSuggestionItem {
  id: string
  domain: GlobalSearchSuggestionDomain
}
