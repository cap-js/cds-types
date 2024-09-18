import cds from '@sap/cds';

cds.version === '1.2.3'
cds.home === 'path/to/cds'
cds.root === 'path/to/project'
cds.requires === cds.env.requires

cds.cli!.argv = ['']
cds.cli!.options = { foo: true }
cds.cli!.command = 'deploy'
cds.cli!.command = 'unknown-command'
//@ts-expect-error
cds.cli!.command = true
