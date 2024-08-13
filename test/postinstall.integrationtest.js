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
        // console.log(`tempFolder: ${tempFolder}`)
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
            await execAsync('npm i --foreground-scripts', { cwd: newProjectFolder })
        }

        typesPackageJsonFile = path.join(newProjectFolder, 'node_modules/@types/sap__cds/package.json')
        typesPackageJsonFileContent = await fs.readFile(typesPackageJsonFile, 'utf8')
        packageJson = JSON.parse(typesPackageJsonFileContent)
        expect(packageJson.name).toBe('@cap-js/cds-types')
    })

    test('create symlink in monorepo', async () => {
        const rootFolder = path.join(tempFolder, 'monorepo')
        await fs.mkdir(rootFolder, { recursive: true, force: true })
        await fs.writeFile(path.join(rootFolder, 'package.json'), JSON.stringify({
            name: 'monorepo', workspaces: [ 'packages/**' ]
        }, null, 2))

        // create a first project, add the dependency to cds-types
        const project1 = path.join(rootFolder, 'packages/project1')
        await fs.mkdir(project1, { recursive: true, force: true })
        await fs.writeFile(path.join(project1, 'package.json'), JSON.stringify({
            name: 'project1'
        }, null, 2))
        {
            // const {stdout, stderr} =
            await execAsync(`npm i --foreground-scripts -dd -D ${cdsTypesRoot}`, { cwd: project1 })
            // console.log(stdout, stderr)
        }
        let packageJson = require(path.join(project1, 'node_modules/@types/sap__cds/package.json'))
        expect(packageJson.name).toBe('@cap-js/cds-types')

        // now create a second project with the dependency
        const project2 = path.join(rootFolder, 'packages/project2')
        await fs.mkdir(project2, { recursive: true, force: true })
        await fs.writeFile(path.join(project2, 'package.json'), JSON.stringify({
            name: 'project2',
            devDependencies: {
                '@cap-js/cds-types': `file:${cdsTypesRoot}`
            }
        }, null, 2))
        {
            // const {stdout, stderr} =
            await execAsync(`npm i --foreground-scripts -dd`, { cwd: project2 })
            // console.log(stdout, stderr)
        }
        packageJson = require(path.join(project2, 'node_modules/@types/sap__cds/package.json'))
        expect(packageJson.name).toBe('@cap-js/cds-types')

    })
})
