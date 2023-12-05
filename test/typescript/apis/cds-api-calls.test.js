const { join } = require('path')
const fs = require('fs').promises
const { checkProject } = require('../tsutil')

describe('API calls typings', () =>
  // checks design-time presence of several properties called in the various .ts files
  test('all', () => checkProject(join(__dirname, 'project', 'tsconfig.json')))
)