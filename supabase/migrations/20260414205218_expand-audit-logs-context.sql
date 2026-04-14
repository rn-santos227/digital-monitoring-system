alter table if exists public.audit_logs
  add column if not exists request_data jsonb null,
  add column if not exists response_data jsonb null,
  add column if not exists request_headers jsonb null,
  add column if not exists ip_address inet null,
  add column if not exists status_code integer null;

create index if not exists audit_logs_ip_address_idx on public.audit_logs (ip_address);
create index if not exists audit_logs_status_code_idx on public.audit_logs (status_code);
