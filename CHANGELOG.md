# Change Log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).
The format is based on [Keep a Changelog](http://keepachangelog.com/).

## Version 0.3.0 - tbd

### Added
- Added signatures for `cds.outboxed` and `cds.unboxed`
- Added signature for `cds.middlewares.add`

### Changed
- Improved signatures for `cds.env.folders` and `cds.env.i18n` from `any` to a more descriptive type
- `Service.prepend` is no longer async
- All linked classes are now available via `cds.linked.classes` (and partially via the facade)
- Getters in `service` instances now return the appropriate classes. E.g. `service.entities` returns instances of `linked.entity`
- [breaking] Linked definitions are no longer an intersection type of all possible linked classes, but more specific to their actual use (see above). This implies that users may have to narrow the type they are using explicitly, use another getter (see above), or use explicit casts.

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
