export const PERSONNEL_FEEDBACK_SELECT_COLUMNS =
  'id,personnel_id,feedback,review_date,rating,author_user_id,author_personnel_id,author_name,author_title,author_rank,author_service_number,officiated_at'
export const PERSONNEL_FEEDBACK_OFFICIAL_SELECT_COLUMNS =
  'id,full_name,is_active,personnel:personnel!user_profiles_personnel_id_fkey(id,service_number,first_name,middle_name,last_name,position,rank:ranks(code,name))'
export const PERSONNEL_FEEDBACK_MAX_LENGTH = 6000
export const PERSONNEL_FEEDBACK_CREATE_PERMISSION = 'personnel.feedback'
export const PERSONNEL_FEEDBACK_CREATE_ACTION = 'PERSONNEL_FEEDBACK_OFFICIATE'
export const PERSONNEL_FEEDBACK_ENDPOINT = '/api/personnel/:id/performance-feedback'
