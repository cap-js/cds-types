const { join } = require('path')
const { checkProject } = require('../tsutil')
const { existsSync } = require('fs')

// checks design-time presence of several properties called in the various .ts files
describe('API calls typings', () => {
  const tsconfig = join(__dirname, 'project', 'tsconfig.json')

  const apis = join(__dirname, '../../../apis')
  if (existsSync(apis)) {
    test('all', () => checkProject(tsconfig))
  }
  // rollup mode: can only test external APIs
  else {
    const testsWithInternalAPIs = [
      /cds-linked.ts/,
      /cds-ql.ts/
    ]
    const onlyExternalAPIs = (file) => !testsWithInternalAPIs.some(p => p.test(file))
    test('external APIs', () => checkProject(tsconfig, onlyExternalAPIs))
  }

})