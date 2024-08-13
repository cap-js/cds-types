#!/usr/bin/env node

/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('node:fs')
const { join, relative, dirname, resolve } = require('node:path')

if (!process.env.INIT_CWD) return

const nodeModules = join(process.env.INIT_CWD, 'node_modules')
const typesDir = join(nodeModules, '@types')
// we may have to create node_modules altogether in case of a mono repo
if (!fs.existsSync(typesDir)) fs.mkdirSync(typesDir, {recursive: true})

// use a relative target, in case the user moves the project
const target = join(typesDir, 'sap__cds')
const src = resolvePkg('@cap-js/cds-types') ?? join(nodeModules, '@cap-js/cds-types')
const rel = relative(dirname(target), src) // need dirname or we'd land one level above node_modules (one too many "../")
console.log(`Creating symlink ${target} -> ${rel}`)

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

function resolvePkg(pkg) {
    try {
        const pjson = require.resolve(join(pkg, 'package.json'), { paths: [process.env.INIT_CWD] })
        return resolve(pjson, '..')
    } catch {
        return null
    }
}
