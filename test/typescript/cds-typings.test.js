const { join } = require('path')
const { checkTranspilation } = require('./tsutil')

describe('cds typings', () => {
  test('cds use compilation', async () => checkTranspilation(__dirname, { esModuleInterop: true }))
  // checks whether the API files transpile without error
  test('cds API compilation', async () => checkTranspilation(join(__dirname, '..', '..', 'apis')))
})