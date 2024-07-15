#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-var-requires*/
/* eslint-disable no-undef */
const fs = require('node:fs')
const { platform } = require('node:os')
const { join } = require('node:path')

const IS_WIN = platform() === 'win32'

if (!process.env.INIT_CWD) return
// TODO: check if were in a local install
const nodeModules = join(process.env.INIT_CWD, 'node_modules')
if (!fs.existsSync(nodeModules)) return
const typesDir = join(nodeModules, '@types')
if (!fs.existsSync(typesDir)) fs.mkdirSync(typesDir)

fs.symlinkSync(join(nodeModules, '@cap-js/cds-types'), join(typesDir, 'sap__cds'), IS_WIN ? 'junction' : undefined)
