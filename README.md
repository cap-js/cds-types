# cds-types

[![REUSE status](https://api.reuse.software/badge/github.com/cap-js/cds-types)](https://api.reuse.software/info/github.com/cap-js/cds-types)
![Unit Tests passing](https://github.com/cap-js/cds-types/actions/workflows/test.yml/badge.svg)
[![npmjscom](https://img.shields.io/npm/v/@cap-js/cds-types?color=green&label=npmjs.com)](https://www.npmjs.com/package/@cap-js/cds-types)
![downloads](https://img.shields.io/npm/dw/@cap-js/cds-types)
[![deps](https://img.shields.io/librariesio/release/npm/@cap-js/cds-types?label=Dependencies)](https://www.npmjs.com/package/@cap-js/cds-types?activeTab=dependencies)


[![main test](https://img.shields.io/github/actions/workflow/status/cap-js/cds-types/test.yml?label=main%20test)](https://github.com/cap-js/cds-types/actions/workflows/test.yml?query=branch%3Amain)
[![main integration test](https://img.shields.io/github/actions/workflow/status/cap-js/cds-types/integration-test.yml?label=main%20integration-test)](https://github.com/cap-js/cds-types/actions/workflows/integration-test.yml?query=branch%3Amain)
[![main lint](https://img.shields.io/github/actions/workflow/status/cap-js/cds-types/lint.yml?label=main%20lint)](https://github.com/cap-js/cds-types/actions/workflows/lint.yml?query=branch%3Amain)


## About this Project

Contains type definitions for the [Node.js SDK](https://cap.cloud.sap/docs/node.js/) of the SAP Cloud Application Programming Model (CAP).

## Requirements and Setup

Just install package `@sap/cds` into a Javascript or Typescript project, and the types will automatically be available in modern IDEs like VS Code.

Find more information on the APIs in the [Node.js SDK documentation](https://cap.cloud.sap/docs/node.js/).

## Note to Microsoft Windows Users
If you rename your project after you installed the type definitions on Windows, you have to rerun `npm install` to correctly recreate the symlink `node_modules/@types/sap__cds`.

## Support, Feedback, Contributing

### Local Setup

After cloning, just run

```sh
npm run setup
```

which installs all dependencies.

This project is open to feature requests/suggestions, bug reports etc. via [GitHub issues](https://github.com/cap-js/cds-types/issues). Contribution and feedback are encouraged and always welcome. For more information about how to contribute, the project structure, as well as additional contribution information, see our [Contribution Guidelines](CONTRIBUTING.md).


## Security / Disclosure

If you find any bug that may be a security problem, please follow our instructions at [in our security policy](https://github.com/SAP/.github/blob/main/SECURITY.md) on how to report it. Please do not create GitHub issues for security-related doubts or problems.

## Code of Conduct

We as members, contributors, and leaders pledge to make participation in our community a harassment-free experience for everyone. By participating in this project, you agree to abide by its [Code of Conduct](https://github.com/SAP/.github/blob/main/CODE_OF_CONDUCT.md) at all times.

## Licensing

Copyright 2019-2024 SAP SE or an SAP affiliate company and `cds-types` contributors. Please see our [LICENSE](LICENSE) for copyright and license information. Detailed information including third-party components and their licensing/copyright information is available [via the REUSE tool](https://api.reuse.software/info/github.com/cap-js/cds-types).
