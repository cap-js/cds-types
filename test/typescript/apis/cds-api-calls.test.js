const { join } = require('path')
const { checkProject } = require('../tsutil')
const { existsSync } = require('fs')
const { test, describe } = require('node:test')

// checks design-time presence of several properties called in the various .ts files
describe('API calls typings', () => {
  const tsconfig = join(__dirname, 'project', 'tsconfig.json')

  const apis = join(__dirname, '../../../apis')
  if (existsSync(apis)) {
    test('should check all API calls', () => checkProject(tsconfig))
  }
  // rollup mode: can only test external APIs
  else {
    const testsWithInternalAPIs = [
      /cds-linked.ts/,
      /cds-ql.ts/
    ]
    const onlyExternalAPIs = (file) => !testsWithInternalAPIs.some(p => p.test(file))
    test('should check external API calls', () => checkProject(tsconfig, onlyExternalAPIs))
  }
})