# Design Decisions

## 2025-11-11
- **Separation of concerns**
  App (UI/orchestration) vs. Library (business logic).
- **PII split**
  Sensitive identifiers (henkilötunnus, IBAN) stored in `PII_Employees`, shared with limited users.
- **Three-layer naming**
  UI label (fi) → internal key → sheet header.  Keeps migrations easy.
- **Schema versioning**
  Current version: v0.1. Future changes documented in `SCHEMA.md` + small `migrate_*` scripts.
