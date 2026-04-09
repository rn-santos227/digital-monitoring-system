alter function public.set_updated_at()
  set search_path = public;

alter function public.set_audit_user(uuid)
  set search_path = public;

alter function public.expire_auth_sessions()
  set search_path = public;

alter function public.validate_personnel_unit_assignment()
  set search_path = public;

alter function public.validate_equipment_asset_assignment()
  set search_path = public;

alter function public.validate_equipment_issuance_assignment()
  set search_path = public;
