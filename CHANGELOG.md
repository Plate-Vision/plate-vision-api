# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/). The package version remains `1.0.0`; the refactored state has not been released or merged into `main`.

## [Unreleased]

### Added

- Jest regression tests covering plate processing, parking writes, actual Nest dependency initialization, controller delegation, reads, authentication, validation, pagination and repository transaction outcomes.
- A 50% minimum global line coverage gate, coverage reports, a tracked dependency lockfile, and explicit runtime dependencies for existing UUID and dotenv imports.
- Husky pre-commit lint/format checks, commit-msg Conventional Commit validation, and matching GitHub Actions quality and commit checks.
- Six presentation blocks and their index, measured baseline/final reports, a complete file inventory and a reproducible HTTP/PostgreSQL original-versus-refactored demonstration.
- A pull request template with smell, technique, regression test, lint, coverage and peer review checklists.

### Changed

- Renamed pure plate and parking transformations and removed unnecessary asynchronous mapping.
- Centralized parking date ordering validation without changing manual or AI fallback behavior.
- Passed focused providers to the plate/parking/vehicle processing path and removed an unnecessary service-level forward reference.
- Extracted per-plate processing, reused common parking input data, flattened guard clauses and simplified save returns.
- Replaced literal HTTP codes with Nest HttpStatus constants without changing response codes or messages.
- Applied the existing formatter and resolved lint failures and unused imports across the source tree; database SQL remains unchanged.

### Fixed

- Prevented capture of an uninitialized parking provider during Nest dependency injection after narrowing provider dependencies, verified by a real Nest initialization regression test and HTTP/PostgreSQL comparison.

[Unreleased]: https://github.com/Plate-Vision/plate-vision-api/compare/original...refactor/clean-code-project
