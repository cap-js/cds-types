import { env } from '@sap/cds'

env.folders.db = ''
env.folders.srv = ''
env.folders.app = ''
env.folders.fts = ''
env.folders.foo = ''

env.build = ''
env.hana = ''

env.log.levels['cli'] === 'debug'
env.log.cls_custom_fields.length
env.log.als_custom_fields['query'] === 0
Object.keys(env.log.als_custom_fields)

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

env.requires['cds.xt.SaasProvisioningService'] = { kind: 'saas-registry', model: '@sap/cds-mtxs/srv/cf/saas-provisioning-service' }
env.requires['cds.xt.SmsProvisioningService'] = { kind: 'subscription-manager', model: '@sap/cds-mtxs/srv/cf/sms-provisioning-service' }
env.requires['cds.xt.ExtensibilityService'] = { model: '@sap/cds-mtxs/srv/extensibility-service' }
env.requires['cds.xt.ModelProviderService'] = { model: '@sap/cds-mtxs/srv/model-provider', _in_sidecar: true, root: '../..' }
env.requires['cds.xt.DeploymentService'] = { model: '@sap/cds-mtxs/srv/deployment-service' }

env.profiles.includes("development")
env.profiles.length > 2

env.requires.multitenancy = { kind: 'shared', jobs: { clusterSize:1, workerSize:1, t0:'', foo:'' }}
env.requires.messaging = { kind: '', format: '', foo: '' }

env.foo = {}

// exported types through namespace 'env'
const req = {} as env.Requires
const users = {} as env.MockUsers
const alice = {} as env.MockUser
