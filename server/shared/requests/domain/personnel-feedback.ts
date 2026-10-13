export interface CreatePersonnelFeedbackRequest {
  feedback: string
  reviewDate: string
  rating?: number | null
  attestAuthorship: boolean
}
