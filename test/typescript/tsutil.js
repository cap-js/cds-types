const fs = require('fs').promises
const ts = require('typescript')
const { join, dirname } = require('path')

/**
 * Checks a parsed TS program for error diagnostics.
 */
function checkProgram (program) {
    const emitResult = program.emit()
    const diagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics)

    const errors = diagnostics.map(diag => {
        const message = ts.flattenDiagnosticMessageText(diag.messageText, '\n')
        // ignore errors that were caused by dependencies
        if (diag.file && diag.file.fileName.indexOf('node_modules') === -1) {
          const { line } = diag.file.getLineAndCharacterOfPosition(diag.start)
          return `${diag.file.fileName}:${line + 1}: ${message}`
        }
      }).filter(Boolean)

      if (errors.length) {
        throw new Error(`Several errors occurred during the compilation of the API types:\n${errors.join('\n')}`)
      }
}

/**
 * Reads a TS project from a tsconfig.json, parses it, and checks for errors.
 */
async function checkProject (tsconfig, fileFilter = () => true) {
    const { config } = ts.readConfigFile(tsconfig, ts.sys.readFile)
    const parsedConfig = ts.parseJsonConfigFileContent(config, ts.sys, dirname(tsconfig))
    const compilerOptions = {...{
        noEmit: true,
        rootNames: parsedConfig.fileNames.filter(fileFilter),
        configFilePath: tsconfig
    }, ...parsedConfig}
    const program = ts.createProgram(compilerOptions)
    checkProgram(program)
}

/**
 * Parses a list of .ts files, and checks them for errors.
 */
async function checkTranspilation (input, opts = {}) {
    const apiFiles = (await fs.lstat(input)).isDirectory()
        ? (await fs.readdir(input))
            .filter(f => f.endsWith('.ts') )
            .map(f => join(input, f))
        : input

    const options = {...{ noEmit: true }, ...opts}
    const program = ts.createProgram({ rootNames: apiFiles, options })
    checkProgram(program)
  }

module.exports = { checkTranspilation, checkProject }