/**
 * Access to the configuration for Node.js runtime and tools.
 * The object is the effective result of configuration merged from various sources,
 * filtered through the currently active profiles, thus highly dependent on the current working
 * directory and process environment.
 */
export const env: {
  build: any,
  hana: any,
  i18n: any,
  mtx: any,
  requires: any,
  folders: any,
  odata: any,
  query: any,
  sql: any,
} & { [key: string]: any } // to allow additional values we have not yet captured

export const requires: any
export const version: string
export const home: string
export const root: string
