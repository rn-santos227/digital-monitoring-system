export interface PersonnelFeedbackValues {
  feedback: string
  reviewDate: string
  rating: number | null
  attestAuthorship: boolean
}

export interface PersonnelFeedbackItem {
  id: string
  personnelId: string
  feedback: string
  reviewDate: string
  rating: number | null
  authorUserId: string
  authorPersonnelId: string
  authorName: string
  authorTitle: string | null
  authorRank: string
  authorServiceNumber: string
  officiatedAt: string
}

export interface PersonnelFeedbackRow {
  id: string
  personnel_id: string
  feedback: string
  review_date: string
  rating: number | null
  author_user_id: string
  author_personnel_id: string
  author_name: string
  author_title: string | null
  author_rank: string
  author_service_number: string
  officiated_at: string
}

export interface PersonnelFeedbackOfficialRow {
  id: string
  full_name: string
  is_active: boolean
  personnel: {
    id: string
    service_number: string
    first_name: string
    middle_name: string | null
    last_name: string
    position: string | null
    rank: { code: string; name: string } | { code: string; name: string }[] | null
  } | {
    id: string
    service_number: string
    first_name: string
    middle_name: string | null
    last_name: string
    position: string | null
    rank: { code: string; name: string } | { code: string; name: string }[] | null
  }[] | null
}

export interface PersonnelFeedbackOfficial {
  userId: string
  personnelId: string
  name: string
  rank: string
  serialNumber: string
  title: string | null
}
