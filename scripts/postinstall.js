#!/usr/bin/env node

/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require('node:fs')
const { join, relative, dirname } = require('node:path')

if (!process.env.INIT_CWD) return
// TODO: check if were in a local install
const nodeModules = join(process.env.INIT_CWD, 'node_modules')
if (!fs.existsSync(nodeModules)) return
const typesDir = join(nodeModules, '@types')
if (!fs.existsSync(typesDir)) fs.mkdirSync(typesDir)

// use a relative target, in case the user moves the project
const target = join(typesDir, 'sap__cds')
const src = join(nodeModules, '@cap-js/cds-types')
const rel = relative(dirname(target), src) // need dirname or we'd land one level above node_modules (one too many "../")

// remove the existing symlink
try {
    fs.unlinkSync(target)
} catch {
    // symlink did not exist, continue
}

try {
    // 'junction' is needed to make it work on windows, others ignore
    fs.symlinkSync(rel, target, 'junction')
} catch (e) {
    if (e.code !== 'EEXIST') throw e
    // else: symlink exists (the previous unlink hasn't worked), ignore
}
