/**
 * Access to the configuration for Node.js runtime and tools.
 * The object is the effective result of configuration merged from various sources,
 * filtered through the currently active profiles, thus highly dependent on the current working
 * directory and process environment.
 */
export const env: {
  build: any,
  hana: any,
  requires: _requires,
  folders: {
    app: string,
    db: string,
    srv: string,
    fts: string,
    [key: string]: string
  },
  i18n: {
    languages: [string],
    default_language: string
    folders: [string],
    [key: string]: any
  },
  odata: any,
  query: any,
  sql: any,
} & { [key: string]: any } // to allow additional values we have not yet captured

type _extensibility = boolean | {
  model: [string],
  tenantCheckInterval: number = 1000
}

type _binding = {
  type: 'cf' | 'k8s' | string,
  apiEndpoint?: 'string',
  org?: 'string',
  space?: 'string',
  instance?: 'string',
  key?: 'string'
}

type _requires = {
  auth: {
    kind: 'dummy' | 'mocked' | 'basic' | 'xsuaa' | 'ias' | string,
    impl: string,
    users?: {
      [key: 'alice' | 'bob' | 'carol' | 'dave' | 'erin' | 'fred' | string]: {
        tenant?: string
        roles?: [string],
        features?: [string]
      }
    },
    tenants?: {
      [key: string]: {
        features?: [string]
      }
    },
    credentials?: {

    }
  },
  db: {
    kind: 'hana' | 'sqlite' | 'sql' | string
  },
  multitenancy: boolean | { kind: string, jobs: { clusterSize: number, workerSize: number } },
  extensibility: _extensibility,
  messaging: {
    kind: 'file-based-messaging' | 'redis-messaging' | 'local-messaging' | 'enterprise-messaging' | 'enterprise-messaging-shared'
  },
}

type _requiresMTX = {
  'cds.xt.SaasProvisioningService': boolean,
  'cds.xt.DeploymentService': boolean,
  'cds.xt.ModelProviderService': boolean,
  'cds.xt.JobsService': boolean,
  'cds.xt.ExtensibilityService': boolean,
}

export const requires: _requires
export const version: string
export const home: string
export const root: string
