# Change Log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).
The format is based on [Keep a Changelog](http://keepachangelog.com/).

## Version 0.7.0 - tbd

### Added
- `cds.app` typed as express.js application
- `cds.cli` CLI arguments
- `cds.requires` types for MTX services.

### Changed
- Most `cds.requires` entries are now optionals.
- It is possible to connect with CSN model

## Version 0.6.5 - 2024-08-13
### Fixed
- The `@types/sap__cds` link created by the `postinstall` script now also works in monorepo setups where the target `@cap-js/cds-types` might already be preinstalled (often hoisted some levels up).

### Removed
- Removed array-like methods from model parts (`.map`, `.find`, etc.). To still use them, apply spreading to object in question first.

## Version 0.6.4 - 2024-08-05
### Added
- `Service.emit(...)` can now also be called with custom events
- `Service.before(...)` and `Service.after(...)` now accept bound and unbound functions as parameter
- `connect.to (ServiceClass)` as alternative to `'service'` string
- `connect.to ('db')` returning `cds.DatabaseService`

### Changed
- `.before(...)`, `.on(...)`, and `.after(...)` now properly infer inflection when a typer-generated class is passed as second parameter

### Fixed
- `EACH` event has appropriately been renamed `each` to reflect runtime behaviour

## Version 0.6.3 - 2024-07-19
### Fixed
- Installation no longer fails if symlink `@types/sap__cds` exists

## Version 0.6.2 - 2024-07-18
### Fixed
- Symlink `@types/sap__cds` correctly created in case of upgrading `@cap-js/cds-types`.

## Version 0.6.1 - 2024-07-18
### Fixed
- Scripts `postinstall` and `prerelease:ci-fix` now work correctly on windows.

### Changed
- `postinstall` script now creates a relative symlink from `@types/sap__cds` to allow the project to be moved/ renamed.

## Version 0.6.0 - 2024-07-05
This is a prerelease version (`next`) as a preview for the upcoming release of cds 8.
### Changed
- Wrapped all types into an augmented module declaration for `@sap/cds`.
- Added a postinstall script to symlink `@cap-js/cds-types` to `@types/sap__cds` to benefit from the default type resolution mechanism employed by Definitely Typed.

## Version 0.5.0 - 2024-06-20
This is a prerelease version (`next`) as a preview for the upcoming release of cds 8.

### Fixed
- Linked definitions are now available via `cds.linked`, especially `cds.linked.LinkedCSN` and `cds.linked.classes` with its relevant type definitions

## Version 0.4.0 - 2024-05-23
This is a prerelease version (`next`) as a preview for the upcoming release of cds 8.

### Fixed
- Corrected `exist(…)` to `exists(…)`

## Version 0.3.0-beta.1 - 2024-05-23

### Added
- Added signatures for `cds.outboxed` and `cds.unboxed`
- Added signature for `cds.middlewares.add`
- More `cds.env` properties and types
- Exposed types related to `cds.linked` through the facade. Types describing unlinked CSN should generally not be needed, but are still available through `cds.csn.…`

### Changed
- Improved signatures for `cds.env.folders` and `cds.env.i18n` from `any` to a more descriptive type
- `Service.prepend` is no longer async
- All linked classes are now available via `cds.linked.classes` (and partially via the facade)
- Getters in `service` instances now return the appropriate classes. E.g. `service.entities` returns instances of `linked.entity`
- [breaking] Linked definitions are no longer an intersection type of all possible linked classes, but more specific to their actual use (see above). This implies that users may have to narrow the type they are using explicitly, use another getter (see above), or use explicit casts.
- [breaking] Only the `.after('READ', ...)` differentiates between singular and plural entities. In all other cases the plural case is assumed.

### Fixed
- `SELECT.from` and related variants now work on the `.drafts` property and behave like `SELECT.from(<Plural>)`
- `cds.log` can now also be called with the names of log levels
- Reintroduced missing `QueryAPI.tx` and add deprecation note for `QueryAPI.transaction`

## Version 0.2.0 - 2024-01-17

### Added

- Type for special error listener `srv.on('error')`

### Changed

- `source`, `column_expr`, and `predicate` have been converted to partial intersection types. This offers all possible optional properties. You will have to make sure to check their presence when accessing them

### Fixed

- `srv.send` overload to also allow optional headers
- Reflected types like `cds.entity`, `cds.struct`, `cds.Association` are now properly exposed
- `cds.builtin.types` got a more accurate type
- The `LinkedEntity.drafts` property is now optional.  At runtime, it's only set for drafted entities.
- `cds.model` is marked as modifiable (for tests only!)
- `SELECT.from` got its `ref` property back


## Version 0.1.0 - 2023-12-13

### Changed

- Rework of the export structure of the main `cds` facade object, so that e.g. `cds.Request` and `cds.User` work again

### Fixed

- TSDoc comments have a proper structure

## Version 0.0.1 - 2023-12-06

### Added

- Initial release, still with gaps though
