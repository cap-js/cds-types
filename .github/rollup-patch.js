#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-var-requires*/
/* eslint-disable no-undef */
const { readFile, writeFile } = require('fs/promises')

/** @param {string} src */
function _getImports (src) {
  const named = []
  const destructured = []
  for (const [, what, from] of [...src.matchAll(/import (?:\* as )?(.*) from '(.*)'/g)]) {
    if (what.includes('{')) {
      destructured.push({
        package: from.trim(),
        properties: what.replace('{','').replace('}','').split(',').map(p => p.trim())
      })
    } else {
      named.push({
        package: from,
        alias: what.trim()
      })
    }
  }
  return { named, destructured }
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
  const re = id => new RegExp(`\\b${id}\\b(?!\\?|:)`, 'g')  // match whole word, but only if it's a type assertion (x?: T)
  const { named, destructured } = _getImports(src)

  function replace (l, what, wth) {
    if (l.match(/\s*\*/)) return l // ignore comments
    const [head, ...tail] = l.split(':')
    if (!tail.length) return l  // ignore lines not containing type-stuff
    return [head, tail.map(p => p.replaceAll(what, wth))]
      .flat()
      .join(':')
  }

  // remove module imports
  src = src.replaceAll(/^\s*import .* from '.*'.*$/gm, '')

  // split to be able to skip comments
  let lines = src.split('\n')

  // import * as foo from 'foo'; const x: foo.bar
  // v
  // x: import('foo').bar
  for (const { alias, package } of named) {
    lines = lines.map(l => replace(l, re(alias), `import('${package}')`))
  }

  // import { bar } from 'foo'; const x: bar
  // v
  // x: import('foo').bar
  for (const { package, properties } of destructured) {
    for (const prop of properties) {
      lines = lines.map(l => replace(l, re(prop), `import('${package}').${prop}`))
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
  rollup = rollup.replaceAll('declare ','')
  rollup = `declare module '@sap/cds' {\n${rollup}\n}`

  await writeFile(rollupFile, rollup)

})()
