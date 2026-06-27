# API Guide

This document reflects the currently implemented backend API routes under `server/api`.

## Base Information

- **Base path:** `/api`
- **Path params:** Routes use Nuxt-style params in files such as `[id]`; this guide renders them as `:id` (for example `/api/users/:id`).
- **Auth/session endpoints:** Available under `/api/auth/*`.
- **Domain alignment:** Endpoint groups are organized around personnel, battalions, companies, training records, deployment records, engagement records, equipment categories/items/assets/issuances, incidents, application settings, and audit logs.

## Route Inventor

| Method | Endpoint |
| --- | --- |
| DELETE | `/api/account-types/:id` |
| GET | `/api/account-types/:id` |
| PATCH | `/api/account-types/:id` |
| GET | `/api/account-types` |
| POST | `/api/account-types` |
| GET | `/api/account-types/search` |
| GET | `/api/application-settings` |
| PATCH | `/api/application-settings` |
| GET | `/api/audit/logs/:id` |
| GET | `/api/audit/logs` |
| POST | `/api/audit/print` |
| GET | `/api/audit/search` |
| POST | `/api/auth/login` |
| POST | `/api/auth/logout` |
| GET | `/api/auth/session` |
| POST | `/api/battalions/:id/assign` |
| GET | `/api/battalions/:id/companies` |
| GET | `/api/battalions/:id/equipment` |
| DELETE | `/api/battalions/:id` |
| GET | `/api/battalions/:id` |
| PATCH | `/api/battalions/:id` |
| GET | `/api/battalions/:id/personnel` 
| GET | `/api/battalions` |
| POST | `/api/battalions` |
| GET | `/api/battalions/search` |
| GET | `/api/battalions/suggestions` |
| POST | `/api/companies/:id/assign` |
| GET | `/api/companies/:id/equipment` |
| DELETE | `/api/companies/:id` |
| GET | `/api/companies/:id` |
| PATCH | `/api/companies/:id` |
| GET | `/api/companies/:id/personnel` |
| GET | `/api/companies` |
| POST | `/api/companies` |
| GET | `/api/companies/search` |
| GET | `/api/companies/suggestions` |
| GET | `/api/dashboard/critical-equipment` |
| GET | `/api/dashboard/critical-personnel` |
| GET | `/api/dashboard/equipment-status-overview` |
| GET | `/api/dashboard/location-load-analysis` |
| GET | `/api/dashboard/near-rotation` |
| GET | `/api/dashboard/operational-time-monitoring` |
| GET | `/api/dashboard/personnel-deployment-history` |
| GET | `/api/dashboard/personnel-deployment-summary` |
| GET | `/api/dashboard/top-kpis` |
| GET | `/api/dashboard/unit-management` |
| DELETE | `/api/deployment-records/:id` |
| GET | `/api/deployment-records/:id` |
| PATCH | `/api/deployment-records/:id` |
| PATCH | `/api/deployment-records/:id/location` |
| GET | `/api/deployment-records` |
| POST | `/api/deployment-records` |
| GET | `/api/deployment-records/search` |
| PATCH | `/api/deployments/:id/details` |
| DELETE | `/api/deployments/:id` |
| GET | `/api/deployments/:id` |
| PATCH | `/api/deployments/:id/location` |
| GET | `/api/deployments/:id/personnel` |
| GET | `/api/deployments` |
| POST | `/api/deployments` |
| GET | `/api/deployments/kpis` |
| GET | `/api/deployments/search` |
| GET | `/api/deployments/suggestions` |
| DELETE | `/api/engagement-records/:id` |
| GET | `/api/engagement-records/:id` |
| GET | `/api/engagement-records` |
| POST | `/api/engagement-records` |
| GET | `/api/engagement-records/search` |
| DELETE | `/api/engagements/:id` |
| GET | `/api/engagements/:id` |
| PATCH | `/api/engagements/:id` |
| GET | `/api/engagements/:id/personnel` |
| GET | `/api/engagements` |
| POST | `/api/engagements` |
| GET | `/api/engagements/kpis` |
| GET | `/api/engagements/search` |
| GET | `/api/engagements/suggestions` |
| DELETE | `/api/equipment-assets/:id` |
| GET | `/api/equipment-assets/:id` |
| PATCH | `/api/equipment-assets/:id` |
| GET | `/api/equipment-assets` |
| POST | `/api/equipment-assets` |
| GET | `/api/equipment-assets/kpis` |
| GET | `/api/equipment-assets/search` |
| GET | `/api/equipment-assets/suggestions` |
| DELETE | `/api/equipment-categories/:id` |
| GET | `/api/equipment-categories/:id` |
| PATCH | `/api/equipment-categories/:id` |
| GET | `/api/equipment-categories/:id/items` |
| GET | `/api/equipment-categories` |
| POST | `/api/equipment-categories` |
| GET | `/api/equipment-categories/kpis` |
| GET | `/api/equipment-categories/search` |
| GET | `/api/equipment-categories/suggestions` |
| DELETE | `/api/equipment-issuances/:id` |
| GET | `/api/equipment-issuances/:id` |
| PATCH | `/api/equipment-issuances/:id` |
| GET | `/api/equipment-issuances` |
| POST | `/api/equipment-issuances` |
| GET | `/api/equipment-issuances/search` |
| GET | `/api/equipment-items/:id/battalions` |
| GET | `/api/equipment-items/:id/companies` |
| DELETE | `/api/equipment-items/:id` |
| GET | `/api/equipment-items/:id` |
| PATCH | `/api/equipment-items/:id` |
| GET | `/api/equipment-items/:id/personnel` |
| GET | `/api/equipment-items` |
| POST | `/api/equipment-items` |
| GET | `/api/equipment-items/kpis` |
| GET | `/api/equipment-items/search` |
| GET | `/api/equipment-items/suggestions` |
| POST | `/api/files/upload` |
| GET | `/api/incident-types/suggestions` |
| DELETE | `/api/incidents/:id` |
| GET | `/api/incidents/:id` |
| PATCH | `/api/incidents/:id/deployment` |
| PATCH | `/api/incidents/:id/details` |
| PATCH | `/api/incidents/:id/equipment` |
| PATCH | `/api/incidents/:id/location` |
| PATCH | `/api/incidents/:id/personnel` |
| PATCH | `/api/incidents/:id/status` |
| GET | `/api/incidents` |
| POST | `/api/incidents` |
| GET | `/api/incidents/kpis` |
| GET | `/api/incidents/search` |
| GET | `/api/incidents/suggestions` |
| POST | `/api/personnel/:id/deployment-record` |
| GET | `/api/personnel/:id/deployment-records` |
| POST | `/api/personnel/:id/engagement-record` |
| GET | `/api/personnel/:id/engagement-records` |
| GET | `/api/personnel/:id/equipment-issuances` |
| DELETE | `/api/personnel/:id` |
| GET | `/api/personnel/:id` |
| PATCH | `/api/personnel/:id` |
| POST | `/api/personnel/:id/training-record` |
| GET | `/api/personnel/:id/training-records` |
| POST | `/api/personnel/batch-upload` |
| GET | `/api/personnel` |
| POST | `/api/personnel` |
| GET | `/api/personnel/kpis` |
| GET | `/api/personnel/locations` |
| GET | `/api/personnel/search` |
| GET | `/api/personnel/suggestions` |
| GET | `/api/privileges` |
| DELETE | `/api/ranks/:id` |
| GET | `/api/ranks` |
| POST | `/api/ranks` |
| GET | `/api/ranks/suggestions` |
| DELETE | `/api/training-categories/:id` |
| GET | `/api/training-categories/:id` |
| PATCH | `/api/training-categories/:id` |
| GET | `/api/training-categories` |
| POST | `/api/training-categories` |
| GET | `/api/training-categories/search` |
| DELETE | `/api/training-records/:id` |
| GET | `/api/training-records/:id` |
| PATCH | `/api/training-records/:id` |
| GET | `/api/training-records` |
| POST | `/api/training-records` |
| GET | `/api/training-records/search` |
| DELETE | `/api/trainings/:id` |
| GET | `/api/trainings/:id` |
| PATCH | `/api/trainings/:id` |
| GET | `/api/trainings/:id/personnel` |
| GET | `/api/trainings` |
| POST | `/api/trainings` |
| GET | `/api/trainings/kpis` |
| GET | `/api/trainings/search` |
| GET | `/api/trainings/suggestions` |
| GET | `/api/units/kpis` |
| PATCH | `/api/users/:id/activation` |
| GET | `/api/users/:id/audit-logs` |
| GET | `/api/users/:id` |
| PATCH | `/api/users/:id` |
| PATCH | `/api/users/:id/password` |
| GET | `/api/users` |
| POST | `/api/users` |
| GET | `/api/users/kpis` |
| GET | `/api/users/search` |

