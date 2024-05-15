#!/usr/bin/env node

(async () => {

  const { readFile, writeFile } = require('fs/promises')
  const rollupFile = './dist/cds-types.d.ts'
  let rollup = (await readFile(rollupFile)).toString()

  rollup = rollup
    .replace(`export declare const delete: Service\['delete'\];`, `declare const delete_: Service['delete'];\nexport { delete_ as delete };`)
    .replace(/^(\s*)delete,/m, `$1delete_ as delete,`)


  // augmented namespaces are not supported by api-extractor
  // see https://github.com/microsoft/rushstack/issues/1709
  if (!rollup.includes('declare global')) {
    const filterFile = (await readFile('./apis/global.d.ts')).toString()
    rollup += filterFile
  }

  await writeFile(rollupFile, rollup)

})()
