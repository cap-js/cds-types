const { join } = require('path')
const { checkTranspilation } = require('./tsutil')
const { existsSync } = require('fs')

describe('cds typings', () => {
  test('cds use compilation', async () => checkTranspilation(__dirname, { esModuleInterop: true }))

  // checks whether apis/ files transpile without error
  // can only do this if we're not in rollup mode
  const apis = join(__dirname, '../../apis')
  if (existsSync(apis)) {
    test('cds API compilation', async () => checkTranspilation(apis))
  }
})