## Endpoint Families

- **Authentication:** `/api/auth/login`, `/api/auth/logout`, and `/api/auth/session` manage local session lifecycle.
- **Users and RBAC:** `/api/users`, `/api/account-types`, and `/api/privileges` cover user administration, account type permissions, activation, password changes, and audit history.
- **Organization structure:** `/api/battalions`, `/api/companies`, `/api/ranks`, and `/api/units/kpis` support unit administration, assignment flows, suggestions, and unit-level KPI summaries.
- **Personnel:** `/api/personnel` supports personnel CRUD, search, suggestions, KPI/location summaries, batch upload, and related training/deployment/engagement/equipment records.
- **Training, deployment, and engagement records:** `/api/trainings`, `/api/training-categories`, `/api/training-records`, `/api/deployments`, `/api/deployment-records`, `/api/engagements`, and `/api/engagement-records` provide record management plus domain KPI and personnel relationship endpoints.
- **Equipment:** `/api/equipment-categories`, `/api/equipment-items`, `/api/equipment-assets`, and `/api/equipment-issuances` cover equipment taxonomy, inventory assets, issuances, suggestions, search, KPI summaries, and relationships to battalions, companies, and personnel.
- **Incidents:** `/api/incidents` and `/api/incident-types/suggestions` cover incident create/read/delete flows, section-specific updates, search, suggestions, and KPI summaries.
- **Dashboard and analytics:** `/api/dashboard/*` provides aggregate operational widgets for personnel, equipment, deployment, location load, rotation, and unit management views.
- **Application settings:** `/api/application-settings` reads and updates singleton runtime configuration such as app identity, localization, theme, map defaults, code prefixes, and reminder/retention toggles.
- **Audit and file utilities:** `/api/audit/*` exposes audit log listing/search/detail/print routes, and `/api/files/upload` handles uploads.

