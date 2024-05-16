import { env } from '../../../..'

env.folders.db = ''
env.folders.srv = ''
env.folders.app = ''
env.folders.fts = ''
env.folders.foo = ''

env.build = ''
env.hana = ''

env.requires.auth.kind = ''
env.requires.auth.credentials!.url = ''
env.requires.auth.credentials!.clientid = ''
env.requires.auth.binding!.key = ''
env.requires.auth.binding!.type = 'cf'
env.requires.auth.tenants!.foo.features = []

env.requires.auth.users!.alice.roles = []
env.requires.auth.users!.bob.features = []
env.requires.auth.users!.carol.tenant = ''
env.requires.auth.users!.dave = {}
env.requires.auth.users!.TEST = {}

env.requires.db.kind = 'hana'
env.requires.db.binding!.key = 'cf'

env.requires.multitenancy = { kind: 'shared', jobs: { clusterSize:1, workerSize:1, t0:'', foo:'' }}
env.requires.messaging = { kind: '', format: '', foo: '' }

env.foo = {}
