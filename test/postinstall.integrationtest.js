const cp = require('node:child_process')
const fs = require('node:fs').promises
const os = require('node:os')
const path = require('node:path')
const util = require('node:util')

const execAsync = util.promisify(cp.exec)
const IS_WIN = os.platform() === 'win32'


describe('postinstall', () => {
    jest.setTimeout(40 * 1000) // timeout 40s for windows

    const cdsTypesRoot = path.join(__dirname, '..')
    let tempFolder

    beforeEach(async () => {
        tempFolder = await fs.mkdtemp(path.join(os.tmpdir(), 'postinstall-'))
    })

    afterEach(async () => {
        await fs.rm(tempFolder, { recursive: true, force: true })
    })

    test('create symlink correctly', async () => {
        const projectFolder = path.join(tempFolder, 'cds_prj')
        await fs.mkdir(projectFolder, { recursive: true, force: true })

        await execAsync(`npm i -D ${cdsTypesRoot}`, { cwd: projectFolder })

        let typesPackageJsonFile = path.join(projectFolder, 'node_modules/@types/sap__cds/package.json')
        let typesPackageJsonFileContent = await fs.readFile(typesPackageJsonFile, 'utf8')
        let packageJson = JSON.parse(typesPackageJsonFileContent)
        expect(packageJson.name).toBe('@cap-js/cds-types')

        // rename the project folder
        const newProjectFolder = path.join(tempFolder, 'cds_prj_new')
        await fs.rename(projectFolder, newProjectFolder)

        // after renaming the project folder, the symlink must be recreated on windows
        if (IS_WIN) {
            await execAsync('npm i', { cwd: newProjectFolder })
        }

        typesPackageJsonFile = path.join(newProjectFolder, 'node_modules/@types/sap__cds/package.json')
        typesPackageJsonFileContent = await fs.readFile(typesPackageJsonFile, 'utf8')
        packageJson = JSON.parse(typesPackageJsonFileContent)
        expect(packageJson.name).toBe('@cap-js/cds-types')
    })
})
