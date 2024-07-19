#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-var-requires*/
/* eslint-disable no-undef */
const fs = require('node:fs')
const { join, relative, dirname } = require('node:path')

const IS_WIN = process.platform === 'win32'

if (!process.env.INIT_CWD) return

// TODO: check if we're in a local install
const nodeModules = join(process.env.INIT_CWD, 'node_modules')
if (!fs.existsSync(nodeModules)) return
const typesDir = join(nodeModules, '@types')
if (!fs.existsSync(typesDir)) fs.mkdirSync(typesDir)

// use a relative target, in case the user moves the project
const target = join(typesDir, 'sap__cds')
const src = join(nodeModules, '@cap-js/cds-types')

if (IS_WIN) {
    fs.rmSync(target, { recursive: true, force: true })
    fs.cpSync(join(src, 'dist'), join(target, 'dist'), { recursive: true, force: true })
    fs.cpSync(join(src, 'scripts'), join(target, 'scripts'), { recursive: true, force: true })
    fs.copyFileSync(join(src, 'package.json'), join(target, 'package.json'))
} else {
    try {
        // remove the existing symlink
        fs.unlinkSync(target)
    } catch {
        // symlink did not exist, continue
    }
    const rel = relative(dirname(target), src) // need dirname or we'd land one level above node_modules (one too many "../")
    fs.symlinkSync(rel, target)
}
