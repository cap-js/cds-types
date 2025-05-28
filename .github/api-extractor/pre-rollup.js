#!/usr/bin/env node

/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */

const { readFile, writeFile } = require('fs/promises')

async function pre() {
    /**
     * @type {{
     * changesToRevert: [
     *   { file: string, originalContent: string }  
     * ]
     * }}
     */
    const result = {
        changesToRevert: []
    }

    // api-extractor can not compute "export * from 'installed-package'" statements.
    // We need those to export the cds-dk types, but we also need them in dev scenarios,
    // so we can't just add that export as post processing.
    // Instead, we remove it before the rollup happens, add it back into the source file afterwards,
    // and also edit it into the rollup file as part of the post processing.
    const facadeFile = './apis/facade.d.ts'
    const originalFacade = (await readFile(facadeFile)).toString()
    const cleanedFacade = originalFacade
        .replaceAll(/^\s*export .* from .+@sap\/cds-dk.+/mg, '') // ".+" to work around arbitrary and escaped quotes 
    await writeFile(facadeFile, cleanedFacade)
    result.changesToRevert.push({
        file: facadeFile,
        originalContent: originalFacade
    })
    return result
}

module.exports = { pre }