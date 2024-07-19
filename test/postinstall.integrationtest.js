const cp = require('node:child_process')
const fs = require('node:fs').promises
const os = require('node:os')
const path = require('node:path')
const util = require('node:util')

const execAsync = util.promisify(cp.exec)


describe('postinstall', () => {
    jest.setTimeout(40 * 1000) // timeout 40s for windows

    const cdsTypesRoot = path.join(__dirname, '..')
    let packageTgz
    let tempFolder

    beforeAll(async () => {
        // build dist folder
        await execAsync('npm run rollup', { cwd: cdsTypesRoot })

        // pack tarball
        const { stdout: packageName } = await execAsync(`npm pack`, { cwd: cdsTypesRoot })
        packageTgz = path.join(cdsTypesRoot, packageName.trim())
    })

    beforeEach(async () => {
        tempFolder = await fs.mkdtemp(path.join(os.tmpdir(), 'postinstall-'))
    })

    afterEach(async () => {
        await fs.rm(tempFolder, { recursive: true, force: true })
    })

    afterAll(async () => {
        await fs.rm(packageTgz)
    })

    test('create symlink correctly', async () => {
        const projectFolder = path.join(tempFolder, 'cds_prj')
        await fs.mkdir(projectFolder, { recursive: true, force: true })

        // await execAsync(`npm i -D ${packageTgz}`, { cwd: projectFolder })
        await execAsync(`npm i -D ${cdsTypesRoot}`, { cwd: projectFolder })

        let typesPackageJsonFile = path.join(projectFolder, 'node_modules/@types/sap__cds/package.json')
        let typesPackageJsonFileContent = await fs.readFile(typesPackageJsonFile, 'utf8')
        let packageJson = JSON.parse(typesPackageJsonFileContent)
        expect(packageJson.name).toBe('@cap-js/cds-types')

        const newProjectFolder = path.join(tempFolder, 'cds_prj_new')
        await fs.rename(projectFolder, newProjectFolder)

        typesPackageJsonFile = path.join(newProjectFolder, 'node_modules/@types/sap__cds/package.json')
        typesPackageJsonFileContent = await fs.readFile(typesPackageJsonFile, 'utf8')
        packageJson = JSON.parse(typesPackageJsonFileContent)
        expect(packageJson.name).toBe('@cap-js/cds-types')
    })
})
