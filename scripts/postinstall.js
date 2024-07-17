#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-var-requires*/
/* eslint-disable no-undef */
const fs = require('node:fs')
const { platform } = require('node:os')
const { join, relative, dirname } = require('node:path')

const IS_WIN = platform() === 'win32'

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
fs.symlinkSync(rel, target, IS_WIN ? 'junction' : undefined)
