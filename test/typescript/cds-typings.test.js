const { join } = require('path')
const { checkTranspilation } = require('./tsutil')
const { existsSync } = require('fs')
const { test, describe } = require('node:test')

describe('cds typings', () => {
  test('should compile cds use', async () => checkTranspilation(__dirname, { esModuleInterop: true }))

  // checks whether apis/ files transpile without error
  // can only do this if we're not in rollup mode
  const apis = join(__dirname, '../../apis')
  if (existsSync(apis)) {
    test('should compile cds API', async () => checkTranspilation(apis))
  }
})