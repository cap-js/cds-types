# Change Log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](https://semver.org/).
The format is based on [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased]

### Added
- Allow array-like params in CQN.expr via `{ list: [...] }` syntax
- Types for `cds.error()`
- `GetRequest` and `PostRequest` types
### Changed
### Deprecated
### Removed
### Fixed
### Security

## [0.14.0] - 2025-08-28

### Added
- Types for alpha task scheduling API
- Types for `SELECT.pipeline()` and `SELECT.foreach()`
- Support deep partial `INSERT` / `UPDATE`
### Changed
- `req.subject` now points to the bound entity type when implementing handlers for bound actions.
- `service.dispatch` now also supports passing request objects, or arrays thereof.
### Deprecated
### Removed
### Fixed
- `cqn.SELECT.where` now accepts mixed `ref`s, `val`s, and `string`s, as described in the documentation.
### Security

## [0.13.0] - 2025-07-04

### Added
- Types for compile events: `compile.for.runtime`, `compile.to.dbx`, `compile.to.edmx`
### Changed
### Deprecated
### Removed
### Fixed
- The peer dependency to `@sap/cds-dk` is now optional, but needs to be installed explicitly in application projects.
### Security

## [0.12.0] - 2025-06-05

### Added
- Added type export for types from cds-dk. These types are only available if `@sap/cds-dk` is also present in the project.
- Optional parameter 'options' in `req.reply`. The object can contain, for example, mimetype and/or filename.
### Changed
- [breaking] Bump dependency to `@sap/cds` to `>=9.0.0`. This means starting with this version, `cds-types` is supposed to be used alongside `@sap/cds@9`!
- `req.params` always returns an array of objects
### Deprecated
### Removed
### Fixed
### Security

## [0.11.0] - 2025-06-05

### Added
- Syntactically allow infix filters in `SELECT` clauses through tagged templates. These filters are not semantically checked for validity
- Added `cds.linked.LinkedDefinition` as alias for `cds.linked.classes.any_`
- Added `doc?: string` to `cds.linked.classes.any_`
- Add overload for `Service.emit` to offer improved type support when using an event type emitted by cds-typer.
- Added programmatic draft actions.
- Added types for `util.path`, `util.fs`, and `util.inspect`.

### Changed
- [breaking] Corrected the way the default export is generated. This also gets rid of the export `default_2` that was mistakenly exposed before.
- Renamed `CQN` property `INSERT.as` to `INSERT.from`
- `Request.reject(…)` now returns `never` instead of `Error`, as its implementation always throws.

### Deprecated
### Removed
- Deprecated `INSERT.from` method of `cds.ql` API

### Fixed
### Security

## [0.10.0] - 2025-04-01
### Added
- Added support for new builtin type `cds.Map`
- Added types for `SELECT.hints()` of `cds.ql` API
- Added types for `.bind(Service)` to all queries.
- Added types for `i18n` module

### Changed
- `CHANGELOG.md` and `LICENSE` files are no longer part of the npm package.

### Deprecated
### Removed
### Fixed
### Security

## [0.9.0] - 25-01-13
### Added
- Added missing properties for `log` in `cds.env`
- Added overload for `service.read` to be called with a `ref`
- Added `HandlerFunction.parameters.req` and `HandlerFunction.returns` to type handler functions that are not declared as lambdas more conveniently
- Added types for anonymous, privileged, and default user

### Changed
- removed dependency to `@types/express: ^4.17.21` in favour of a peerDependency to `@types/express: >=4`

### Removed
- [breaking] Removed type `TypedRequest<T>` and replaced it with just `Request<T>`
- Removed deprecated `cds.Float` CSN property type

### Fixed

- Use `Required` instead of `DeepRequired` in projection function to avoid complexity errors from TypeScript
- Added missing type inference for `.set`/`.with` of `UPDATE`
- Added missing type inference for `.entries` of `UPSERT` and `INSERT`
- Variants of `SELECT.one(T)` will now return `T | null`, instead of `T`
- Documentation link to `srv.emit`

