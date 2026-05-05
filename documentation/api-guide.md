# API Guide

This document reflects the currently implemented backend API routes under `server/api`.

## Base Information

- **Base path:** `/api`
- **Path params:** Routes use Nuxt-style params such as `[id]` (for example `/api/users/[id]`).
- **Auth/session endpoints:** Available under `/api/auth/*`.
- **Domain alignment:** Endpoint groups are organized around personnel, battalions, companies, deployments, trainings, engagements, account types, and audit logs.

## Authentication

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/api/auth/login` | Authenticate user and create session. |
| POST | `/api/auth/logout` | Invalidate current session. |
| GET | `/api/auth/session` | Fetch current authenticated session context. |

## Users & Access Control

### Users

| Method | Endpoint |
| --- | --- |
| GET | `/api/users` |
| POST | `/api/users` |
| GET | `/api/users/search` |
| GET | `/api/users/[id]` |
| PATCH | `/api/users/[id]` |
| PATCH | `/api/users/[id]/activation` |
| PATCH | `/api/users/[id]/password` |
| GET | `/api/users/[id]/audit-logs` |

### Account types and privileges

| Method | Endpoint |
| --- | --- |
| GET | `/api/account-types` |
| POST | `/api/account-types` |
| GET | `/api/account-types/search` |
| GET | `/api/account-types/[id]` |
| PATCH | `/api/account-types/[id]` |
| DELETE | `/api/account-types/[id]` |
| GET | `/api/privileges` |

## Organization Structure

### Battalions

| Method | Endpoint |
| --- | --- |
| GET | `/api/battalions` |
| POST | `/api/battalions` |
| GET | `/api/battalions/search` |
| GET | `/api/battalions/suggestions` |
| GET | `/api/battalions/[id]` |
| PATCH | `/api/battalions/[id]` |
| DELETE | `/api/battalions/[id]` |
| GET | `/api/battalions/[id]/companies` |
| GET | `/api/battalions/[id]/personnel` |
| GET | `/api/battalions/[id]/equipment` |

### Companies

| Method | Endpoint |
| --- | --- |
| GET | `/api/companies` |
| POST | `/api/companies` |
| GET | `/api/companies/search` |
| GET | `/api/companies/suggestions` |
| GET | `/api/companies/[id]` |
| PATCH | `/api/companies/[id]` |
| DELETE | `/api/companies/[id]` |
| GET | `/api/companies/[id]/personnel` |
| GET | `/api/companies/[id]/equipment` |

### Ranks

| Method | Endpoint |
| --- | --- |
| GET | `/api/ranks` |
| POST | `/api/ranks` |
| DELETE | `/api/ranks/[id]` |
| GET | `/api/ranks/suggestions` |

## Personnel

| Method | Endpoint |
| --- | --- |
| GET | `/api/personnel` |
| POST | `/api/personnel` |
| GET | `/api/personnel/search` |
| GET | `/api/personnel/suggestions` |
| POST | `/api/personnel/batch-upload` |
| GET | `/api/personnel/[id]` |
| PATCH | `/api/personnel/[id]` |
| DELETE | `/api/personnel/[id]` |
| GET | `/api/personnel/[id]/training-records` |
| GET | `/api/personnel/[id]/deployment-records` |
| GET | `/api/personnel/[id]/engagement-records` |
| GET | `/api/personnel/[id]/equipment-issuances` |

## Training Domain

### Trainings

| Method | Endpoint |
| --- | --- |
| GET | `/api/trainings` |
| POST | `/api/trainings` |
| GET | `/api/trainings/search` |
| GET | `/api/trainings/suggestions` |
| GET | `/api/trainings/[id]` |
| PATCH | `/api/trainings/[id]` |
| DELETE | `/api/trainings/[id]` |
| GET | `/api/trainings/[id]/personnel` |

### Training categories

| Method | Endpoint |
| --- | --- |
| GET | `/api/training-categories` |
| POST | `/api/training-categories` |
| GET | `/api/training-categories/search` |
| GET | `/api/training-categories/[id]` |
| PATCH | `/api/training-categories/[id]` |
| DELETE | `/api/training-categories/[id]` |

### Training records

| Method | Endpoint |
| --- | --- |
| GET | `/api/training-records` |
| POST | `/api/training-records` |
| GET | `/api/training-records/search` |
| GET | `/api/training-records/[id]` |
| PATCH | `/api/training-records/[id]` |
| DELETE | `/api/training-records/[id]` |

## Deployment Domain

### Deployments

| Method | Endpoint |
| --- | --- |
| GET | `/api/deployments` |
| POST | `/api/deployments` |
| GET | `/api/deployments/search` |
| GET | `/api/deployments/suggestions` |
| GET | `/api/deployments/[id]` |
| DELETE | `/api/deployments/[id]` |
| PATCH | `/api/deployments/[id]/details` |
| PATCH | `/api/deployments/[id]/location` |
| GET | `/api/deployments/[id]/personnel` |

### Deployment records

| Method | Endpoint |
| --- | --- |
| GET | `/api/deployment-records` |
| POST | `/api/deployment-records` |
| GET | `/api/deployment-records/search` |
| GET | `/api/deployment-records/[id]` |
| PATCH | `/api/deployment-records/[id]` |
| DELETE | `/api/deployment-records/[id]` |

## Engagement Domain

| Method | Endpoint |
| --- | --- |
| GET | `/api/engagements` |
| POST | `/api/engagements` |
| GET | `/api/engagements/search` |
| GET | `/api/engagements/suggestions` |
| GET | `/api/engagements/[id]` |
| PATCH | `/api/engagements/[id]` |
| DELETE | `/api/engagements/[id]` |

## Dashboard & Analytics

| Method | Endpoint |
| --- | --- |
| GET | `/api/dashboard/top-kpis` |
| GET | `/api/dashboard/unit-management` |
| GET | `/api/dashboard/critical-personnel` |
| GET | `/api/dashboard/critical-equipment` |
| GET | `/api/dashboard/equipment-status-overview` |
| GET | `/api/dashboard/location-load-analysis` |
| GET | `/api/dashboard/personnel-deployment-summary` |
| GET | `/api/dashboard/personnel-deployment-history` |
| GET | `/api/dashboard/operational-time-monitoring` |
| GET | `/api/dashboard/near-rotation` |

## Audit

| Method | Endpoint |
| --- | --- |
| GET | `/api/audit/logs` |
| GET | `/api/audit/logs/[id]` |
| GET | `/api/audit/search` |

## File Utilities

| Method | Endpoint |
| --- | --- |
| POST | `/api/files/upload` |

## Notes for Maintainers

- This guide is a route inventory of the current backend implementation.
- If route files are added, renamed, or removed under `server/api`, update this document in the same change set.
