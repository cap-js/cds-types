#!/usr/bin/env node

/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */

// Releasing a pre-release version, like 0.x.y-beta.z causes `npm ci` to install
// the latest version of cds-types from npmjs as dependency of @sap/cds instead,
// as pre-release suffixes do not satisfy the semver specified in @sap/cds.
// This causes the tests to run against an outdated version of cds-types,
// often resulting in failing tests (and a block of any release).
// This script patches the dependency in node_modules/@cap/cds to the
// local version of cds-types, so the tests run against the correct version.


const { existsSync } = require('fs')
const { rm } = require('fs/promises')
const path = require('path')

;(async () => {
    const faultyDep = path.resolve('node_modules', '@sap', 'cds', 'node_modules', '@cap-js', 'cds-types')
    if (existsSync(faultyDep)) {
        await rm(faultyDep, { recursive: true });
    }
})()

