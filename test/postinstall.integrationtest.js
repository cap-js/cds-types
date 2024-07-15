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
        cp.execSync(`npm i -D ${projectRoot} `, { cwd: tempFolder })

        const typesPackageJsonFile = path.join(tempFolder, 'node_modules/@types/sap__cds/package.json')
        const typesPackageJsonFileContent = await fs.readFile(typesPackageJsonFile, 'utf8')
        const packageJson = JSON.parse(typesPackageJsonFileContent)
        expect(packageJson.name).toBe('@cap-js/cds-types')
    })
})
