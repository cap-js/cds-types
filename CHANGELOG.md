# Change Log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).
The format is based on [Keep a Changelog](http://keepachangelog.com/).

## Version 0.2.0 - tbd

### Added

- Type for special error listener `srv.on('error')`

### Fixed

- `srv.send` overload to also allow optional headers
- Reflected types like `cds.entity`, `cds.struct`, `cds.Association` are now properly exposed
- `cds.builtin.types` got a more accurate type
- The `LinkedEntity.drafts` property is now optional.  At runtime, it's only set for drafted entities.
- `cds.model` is marked as modifiable (for tests only!)


## Version 0.1.0 - 2023-12-13

### Changed

- Rework of the export structure of the main `cds` facade object, so that e.g. `cds.Request` and `cds.User` work again.

### Fixed

- TSDoc comments have a proper structure

## Version 0.0.1 - 2023-12-06

### Added

- Initial release, still with gaps though
