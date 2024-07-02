#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-var-requires*/
/* eslint-disable no-undef */
const { readFile, writeFile } = require('fs/promises')

/** @param {string} src */
function _getImports (src) {
  const named = src.matchAll(/import \* as (.*) from '(.*)'/g) ?? []
  const destructured = src.matchAll(/import { (.*) } from '(.*)'/g) ?? []

  return {
    named: [...named].map(([,alias, package]) => ({
      alias,
      package
    })),
    destructured: [...destructured].map(([, props, package]) => ({
      package,
      properties: props.split(', ').map(p => p.trim())
    }))
  }
}

/**
 * As we want to use model augmentation for @sap/cds, we need to keep
 * this file as a global file. Having imports will automatically convert
 * the file from being global to a module.
 * We therefore have to remove all traditional imports and use
 * type imports instead (see: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-9.html#import-types)
 * @param {string} src 
 */
function replaceImports (src) {
  const re = id => new RegExp(`\\b${id}\\b(?!\\?)`, 'g')  // match whole word, but not if it's a type assertion (x?: T)
  const { named, destructured } = _getImports(src)

  // remove module imports
  src = src.replaceAll(/^\s*import .* from '.*'.*$/gm, '')

  // split to be able to leave out comments
  let lines = src.split('\n')

  // import * as foo from 'foo'; x: foo.bar
  // v
  // x: import('foo').bar
  for (const { alias, package } of named) {
    lines = lines.map(l => l.match(/\s*\*/) ? l : l.replaceAll(re(alias), `import('${package}')`))
  }

  // import { bar } from 'foo'; x: bar
  // v
  // x: import('foo').bar
  for (const { package, properties } of destructured) {
    for (const prop of properties) {
      lines = lines.map(l => l.match(/\s*\*/) ? l : l.replaceAll(re(prop), `import('${package}').${prop}`))
    }
  }
  return lines.join('\n')
}

;(async () => {

  const rollupFile = './dist/cds-types.d.ts'
  let rollup = (await readFile(rollupFile)).toString()

  rollup = replaceImports(rollup)

  // fix `delete` keyword as const - api-extractor does not support it
  rollup = rollup
    .replace(`export declare const delete: Service['delete'];`,
             `declare const delete_: Service['delete'];\nexport { delete_ as delete };`)
    .replace(/^(\s*)delete,/m, `$1delete_ as delete,`)

  // augmented namespaces like 'global' are not supported by api-extractor
  // see https://github.com/microsoft/rushstack/issues/1709
  // so copy file contents manually
  if (!rollup.includes('declare global')) { // for idempotency
    const filterFile = (await readFile('./apis/global.d.ts')).toString()
      .replace(/^.*?import .*?\n/mgs, '') // strip off import as this would be wrong in rollup
    rollup += filterFile
  }

  // put all exports into an augmented module declaration. Remove all "declare" modifiers
  // as they will now already be in an ambient context
  //rollup = rollup.replaceAll('declare ','')
  rollup = `declare module '@sap/cds' {\n${rollup}\n}`

  await writeFile(rollupFile, rollup)

})()
