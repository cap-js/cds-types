#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-var-requires*/
/* eslint-disable no-undef */
const fs = require('node:fs')
const { join } = require('node:path')

if (!process.env.INIT_CWD) return
// TODO: check if were in a local install
const nodeModules = join(process.env.INIT_CWD, 'node_modules')
if (!fs.existsSync(nodeModules)) return
const typesDir = join(nodeModules, '@types')
if (!fs.existsSync(typesDir)) fs.mkdirSync(typesDir)
fs.symlink(join(nodeModules, '@cap-js', 'cds-types'), join(typesDir, 'sap__cds'), () => {})