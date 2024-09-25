/**
 * Access to the configuration for Node.js runtime and tools.
 * The object is the effective result of configuration merged from various sources,
 * filtered through the currently active profiles, thus highly dependent on the current working
 * directory and process environment.
 */
export const env: {
  build: _TODO,
  hana: _TODO,
  i18n: {
    languages: string[],
    default_language: string,
    folders: string[],
    [key: string]: any,
  },
  requires: env.Requires,
  folders: {
    app: string,
    db: string,
    srv: string,
    fts: string,
    [key: string]: string, // to allow additional values
  },
  odata: _TODO,
  query: _TODO,
  sql: _TODO,
} & { [key: string]: any } // to allow additional values we have not yet captured

export namespace env {

  interface MockUser {
    tenant?: string
    roles?: string[]
    features?: string[]
  }

  interface MockUsers {
    alice: MockUser
    bob: MockUser
    carol: MockUser
    dave: MockUser
    erin: MockUser
    fred: MockUser
    [key: string]: MockUser | undefined
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  type Requires = {
    auth: {
      kind: 'dummy' | 'mocked' | 'basic' | 'xsuaa' | 'ias' | string,
      impl: string,
      users?: MockUsers,
      tenants?: {
        [key: string]: {
          features?: string[],
        },
      },
      credentials?: Credentials,
      binding?: Binding,
      [key: string]: any,
    },
    db: {
      kind: 'hana' | 'sqlite' | 'sql' | string,
      binding?: Binding,
      [key: string]: any,
    },
    multitenancy?: boolean | { kind: string, jobs: {
      clusterSize: number,
      workerSize: number,
      t0: string,
      [key: string]: any,
    },},
    toggles?: boolean,
    extensibility?: boolean | {
      model: string[],
      tenantCheckInterval: number,
      [key: string]: any,
    },
    messaging?: {
      kind: 'file-based-messaging' | 'redis-messaging' | 'local-messaging' | 'enterprise-messaging' | 'enterprise-messaging-shared' | string,
      format: 'cloudevents' | string,
      [key: string]: any,
    },
    'cds.xt.SaasProvisioningService'?: {
      model: string,
      kind: string,
      alwaysUpgradeModel?: boolean,
      [key: string]: any,
    },

    'cds.xt.SmsProvisioningService'?: {
      model: string,
      kind: string,
      [key: string]: any,
    },
    'cds.xt.ExtensibilityService'?: {
      model: string,
      'namespace-blocklist': string[],
      'extension-allowlist': { for: string[], 'new-entities'?: number }[],
      [key: string]: any,
    },
    'cds.xt.ModelProviderService'?: {
      model: string,
      root: string,
      [key: string]: any,
    },
    'cds.xt.DeploymentService'?: {
      model: string,
      [key: string]: any,
    },
    [key: string]: any,
  }

  type Binding = {
    type: 'cf' | 'k8s' | string,
    apiEndpoint?: string,
    org?: string,
    space?: string,
    instance?: string,
    key?: string,
  }

  type Credentials = {
    clientid?: string,
    clientsecret?: string,
    url?: string,
    xsappname?: string,
    certurl?: string,
    certificate?: string,
    [key: string]: any,
  }
}

/**
 * DO NOT USE
 * @internal
 */
type _TODO = any

