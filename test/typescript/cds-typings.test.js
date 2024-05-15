const { join } = require('path')
const { checkTranspilation } = require('./tsutil')
const { existsSync } = require('fs')

describe('cds typings', () => {
  test('cds use compilation', async () => checkTranspilation(__dirname, { esModuleInterop: true }))

  // checks whether the API files transpile without error
  const apis = join(__dirname, '../../apis')
  if (existsSync(apis)) {
    test('cds API compilation', async () => checkTranspilation(apis))
  }
})