## [0.8.0] - 24-11-26

### Fixed
- Added missing type for `Request.before('commit', …)`
- Added missing types for `Request.on('succeeded' | 'failed' | 'done', …)`
- Added missing type for `cds.test.log`
- Added missing `.ref` in CQN queries
- Added missing `.forUpdate`, `.forShareLock`, and `.search` in `cqn.SELECT`
- Calling `SELECT.one('...').from(Plural)` now properly returns a single instance


## [0.7.0] - 24-10-24

### Fixed
- Added missing type for `cds.context.model`
- Added missing type for `req.query.elements`
- Made constructors for query parts (`SELECT`, `UPDATE`, `DELETE`, ...) private, as they should only be accessed statically
- `SELECT` returns a single instance now when specifying a primary key

### Added
- `cds.app` typed as express.js application
- `cds.cli` CLI arguments
- `cds.requires` types for MTX services
- `cds.utils.colors` types
- The CQL methods `.where` and `.having` now suggest property names for certain overloads.
- `Service.before/on/after(event, target...)` now accept also an array of typer-generated classes in the `target` parameter
- `localized` variants to `SELECT`

### Changed
- Most `cds.requires` entries are now optionals.
- `cds.connect.to` now also supports using a precompiled model.
- Properties of entities are no longer optional in projections, eliminating the need to perform optional chaining on them when using nested projections

## [0.6.5] - 2024-08-13
### Fixed
- The `@types/sap__cds` link created by the `postinstall` script now also works in monorepo setups where the target `@cap-js/cds-types` might already be preinstalled (often hoisted some levels up).

### Removed
- Removed array-like methods from model parts (`.map`, `.find`, etc.). To still use them, apply spreading to object in question first.

## [0.6.4] - 2024-08-05
### Added
- `Service.emit(...)` can now also be called with custom events
- `Service.before(...)` and `Service.after(...)` now accept bound and unbound functions as parameter
- `connect.to (ServiceClass)` as alternative to `'service'` string
- `connect.to ('db')` returning `cds.DatabaseService`

### Changed
- `.before(...)`, `.on(...)`, and `.after(...)` now properly infer inflection when a typer-generated class is passed as second parameter

### Fixed
- `EACH` event has appropriately been renamed `each` to reflect runtime behaviour

## [0.6.3] - 2024-07-19
### Fixed
- Installation no longer fails if symlink `@types/sap__cds` exists

## [0.6.2] - 2024-07-18
### Fixed
- Symlink `@types/sap__cds` correctly created in case of upgrading `@cap-js/cds-types`.

## [0.6.1] - 2024-07-18
### Fixed
- Scripts `postinstall` and `prerelease:ci-fix` now work correctly on windows.

### Changed
- `postinstall` script now creates a relative symlink from `@types/sap__cds` to allow the project to be moved/ renamed.

## [0.6.0] - 2024-07-05
This is a prerelease version (`next`) as a preview for the upcoming release of cds 8.
### Changed
- Wrapped all types into an augmented module declaration for `@sap/cds`.
- Added a postinstall script to symlink `@cap-js/cds-types` to `@types/sap__cds` to benefit from the default type resolution mechanism employed by Definitely Typed.

## [0.5.0] - 2024-06-20
This is a prerelease version (`next`) as a preview for the upcoming release of cds 8.

### Fixed
- Linked definitions are now available via `cds.linked`, especially `cds.linked.LinkedCSN` and `cds.linked.classes` with its relevant type definitions

## [0.4.0] - 2024-05-23
This is a prerelease version (`next`) as a preview for the upcoming release of cds 8.

### Fixed
- Corrected `exist(…)` to `exists(…)`

## [0.3.0-beta.1] - 2024-05-23

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

## [0.2.0] - 2024-01-17

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


## [0.1.0] - 2023-12-13

### Changed

- Rework of the export structure of the main `cds` facade object, so that e.g. `cds.Request` and `cds.User` work again

### Fixed

- TSDoc comments have a proper structure

## [0.0.1] - 2023-12-06

### Added

- Initial release, still with gaps though
