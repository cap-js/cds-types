#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-var-requires*/
/* eslint-disable no-undef */
const { readFile, writeFile } = require('fs/promises')

;(async () => {

  const rollupFile = './dist/cds-types.d.ts'
  let rollup = (await readFile(rollupFile)).toString()

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

  await writeFile(rollupFile, rollup)

})()
