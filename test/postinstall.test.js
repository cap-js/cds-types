const cp = require('node:child_process')
const fs = require('node:fs').promises
const os = require('node:os')
const path = require('node:path')


describe('postinstall', () => {
    jest.setTimeout(30000)

    let tempFolder

    beforeEach(async () => {
        tempFolder = await fs.mkdtemp(path.join(os.tmpdir(), 'postinstall-'))
    })

    afterEach(async () => {
        await fs.rm(tempFolder, { recursive: true, force: true })
    })

    test('create symlink correctly', async () => {

        const projectRoot = path.join(__dirname, '..')
        cp.execSync('npm init -y', { cwd: tempFolder })
        cp.execSync(`npm i ${projectRoot} `, { cwd: tempFolder })

        const types = path.join(tempFolder, 'node_modules/@types/xsap__cds/package.json')
        const packageJson = await fs.readFile(types, 'utf8')
        const packageJsonObj = JSON.parse(packageJson)
        expect(packageJsonObj.name).toBe('@cap-js/cds-types')
    })
})