## Notes for Maintainers

- This guide is a route inventory of the current backend implementation.
- If route files are added, renamed, or removed under `server/api`, update this document in the same change set.
- Mutation routes should keep RBAC checks and audit logging aligned with the repository backend rules.


## Incident Update Endpoints

Equipment incident updates are split by section. The general `PATCH /api/incidents/:id` route is not available; clients should call the focused endpoint that matches the fields being changed.

All incident update endpoints:

- Require an authenticated user with one of the incident mutation permissions (`equipment.maintain` or `equipment.manage`).
- Return `{ "ok": true }` on success.
- Reject empty payloads with a `400` response.
- Validate referenced records before applying relationship changes.
- Record management audit logs for successful and failed mutation attempts.

| Method | Endpoint | Body fields | Notes |
| --- | --- | --- | --- |
| PATCH | `/api/incidents/:id/details` | `incidentNo`, `incidentTypeId`, `incidentDate`, `description`, `resolution`, `remarks` | Updates descriptive incident details. `incidentNo`, `incidentTypeId`, `incidentDate`, and `description` cannot be empty when provided. `incidentDate` must use `YYYY-MM-DD`. |
| PATCH | `/api/incidents/:id/equipment` | `equipmentAssetId` | Updates the related equipment asset. `equipmentAssetId` is required when provided and must reference an existing equipment asset. |
| PATCH | `/api/incidents/:id/personnel` | `personnelId` | Updates or clears the related personnel. Non-empty values must reference an existing personnel record; `null` clears the relationship. |
| PATCH | `/api/incidents/:id/deployment` | `deploymentId` | Updates or clears the related deployment record. Non-empty values must reference an existing deployment record; `null` clears the relationship. |
| PATCH | `/api/incidents/:id/location` | `location`, `locationLatitude`, `locationLongitude` | Updates incident location text and coordinates. Latitude must be between `-90` and `90`; longitude must be between `-180` and `180`; `null` clears optional values. |
| PATCH | `/api/incidents/:id/status` | `investigationStatusId` | Updates or clears the investigation status. Non-empty values must reference an existing investigation status; `null` clears the status. |
