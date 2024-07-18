const cp = require('node:child_process')
const fs = require('node:fs').promises
const os = require('node:os')
const path = require('node:path')
const util = require('util')

const execAsync = util.promisify(cp.exec)


describe('postinstall', () => {
    jest.setTimeout(40 * 1000) // timeout 40s for windows

    let tempFolder

    beforeEach(async () => {
        tempFolder = await fs.mkdtemp(path.join(os.tmpdir(), 'postinstall-'))
    })

    afterEach(async () => {
        await fs.rm(tempFolder, { recursive: true, force: true })
    })

    test('create symlink correctly', async () => {
        let out = await execAsync('powershell -Command "Get-ItemProperty -Path \'HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\AppModelUnlock\'"', { shell: 'cmd', cwd: tempFolder });
        console.log(out.stdout);

        try {
            out = await execAsync('net session', { cwd: tempFolder })
            console.log(out.stdout)
            console.log(out.stderr)
        } catch (e) {
            console.error(e)
        }

        const projectRoot = path.join(__dirname, '..')
        await execAsync(`npm i -D ${projectRoot} `, { cwd: tempFolder })

        console.log('projectRoot', projectRoot)
        console.log('tempFolder', tempFolder)

        const typesPackageJsonFile = path.join(tempFolder, 'node_modules/@types/sap__cds/package.json')
        const typesPackageJsonFileContent = await fs.readFile(typesPackageJsonFile, 'utf8')
        const packageJson = JSON.parse(typesPackageJsonFileContent)
        expect(packageJson.name).toBe('@cap-js/cds-types')
    })
})
