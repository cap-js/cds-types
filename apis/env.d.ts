/**
 * Access to the configuration for Node.js runtime and tools.
 * The object is the effective result of configuration merged from various sources,
 * filtered through the currently active profiles, thus highly dependent on the current working
 * directory and process environment.
 */
type TODO = any

export const env: {
  build: TODO,
  hana: TODO,
  i18n: {
    languages: string[],
    default_language: string,
    folders: string[],
    [key: string]: any,
  },
  requires: _requires,
  folders: {
    app: string,
    db: string,
    srv: string,
    fts: string,
    [key: string]: string,
  },
  odata: TODO,
  query: TODO,
  sql: TODO,
} & { [key: string]: any } // to allow additional values we have not yet captured

type _extensibility = boolean | {
  model: string[],
  tenantCheckInterval: number = 60000,
  [key: string]: any,
}

type _binding = {
  type: 'cf' | 'k8s' | string,
  apiEndpoint?: string,
  org?: string,
  space?: string,
  instance?: string,
  key?: string,
}

interface User {
  tenant?: string
  roles?: string[]
  features?: string[]
}

interface Users {
  alice: User, bob: User, carol: User, dave: User, erin: User, fred: User
  [key: string]: User | undefined
}

type _requires = {
  auth: {
    kind: 'dummy' | 'mocked' | 'basic' | 'xsuaa' | 'ias' | string,
    impl: string,
    users?: Users,
    tenants?: {
      [key: string]: {
        features?: string[]
      }
    },
    credentials?: _credentials,
    binding?: _binding,
    [key: string]: any
  },
  db: {
    kind: 'hana' | 'sqlite' | 'sql' | string,
    binding?: _binding
  },
  multitenancy: boolean | { kind: string, jobs: {
    clusterSize: number,
    workerSize: number,
    t0: string,
  }},
  toggles: boolean,
  extensibility: _extensibility,
  messaging: {
    kind: 'file-based-messaging' | 'redis-messaging' | 'local-messaging' | 'enterprise-messaging' | 'enterprise-messaging-shared' | string,
    format: 'cloudevents' | string
  },
  [key: string]: any
}

type _binding = {
  type: 'cf' | 'k8s' | string,
  apiEndpoint?: string,
  org?: string,
  space?: string,
  instance?: string,
  key?: string,
}

type _credentials = {
  clientid?: string,
  clientsecret?: string,
  url?: string,
  xsappname?: string,
  certurl?: string,
  certificate?: string,
  [key: string]: any,
}

export const requires: _requires
export const version: string
export const home: string
export const root: string
