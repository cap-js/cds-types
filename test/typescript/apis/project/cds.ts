import cds from '@sap/cds';

cds.version === '1.2.3'
cds.home === 'path/to/cds'
cds.root === 'path/to/project'
cds.requires === cds.env.requires

cds.cli!.command = 'foo'
cds.cli!.argv = ['']
cds.cli!.opts = { foo: true }
